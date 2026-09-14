import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Where every emailed auth link lands -- account confirmation and password
// reset. Exchanges the one-time code for a session cookie, then forwards to
// `next` (the reset flow points it at /auth/update-password).
//
// `next` is checked to be a path on this site: an open redirect here would let
// a crafted link carry a real session to somebody else's domain.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const raw = searchParams.get("next") ?? "/app";
  const next = raw.startsWith("/") && !raw.startsWith("//") ? raw : "/app";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
  }
  return NextResponse.redirect(`${origin}/login?error=no_code`);
}
