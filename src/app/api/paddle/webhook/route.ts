import { NextResponse } from "next/server";
import { EventName } from "@paddle/paddle-node-sdk";
import type { CustomData, EventEntity } from "@paddle/paddle-node-sdk";
import { paddle, supabaseAdmin, PaddleNotConfigured } from "@/lib/paddle/server";

// The shape shared by every subscription.* notification payload we act on.
// Kept minimal and structural rather than importing the SDK's per-event
// notification types, which differ slightly (e.g. *Created carries an extra
// transactionId) but all satisfy this.
interface SubscriptionPayload {
  id: string;
  status: string;
  customerId: string;
  customData: CustomData | null;
  items: Array<{ price?: { id?: string } | null }>;
  currentBillingPeriod: { endsAt: string } | null;
  scheduledChange: { action: string } | null;
  updatedAt: string;
}

// The ONLY thing that may grant entitlement.
//
// subscriptions has no write policy, so a browser cannot make itself Pro; this
// route holds the service-role key and is the single path in. That is only
// worth anything if the signature is verified -- an unverified webhook endpoint
// is an unauthenticated "make me Pro" API, since anyone can POST JSON to it.
export async function POST(req: Request) {
  let event: EventEntity;
  try {
    const secret = process.env.PADDLE_WEBHOOK_SECRET;
    if (!secret)
      return NextResponse.json({ error: "PADDLE_WEBHOOK_SECRET is not set" }, { status: 503 });

    const sig = req.headers.get("paddle-signature");
    if (!sig) return NextResponse.json({ error: "missing signature" }, { status: 400 });

    // The RAW body is required: Paddle signs the exact bytes, so parsing to
    // JSON first and re-serialising would change them and fail verification.
    const raw = await req.text();
    event = await paddle().webhooks.unmarshal(raw, secret, sig);
    if (!event) throw new Error("invalid signature");
  } catch (e) {
    if (e instanceof PaddleNotConfigured)
      return NextResponse.json({ error: e.message }, { status: 503 });
    // Do not echo the reason: a caller probing this endpoint should learn
    // nothing beyond "rejected".
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  try {
    const db = supabaseAdmin();

    const save = async (sub: SubscriptionPayload) => {
      // Prefer the custom data set at checkout; fall back to the customer id
      // we already stored, so a subscription created outside our checkout
      // still lands on the right user.
      let userId = sub.customData?.supabase_user_id as string | undefined;
      if (!userId) {
        const { data } = await db.from("subscriptions")
          .select("user_id").eq("stripe_customer_id", sub.customerId).maybeSingle();
        userId = data?.user_id;
      }
      if (!userId) {
        console.log("paddle webhook: no matching user for customer", sub.customerId);
        return;   // nothing we can attribute it to
      }

      // Deliveries are at-least-once and can arrive out of order. `updated_at`
      // holds Paddle's own last-modified time for this subscription (not our
      // write time), so a stale retry or a late duplicate can never clobber a
      // newer state with older data.
      const { data: existing } = await db.from("subscriptions")
        .select("updated_at").eq("user_id", userId).maybeSingle();
      if (existing?.updated_at && new Date(existing.updated_at) >= new Date(sub.updatedAt)) {
        console.log("paddle webhook: ignoring stale event for", userId);
        return;
      }

      // Column names are inherited from the Stripe schema and left unchanged
      // -- they now hold Paddle ids.
      await db.from("subscriptions").upsert({
        user_id: userId,
        stripe_customer_id: sub.customerId,
        stripe_subscription_id: sub.id,
        status: sub.status,
        price_id: sub.items?.[0]?.price?.id ?? null,
        current_period_end: sub.currentBillingPeriod?.endsAt ?? null,
        cancel_at_period_end: sub.scheduledChange?.action === "cancel",
        updated_at: sub.updatedAt,
      }, { onConflict: "user_id" });
    };

    switch (event.eventType) {
      case EventName.SubscriptionCreated:
      case EventName.SubscriptionUpdated:
      case EventName.SubscriptionActivated:
      case EventName.SubscriptionCanceled:
      case EventName.SubscriptionPaused:
      case EventName.SubscriptionResumed:
      case EventName.SubscriptionTrialing:
      case EventName.SubscriptionPastDue:
        await save(event.data as unknown as SubscriptionPayload);
        break;
      case EventName.TransactionCompleted:
        // Logged for visibility while testing the integration -- entitlement
        // is granted by the subscription.* events above, never from this.
        console.log("paddle transaction.completed", (event.data as { id: string }).id);
        break;
      case EventName.CustomerCreated:
      case EventName.CustomerUpdated:
        // No separate customers table -- Supabase auth.users is the customer
        // record. Logged for visibility only.
        console.log(`paddle ${event.eventType}`, (event.data as { id: string }).id);
        break;
      default:
        break;   // acknowledged and ignored; Paddle sends far more than we use
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    // A 500 makes Paddle retry, which is what we want for a transient failure.
    console.error("paddle webhook handler failed", e);
    return NextResponse.json({ error: "handler failed" }, { status: 500 });
  }
}
