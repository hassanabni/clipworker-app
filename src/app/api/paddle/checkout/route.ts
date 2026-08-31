import { NextResponse } from "next/server";
import { currentUser } from "@/lib/supabase/server";
import { paddle, PRICE_ID, PaddleNotConfigured, supabaseAdmin } from "@/lib/paddle/server";

// Paddle checkout runs client-side (the Paddle.js overlay), so unlike Stripe
// there is no session URL to hand back. This route's only job is to make sure
// a Paddle customer exists for this user -- reused if we already made one, so
// a returning subscriber does not accumulate duplicate Paddle customers -- and
// to return the price id from the server, never the request: a client-supplied
// price id is how people buy the $0 plan.
export async function POST() {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });
    if (!PRICE_ID)
      return NextResponse.json({ error: "PADDLE_PRICE_ID is not set" }, { status: 503 });

    // Column names are inherited from the Stripe schema and left unchanged --
    // they now hold Paddle ids.
    const { data: existing } = await supabaseAdmin()
      .from("subscriptions").select("stripe_customer_id").eq("user_id", user.id).maybeSingle();

    let customerId = existing?.stripe_customer_id ?? undefined;
    if (!customerId) {
      const customer = await paddle().customers.create({
        email: user.email ?? "",
        customData: { supabase_user_id: user.id },
      });
      customerId = customer.id;
      await supabaseAdmin().from("subscriptions").upsert({
        user_id: user.id, stripe_customer_id: customerId, status: "inactive",
      });
    }

    return NextResponse.json({
      priceId: PRICE_ID, customerId, userId: user.id, email: user.email ?? null,
    });
  } catch (e) {
    if (e instanceof PaddleNotConfigured)
      return NextResponse.json({ error: e.message }, { status: 503 });
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
