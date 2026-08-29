import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe, supabaseAdmin, StripeNotConfigured } from "@/lib/stripe/server";

// The ONLY thing that may grant entitlement.
//
// subscriptions has no write policy, so a browser cannot make itself Pro; this
// route holds the service-role key and is the single path in. That is only
// worth anything if the signature is verified -- an unverified webhook endpoint
// is an unauthenticated "make me Pro" API, since anyone can POST JSON to it.
export async function POST(req: Request) {
  let event: Stripe.Event;
  try {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret)
      return NextResponse.json({ error: "STRIPE_WEBHOOK_SECRET is not set" }, { status: 503 });

    const sig = req.headers.get("stripe-signature");
    if (!sig) return NextResponse.json({ error: "missing signature" }, { status: 400 });

    // The RAW body is required: Stripe signs the exact bytes, so parsing to
    // JSON first and re-serialising would change them and fail verification.
    const raw = await req.text();
    event = await stripe().webhooks.constructEventAsync(raw, sig, secret);
  } catch (e) {
    if (e instanceof StripeNotConfigured)
      return NextResponse.json({ error: e.message }, { status: 503 });
    // Do not echo the reason: a caller probing this endpoint should learn
    // nothing beyond "rejected".
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  try {
    const db = supabaseAdmin();

    const save = async (sub: Stripe.Subscription) => {
      const customer = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
      // Prefer metadata; fall back to the customer id we already stored, so a
      // subscription created outside our checkout still lands on the right user.
      let userId = sub.metadata?.supabase_user_id as string | undefined;
      if (!userId) {
        const { data } = await db.from("subscriptions")
          .select("user_id").eq("stripe_customer_id", customer).maybeSingle();
        userId = data?.user_id;
      }
      if (!userId) return;   // nothing we can attribute it to

      const item = sub.items?.data?.[0];
      const periodEnd = (item as any)?.current_period_end ?? (sub as any).current_period_end;

      await db.from("subscriptions").upsert({
        user_id: userId,
        stripe_customer_id: customer,
        stripe_subscription_id: sub.id,
        status: sub.status,
        price_id: item?.price?.id ?? null,
        current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
        cancel_at_period_end: Boolean(sub.cancel_at_period_end),
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });
    };

    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object as Stripe.Checkout.Session;
        if (s.subscription) {
          const sub = await stripe().subscriptions.retrieve(
            typeof s.subscription === "string" ? s.subscription : s.subscription.id);
          if (!sub.metadata?.supabase_user_id && s.client_reference_id) {
            sub.metadata = { ...sub.metadata, supabase_user_id: s.client_reference_id };
          }
          await save(sub);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
      case "customer.subscription.paused":
      case "customer.subscription.resumed":
        await save(event.data.object as Stripe.Subscription);
        break;
      default:
        break;   // acknowledged and ignored; Stripe sends far more than we use
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    // A 500 makes Stripe retry, which is what we want for a transient failure.
    console.error("stripe webhook handler failed", e);
    return NextResponse.json({ error: "handler failed" }, { status: 500 });
  }
}
