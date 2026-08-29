import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** Server client bound to the request's cookies, so it acts AS the signed-in user.
 *
 * This is deliberately not the service-role client. Reading and writing jobs
 * through the user's own session means Row Level Security enforces isolation in
 * Postgres -- a bug in a route handler cannot leak another user's clips,
 * because the database itself refuses. The service role is reserved for the
 * worker, which connects directly and legitimately needs to see every job.
 */
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component, where cookies are read-only.
            // The middleware refreshes the session instead.
          }
        },
      },
    }
  );
}

/** The signed-in user, or null. */
export async function currentUser() {
  const supabase = await createClient();
  // getUser() revalidates the token with Supabase. getSession() only reads the
  // cookie, which a client could have tampered with -- never trust it for
  // authorisation decisions.
  const { data, error } = await supabase.auth.getUser();
  return error ? null : data.user;
}
