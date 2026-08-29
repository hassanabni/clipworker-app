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
import { Loader2 } from "lucide-react";

type Mode = "signin" | "signup";
type Busy = null | "google" | "form" | "magic" | "reset";

export default function LoginPage() {
  const supabase = createClient();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState<Busy>(null);
  const [err, setErr] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [open, setOpen] = useState(true);
  const [spots, setSpots] = useState<number | null>(null);

  // Signups can be closed by an admin at any time. Ask before showing a form
  // that would only fail -- the trigger refuses the insert either way, but
  // finding out after typing a password is a bad first impression.
  useEffect(() => {
    supabase.rpc("signup_status").single().then(({ data }: any) => {
      if (data) { setOpen(data.registration_open); setSpots(data.spots_left); }
    });
  }, [supabase]);

  const reset = () => { setErr(null); setNotice(null); };
  const emailValid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

  async function google() {
    reset(); setBusy("google");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
    if (error) { setErr(humanAuthError(error)); setBusy(null); }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    reset();
    if (!emailValid) return setErr("That does not look like an email address.");
    if (password.length < 8) return setErr("Passwords need at least 8 characters.");
    if (mode === "signup" && !open) return setErr("Free signups are full at the moment.");

    setBusy("form");
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${location.origin}/auth/callback` },
        });
        if (error) throw error;
        if (!data.session) {
          setNotice(`Account created. Check ${email} for a confirmation link, then sign in.`);
        } else { location.href = "/app"; return; }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        location.href = "/app"; return;
      }
    } catch (e: any) {
      setErr(humanAuthError(e));
    }
    setBusy(null);
  }

  async function magicLink() {
    reset();
    if (!emailValid) return setErr("Enter your email first, then use the link.");
    setBusy("magic");
    const { error } = await supabase.auth.signInWithOtp({
      email, options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });
    setErr(error ? humanAuthError(error) : null);
    if (!error) setNotice(`Sign-in link sent to ${email}.`);
    setBusy(null);
  }

  async function forgot() {
    reset();
    if (!emailValid) return setErr("Enter your email first, then reset the password.");
    setBusy("reset");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/reset`,
    });
    setErr(error ? humanAuthError(error) : null);
    if (!error) setNotice(`Password reset link sent to ${email}.`);
    setBusy(null);
  }

  const anyBusy = busy !== null;

  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2 font-semibold">
          <img src="/logo.png" alt="" width={28} height={28} className="rounded-lg" />
          Clip Worker
        </Link>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>{mode === "signin" ? "Welcome back" : "Create your account"}</CardTitle>
            <CardDescription>
              {mode === "signin"
                ? "Sign in to make a clip."
                : spots !== null && open
                  ? `${spots} free ${spots === 1 ? "spot" : "spots"} left.`
                  : "Three clips free, no card required."}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Button type="button" variant="outline" className="w-full" onClick={google} disabled={anyBusy}>
              {busy === "google" ? <Loader2 className="animate-spin" /> : <GoogleMark />}
              Continue with Google
            </Button>

            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">or</span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={submit} className="space-y-3" noValidate>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" autoComplete="email" value={email}
                       placeholder="you@example.com" disabled={anyBusy}
                       onChange={(e) => { setEmail(e.target.value); reset(); }} />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <Label htmlFor="password">Password</Label>
                  {mode === "signin" && (
                    <button type="button" onClick={forgot} disabled={anyBusy}
                            className="text-xs text-muted-foreground underline-offset-4 hover:underline disabled:opacity-50">
                      {busy === "reset" ? "Sending…" : "Forgot?"}
                    </button>
                  )}
                </div>
                <Input id="password" type="password" value={password} disabled={anyBusy}
                       autoComplete={mode === "signin" ? "current-password" : "new-password"}
                       onChange={(e) => { setPassword(e.target.value); reset(); }} />
              </div>

              {err && (
                <Alert variant="destructive"><AlertDescription>{err}</AlertDescription></Alert>
              )}
              {notice && <Alert><AlertDescription>{notice}</AlertDescription></Alert>}

              <Button type="submit" className="w-full"
                      disabled={anyBusy || (mode === "signup" && !open)}>
                {busy === "form" && <Loader2 className="animate-spin" />}
                {mode === "signup" && !open
                  ? "Free signups are full"
                  : mode === "signin" ? "Sign in" : "Create account"}
              </Button>
            </form>

            <Button type="button" variant="ghost" className="w-full" onClick={magicLink} disabled={anyBusy}>
              {busy === "magic" ? <Loader2 className="animate-spin" /> : null}
              Email me a sign-in link instead
            </Button>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "signin" ? "No account yet?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="font-medium text-foreground underline-offset-4 hover:underline"
            onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); reset(); }}>
            {mode === "signin" ? "Create one" : "Sign in"}
          </button>
        </p>
      </div>
    </main>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.4a5.5 5.5 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.6-5.2 3.6-8.8z"/>
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3a7.2 7.2 0 0 1-10.7-3.8H1.4v3.1A12 12 0 0 0 12 24z"/>
      <path fill="#FBBC05" d="M5.3 14.3a7.1 7.1 0 0 1 0-4.6V6.6H1.4a12 12 0 0 0 0 10.8l3.9-3.1z"/>
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.4.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.4 6.6l3.9 3.1A7.2 7.2 0 0 1 12 4.8z"/>
    </svg>
  );
}
