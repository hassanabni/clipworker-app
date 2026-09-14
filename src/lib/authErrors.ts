/** Turn Supabase's raw auth errors into something a person can act on.
 *
 * The defaults leak implementation detail ("email rate limit exceeded") or are
 * actively misleading ("Invalid login credentials" for an unconfirmed account).
 * A login screen that says something confusing at the moment of failure is
 * where people give up.
 */
export function humanAuthError(e: any, context?: "signup"): string {
  const msg = String(e?.message ?? e ?? "").toLowerCase();
  const status = e?.status ?? e?.code;

  if (status === 429 || msg.includes("rate limit") || msg.includes("too many requests")) {
    return "Too many attempts just now. Wait a minute and try again.";
  }
  if (msg.includes("invalid login credentials")) {
    return "That email and password don't match. If you've forgotten it, use " +
           "the reset link below.";
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
  // registration_closed is raised by enforce_user_cap() in the database, which
  // is where invite-only actually lives -- an account is created only for an
  // email an admin has already added to the workspace.
  //
  // "database error saving new user" is GoTrue's generic wrapper: it does NOT
  // pass a trigger's exception message through, so a refused signup arrives
  // looking like an outage. It is only translated in the signup context, where
  // the cap is by far the likeliest cause -- during sign-in the same string
  // really would mean something is broken, and saying "you need an invitation"
  // to someone who already has an account would be worse than saying nothing.
  if (context === "signup" && msg.includes("database error saving new user")) {
    return "clipworker is invite-only. Ask your workspace admin to invite this " +
           "email address, then create your account.";
  }
  if (msg.includes("signups not allowed") || msg.includes("signup is disabled") ||
      msg.includes("registration_closed")) {
    return "clipworker is invite-only. Ask your workspace admin to invite this " +
           "email address, then create your account.";
  }
  if (msg.includes("same password")) {
    return "That's the password you already have. Pick a different one.";
  }
  if (msg.includes("auth session missing")) {
    return "That link has expired. Ask for a new reset email.";
  }
  if (msg.includes("failed to fetch") || msg.includes("networkerror")) {
    return "Couldn't reach the server. Check your connection and try again.";
  }
  return e?.message ?? "Something went wrong. Try again.";
}
