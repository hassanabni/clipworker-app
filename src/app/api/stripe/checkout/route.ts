import { NextResponse } from "next/server";
import { currentUser } from "@/lib/supabase/server";
import { stripe, PRICE_ID, StripeNotConfigured, supabaseAdmin } from "@/lib/stripe/server";

// Starts a Checkout Session for Pro. The price comes from the server, never
// from the request: a client-supplied price id is how people buy the $0 plan.
export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });
    if (!PRICE_ID)
      return NextResponse.json({ error: "STRIPE_PRICE_ID is not set" }, { status: 503 });

    const origin = new URL(req.url).origin;
    const s = stripe();

    // Reuse the customer if we have made one, so a returning subscriber does
    // not accumulate duplicate Stripe customers.
    const { data: existing } = await supabaseAdmin()
      .from("subscriptions").select("stripe_customer_id").eq("user_id", user.id).maybeSingle();

    let customer = existing?.stripe_customer_id ?? undefined;
    if (!customer) {
      const c = await s.customers.create({
        email: user.email ?? undefined,
        metadata: { supabase_user_id: user.id },
      });
      customer = c.id;
      await supabaseAdmin().from("subscriptions").upsert({
        user_id: user.id, stripe_customer_id: customer, status: "inactive",
      });
    }

    const session = await s.checkout.sessions.create({
      mode: "subscription",
      customer,
      line_items: [{ price: PRICE_ID, quantity: 1 }],
      success_url: `${origin}/app?upgraded=1`,
      cancel_url: `${origin}/pricing`,
      // Carried onto the subscription so the webhook can attribute it even if
      // the session object is gone by the time we see the event.
      subscription_data: { metadata: { supabase_user_id: user.id } },
      client_reference_id: user.id,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    if (e instanceof StripeNotConfigured)
      return NextResponse.json({ error: e.message }, { status: 503 });
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
