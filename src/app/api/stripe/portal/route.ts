import { NextResponse } from "next/server";
import { currentUser } from "@/lib/supabase/server";
import { stripe, StripeNotConfigured, supabaseAdmin } from "@/lib/stripe/server";

// Stripe's own billing portal: cancel, update card, see invoices. Building
// those screens ourselves would mean handling card data, which we will not do.
export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });

    const { data: sub } = await supabaseAdmin()
      .from("subscriptions").select("stripe_customer_id").eq("user_id", user.id).maybeSingle();
    if (!sub?.stripe_customer_id)
      return NextResponse.json({ error: "no billing account yet" }, { status: 400 });

    const session = await stripe().billingPortal.sessions.create({
      customer: sub.stripe_customer_id,
      return_url: `${new URL(req.url).origin}/app`,
    });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    if (e instanceof StripeNotConfigured)
      return NextResponse.json({ error: e.message }, { status: 503 });
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
