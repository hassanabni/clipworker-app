"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { humanAuthError } from "@/lib/authErrors";
import { AuthShell, authButton, authField, authLabel } from "@/components/auth-shell";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

/**
 * Email and password. Deliberately the only method.
 *
 * Google OAuth was removed: the buyer is now a company, accounts are
 * provisioned by invitation, and a work email with a password is the thing an
 * IT department can actually hand out, reset and revoke. It also removes the
 * whole class of "signed up with Google, now can't sign in with a password"
 * support conversation.
 *
 * Sign-up is kept on this same screen but is refused by the database once
 * registration is closed -- see sql/provisioning.sql. That is the intended end
 * state, so the refusal reads as a sentence; humanAuthError does that
 * translation, including for GoTrue's generic wrapper.
 */
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const supabase = createClient();
  const router = useRouter();
  const params = useSearchParams();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  // A callback failure arrives as ?error=, so it has to be shown here rather
  // than swallowed -- otherwise a bad link just lands on a blank login form.
  const [err, setErr] = useState<string | null>(params.get("error"));
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // refresh() so the server components re-run with the new cookie; without
        // it the dashboard renders against the signed-out session it was
        // prefetched with.
        router.replace("/app");
        router.refresh();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${location.origin}/auth/callback` },
        });
        if (error) throw error;
        // Supabase returns a user with no session when confirmation is on. The
        // difference matters: one of these means "go check your email" and the
        // other means "you are in".
        if (data.session) {
          router.replace("/app");
          router.refresh();
        } else {
          setSent(true);
        }
      }
    } catch (e) {
      setErr(humanAuthError(e, mode === "signup" ? "signup" : undefined));
    } finally {
      setBusy(false);
    }
  }

  const signin = mode === "signin";

  return (
    <AuthShell
      title={signin ? "Welcome back" : "Create your account"}
      subtitle={signin
        ? "Sign in to your clipworker workspace."
        : "You'll need an invitation from a workspace."}
    >
      {err && (
        <Alert variant="destructive" className="mb-5">
          <AlertDescription>{err}</AlertDescription>
        </Alert>
      )}

      {sent ? (
        <Alert>
          <AlertDescription>
            Check <span className="font-medium">{email}</span> for a confirmation
            link, then come back and sign in.
          </AlertDescription>
        </Alert>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label htmlFor="email" className={authLabel}>Email</label>
            <input id="email" type="email" required autoComplete="email"
                   value={email} onChange={(e) => setEmail(e.target.value)}
                   disabled={busy} placeholder="name@company.com"
                   className={authField} />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="password" className={authLabel + " mb-0"}>Password</label>
              {signin && (
                <Link href="/auth/reset"
                      className="text-primary text-xs transition-colors hover:text-[#4d43b8]">
                  Forgot password?
                </Link>
              )}
            </div>
            <input id="password" type="password" required minLength={8}
                   autoComplete={signin ? "current-password" : "new-password"}
                   value={password} onChange={(e) => setPassword(e.target.value)}
                   disabled={busy}
                   placeholder={signin ? "Enter your password" : "Create a password"}
                   className={authField} />
            {!signin && (
              <p className="text-muted-foreground mt-1.5 text-xs">At least 8 characters.</p>
            )}
          </div>

          <button type="submit" disabled={busy} className={authButton}>
            {busy
              ? <span className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  {signin ? "Signing in…" : "Creating…"}
                </span>
              : signin ? "Sign in" : "Create account"}
          </button>
        </form>
      )}

      {!sent && (
        <p className="text-muted-foreground mt-6 text-center text-sm">
          {signin ? "Don't have an account? " : "Already have an account? "}
          <button type="button"
                  onClick={() => { setMode(signin ? "signup" : "signin"); setErr(null); }}
                  className="text-primary font-medium transition-colors hover:text-[#4d43b8]">
            {signin ? "Sign up" : "Sign in"}
          </button>
        </p>
      )}

      <p className="mt-4 text-center text-xs leading-relaxed text-[#bbb]">
        By continuing you agree to our{" "}
        <Link href="/terms" className="underline hover:text-[#888]">Terms</Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline hover:text-[#888]">Privacy Policy</Link>.
      </p>
    </AuthShell>
  );
}
