"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function UpgradeButton({ label = "Upgrade to Pro", variant = "default", portal = false }:
  { label?: string; variant?: "default" | "outline"; portal?: boolean }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function go() {
    setBusy(true); setErr(null);
    try {
      const r = await fetch(portal ? "/api/stripe/portal" : "/api/stripe/checkout",
                            { method: "POST" });
      const j = await r.json();
      if (j.error) throw new Error(j.error);
      // Stripe hosts the card form. We never see card details, which keeps this
      // out of PCI scope entirely.
      location.href = j.url;
    } catch (e: any) {
      setErr(e.message); setBusy(false);
    }
  }

  return (
    <div className="w-full space-y-2">
      <Button className="w-full" variant={variant} onClick={go} disabled={busy}>
        {busy && <Loader2 className="animate-spin" />}
        {busy ? "Opening Stripe…" : label}
      </Button>
      {err && <p className="text-center text-xs text-destructive">{err}</p>}
    </div>
  );
}
