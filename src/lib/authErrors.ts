/** Turn Supabase's raw auth errors into something a person can act on.
 *
 * The defaults leak implementation detail ("email rate limit exceeded") or are
 * actively misleading ("Invalid login credentials" for an unconfirmed account).
 * A login screen that says something confusing at the moment of failure is
 * where people give up.
 */
export function humanAuthError(e: any): string {
  const msg = String(e?.message ?? e ?? "").toLowerCase();
  const status = e?.status ?? e?.code;

  if (status === 429 || msg.includes("rate limit") || msg.includes("too many requests")) {
    return "Too many attempts just now. Wait a minute and try again — or use " +
           "Continue with Google, which isn't rate limited.";
  }
  if (msg.includes("invalid login credentials")) {
    return "That email and password don't match. If you signed up with Google, " +
           "use the Google button instead.";
  }
  if (msg.includes("email not confirmed")) {
    return "Your account isn't confirmed yet — check your inbox for the confirmation link.";
  }
  if (msg.includes("user already registered") || msg.includes("already been registered")) {
    return "There's already an account with that email. Try signing in instead.";
  }
  if (msg.includes("password should be at least")) {
    return "Password needs to be at least 8 characters.";
  }
  if (msg.includes("weak password") || msg.includes("password is too weak")) {
    return "Pick a stronger password — 8+ characters, and not a common one.";
  }
  if (msg.includes("unable to validate email") || msg.includes("invalid email")) {
    return "That doesn't look like a valid email address.";
  }
  if (msg.includes("signups not allowed") || msg.includes("signup is disabled")) {
    return "New accounts are disabled at the moment.";
  }
  if (msg.includes("failed to fetch") || msg.includes("networkerror")) {
    return "Couldn't reach the server. Check your connection and try again.";
  }
  return e?.message ?? "Something went wrong. Try again.";
}
