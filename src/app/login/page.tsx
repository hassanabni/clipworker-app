"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { humanAuthError } from "@/lib/authErrors";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const supabase = createClient();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function google() {
    setErr(null); setBusy(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
    if (error) { setErr(humanAuthError(error)); setBusy(false); }
  }

  return (
    <main className="bg-dot-grid flex min-h-svh items-center justify-center px-4 py-10">
      <div className="relative w-full max-w-sm">
        <Link href="/" className="absolute bottom-full left-1/2 mb-6 flex -translate-x-1/2 items-center gap-2 font-semibold">
          <img src="/logo.png" alt="" width={28} height={28} className="rounded-lg" />
          clipworker
        </Link>

        <Card className="rounded-2xl p-3 shadow-2xl">
          <CardHeader className="pt-4 text-center">
            <CardTitle className="text-2xl font-bold">Welcome to clipworker</CardTitle>
            <CardDescription>Sign in or create an account to make a clip.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {err && (
              <Alert variant="destructive"><AlertDescription>{err}</AlertDescription></Alert>
            )}

            <Button type="button" variant="outline" size="lg" className="w-full"
                    onClick={google} disabled={busy}>
              {busy ? <Loader2 className="animate-spin" /> : <GoogleMark />}
              Continue with Google
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              By continuing you agree to our{" "}
              <Link href="/terms" className="text-foreground hover:underline">Terms of Service</Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-foreground hover:underline">Privacy Policy</Link>.
            </p>
          </CardContent>
        </Card>
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
