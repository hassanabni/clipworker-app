"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { humanAuthError } from "@/lib/authErrors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Check } from "lucide-react";

// Where the "forgot password" email lands. Supabase puts a recovery session in
// place before this renders, so updateUser() is enough -- there is no token to
// handle here.
export default function ResetPassword() {
  const supabase = createClient();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [ready, setReady] = useState<boolean | null>(null);

  // Without a recovery session the form would collect a password and then fail
  // on submit. Checking first means saying so before anything is typed.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setReady(Boolean(data.session)));
  }, [supabase]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (password.length < 8) return setErr("Passwords need at least 8 characters.");
    if (password !== confirm) return setErr("Those two passwords do not match.");

    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return setErr(humanAuthError(error));
    setDone(true);
    setTimeout(() => (location.href = "/app"), 1400);
  }

  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2 font-semibold">
          <img src="/logo.png" alt="" width={28} height={28} className="rounded-lg" />
          Clip Worker
        </Link>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Choose a new password</CardTitle>
            <CardDescription>
              {done ? "All set." : "At least 8 characters."}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {done ? (
              <Alert>
                <Check className="size-4" />
                <AlertDescription>Password updated. Taking you to your clips…</AlertDescription>
              </Alert>
            ) : ready === false ? (
              <>
                <Alert variant="destructive">
                  <AlertDescription>
                    This reset link has expired or has already been used.
                  </AlertDescription>
                </Alert>
                <Button className="w-full" asChild>
                  <Link href="/login">Request a new one</Link>
                </Button>
              </>
            ) : (
              <form onSubmit={submit} className="space-y-3" noValidate>
                <div className="space-y-1.5">
                  <Label htmlFor="pw">New password</Label>
                  <Input id="pw" type="password" autoComplete="new-password" value={password}
                         disabled={busy || ready === null}
                         onChange={(e) => { setPassword(e.target.value); setErr(null); }} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pw2">Confirm password</Label>
                  <Input id="pw2" type="password" autoComplete="new-password" value={confirm}
                         disabled={busy || ready === null}
                         onChange={(e) => { setConfirm(e.target.value); setErr(null); }} />
                </div>
                {err && <Alert variant="destructive"><AlertDescription>{err}</AlertDescription></Alert>}
                <Button type="submit" className="w-full" disabled={busy || ready === null}>
                  {busy && <Loader2 className="animate-spin" />}
                  {ready === null ? "Checking link…" : "Update password"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
