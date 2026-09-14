"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { humanAuthError } from "@/lib/authErrors";
import { AuthShell, authButton, authField, authLabel } from "@/components/auth-shell";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

/**
 * Ask for a password reset link.
 *
 * The success message is deliberately the same whether or not the address has
 * an account: this page is unauthenticated, so a different response would turn
 * it into a way to test which of a company's emails are registered.
 */
export default function ResetPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        // Through the callback, which exchanges the one-time code for a session
        // and only then forwards to the form that sets the new password. Linking
        // straight to /auth/update-password would land there with no session and
        // updateUser would fail.
        redirectTo: `${location.origin}/auth/callback?next=/auth/update-password`,
      });
      if (error) throw error;
      setSent(true);
    } catch (e) {
      setErr(humanAuthError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell title="Reset your password"
               subtitle="We'll email you a link to set a new one."
               altHref="/login" altLabel="Back to sign in">
      {err && (
        <Alert variant="destructive" className="mb-5">
          <AlertDescription>{err}</AlertDescription>
        </Alert>
      )}

      {sent ? (
        <Alert>
          <AlertDescription>
            If there&apos;s an account for <span className="font-medium">{email}</span>,
            a reset link is on its way. The link is good for one hour.
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
          <button type="submit" disabled={busy} className={authButton}>
            {busy
              ? <span className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />Sending…
                </span>
              : "Send reset link"}
          </button>
        </form>
      )}

      <p className="text-muted-foreground mt-6 text-center text-sm">
        <Link href="/login" className="text-primary font-medium hover:text-[#4d43b8]">
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  );
}
