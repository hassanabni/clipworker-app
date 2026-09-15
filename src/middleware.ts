import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Refreshes the auth cookie. Without this the session expires mid-use and the
// user is silently signed out between page loads.
//
// It runs only where a signed-in user matters (see `matcher`). It used to run on
// every request, marketing pages and link prefetches included, and each run is
// a round trip to Supabase: measured on staging 2026-09-15, a cached static page
// took ~0.31s vs ~0.14s for a path the middleware skips. The public pages
// (/product, /use-cases, /company, /request-access, legal) never read the user,
// so they are now served straight from the CDN.
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  await supabase.auth.getUser();
  return response;
}

export const config = {
  // Only routes that read the signed-in user: the dashboard, the APIs, the auth
  // screens, and the two public pages that check for a session ("/" sends a
  // signed-in visitor to /app; /pricing shows their plan). auth/callback stays
  // excluded, as before -- it exchanges the code itself.
  matcher: [
    "/",
    "/app/:path*",
    "/api/:path*",
    "/login",
    "/auth/reset",
    "/auth/update-password",
    "/pricing",
  ],
};
