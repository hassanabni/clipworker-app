"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { humanAuthError } from "@/lib/authErrors";
import { AuthShell, authButton, authField, authLabel } from "@/components/auth-shell";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

/**
 * Set a new password. Reached from the emailed reset link, via /auth/callback,
 * which has already exchanged the one-time code for a session.
 *
 * The session check is not decoration: without it someone opening this URL
 * directly gets a form that looks fine and fails on submit with "Auth session
 * missing". Better to say up front that the link is what makes this work.
 */
export default function UpdatePasswordPage() {
  const supabase = createClient();
  const router = useRouter();
  const [ready, setReady] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setReady(Boolean(data.session)));
  }, [supabase]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (password !== confirm) { setErr("Those two passwords don't match."); return; }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      router.replace("/app");
      router.refresh();
    } catch (e) {
      setErr(humanAuthError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell title="Choose a new password"
               subtitle="You'll be signed in once it's saved."
               altHref="/login" altLabel="Back to sign in">
      {err && (
        <Alert variant="destructive" className="mb-5">
          <AlertDescription>{err}</AlertDescription>
        </Alert>
      )}

      {ready === false ? (
        <Alert variant="destructive">
          <AlertDescription>
            This page needs the link from your reset email — it&apos;s what signs
            you in long enough to set a password.{" "}
            <Link href="/auth/reset" className="underline">Send a new link</Link>.
          </AlertDescription>
        </Alert>
      ) : ready === null ? (
        <div className="flex justify-center py-4">
          <Loader2 className="text-muted-foreground size-5 animate-spin" />
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label htmlFor="password" className={authLabel}>New password</label>
            <input id="password" type="password" required minLength={8}
                   autoComplete="new-password" value={password}
                   onChange={(e) => setPassword(e.target.value)} disabled={busy}
                   placeholder="At least 8 characters" className={authField} />
          </div>
          <div>
            <label htmlFor="confirm" className={authLabel}>Confirm</label>
            <input id="confirm" type="password" required minLength={8}
                   autoComplete="new-password" value={confirm}
                   onChange={(e) => setConfirm(e.target.value)} disabled={busy}
                   placeholder="Type it again" className={authField} />
          </div>
          <button type="submit" disabled={busy} className={authButton}>
            {busy
              ? <span className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />Saving…
                </span>
              : "Save password"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
