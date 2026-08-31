import { NextResponse } from "next/server";
import { currentUser } from "@/lib/supabase/server";
import { paddle, PaddleNotConfigured, supabaseAdmin } from "@/lib/paddle/server";

// Paddle's own customer portal: cancel, update card, see invoices. Building
// those screens ourselves would mean handling card data, which we will not do.
export async function POST() {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });

    const { data: sub } = await supabaseAdmin()
      .from("subscriptions")
      .select("stripe_customer_id, stripe_subscription_id")
      .eq("user_id", user.id).maybeSingle();
    if (!sub?.stripe_customer_id)
      return NextResponse.json({ error: "no billing account yet" }, { status: 400 });

    const session = await paddle().customerPortalSessions.create(
      sub.stripe_customer_id,
      sub.stripe_subscription_id ? [sub.stripe_subscription_id] : []
    );
    return NextResponse.json({ url: session.urls.general.overview });
  } catch (e) {
    if (e instanceof PaddleNotConfigured)
      return NextResponse.json({ error: e.message }, { status: 503 });
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
