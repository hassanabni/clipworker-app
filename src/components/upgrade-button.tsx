"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { getPaddle } from "@/lib/paddle/client";

export function UpgradeButton({ label = "Upgrade to Pro", variant = "gradient", portal = false }:
  { label?: string; variant?: "default" | "outline" | "gradient"; portal?: boolean }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function go() {
    setBusy(true); setErr(null);
    try {
      if (portal) {
        const r = await fetch("/api/paddle/portal", { method: "POST" });
        const j = await r.json();
        if (j.error) throw new Error(j.error);
        // Paddle hosts the card form. We never see card details, which keeps
        // this out of PCI scope entirely.
        location.href = j.url;
        return;
      }

      const r = await fetch("/api/paddle/checkout", { method: "POST" });
      const j = await r.json();
      if (j.error) throw new Error(j.error);

      const paddle = await getPaddle();
      if (!paddle) throw new Error("Could not load checkout. Try again.");
      paddle.Checkout.open({
        items: [{ priceId: j.priceId, quantity: 1 }],
        customer: { id: j.customerId },
        customData: { supabase_user_id: j.userId },
        settings: { successUrl: `${location.origin}/app?upgraded=1` },
      });
      setBusy(false);
    } catch (e: any) {
      setErr(e.message); setBusy(false);
    }
  }

  return (
    <div className="w-full space-y-2">
      <Button className="w-full" variant={variant} onClick={go} disabled={busy}>
        {busy && <Loader2 className="animate-spin" />}
        {busy ? "Opening checkout…" : label}
      </Button>
      {err && <p className="text-center text-xs text-destructive">{err}</p>}
    </div>
  );
}
