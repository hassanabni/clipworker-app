"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { getPaddle } from "@/lib/paddle/client";
import { createClient } from "@/lib/supabase/client";
import { tiers } from "./tiers";

type Cycle = "month" | "year";

// Sandbox-only smoke test: country-localized prices via PricePreview, a
// billing-cycle toggle, and a one-page overlay checkout. Deliberately does
// NOT pass a customerId or supabase_user_id to Checkout, so a completed
// purchase here cannot be attributed to a real account by
// /api/paddle/webhook and cannot grant real Pro access.
export function PricingTest({ country }: { country?: string }) {
  const [cycle, setCycle] = useState<Cycle>("month");
  const [totals, setTotals] = useState<Record<string, string>>({});
  const [email, setEmail] = useState<string | undefined>();
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setEmail(data.user?.email ?? undefined));
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const paddle = await getPaddle();
        if (!paddle) throw new Error("Could not load Paddle.js.");
        const items = tiers.map((t) => ({ priceId: t.priceId[cycle], quantity: 1 }));
        // No country -> no address param at all, so Paddle falls back to
        // detecting location from the visitor's IP itself.
        const preview = await paddle.PricePreview({
          items,
          ...(country ? { address: { countryCode: country } } : {}),
        });
        if (cancelled) return;
        const next: Record<string, string> = {};
        for (const li of preview.data.details.lineItems) {
          next[li.price.id] = li.formattedTotals.total;
        }
        setTotals(next);
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => { cancelled = true; };
  }, [cycle, country]);

  async function subscribe(priceId: string) {
    setBusy(priceId); setErr(null);
    try {
      const paddle = await getPaddle();
      if (!paddle) throw new Error("Could not load Paddle.js.");
      paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        ...(email ? { customer: { email } } : {}),
        settings: {
          displayMode: "overlay",
          variant: "one-page",
          successUrl: `${location.origin}/welcome`,
        },
      });
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold">Paddle sandbox test</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Not real pricing — test products only. Prices are localized by Paddle
          from {country ? `your detected country (${country})` : "your IP (no country header found — expected in local dev)"}.
        </p>
      </div>

      <div className="mb-8 flex items-center justify-center gap-3 text-sm">
        <span className={cycle === "month" ? "font-medium" : "text-muted-foreground"}>Monthly</span>
        <Switch checked={cycle === "year"} onCheckedChange={(v) => setCycle(v ? "year" : "month")} />
        <span className={cycle === "year" ? "font-medium" : "text-muted-foreground"}>Yearly</span>
      </div>

      {err && <p className="mb-6 text-center text-sm text-destructive">{err}</p>}

      <div className="grid gap-5 sm:grid-cols-3">
        {tiers.map((t) => {
          const priceId = t.priceId[cycle];
          return (
            <Card key={t.name}>
              <CardHeader>
                <CardTitle className="text-base font-medium">{t.name}</CardTitle>
                <div className="text-2xl font-semibold">
                  {totals[priceId] ?? "…"}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{cycle === "month" ? "mo" : "yr"}
                  </span>
                </div>
                <CardDescription>{t.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {t.features.map((f) => <li key={f}>{f}</li>)}
                </ul>
                <Button className="w-full" variant="gradient"
                        disabled={busy === priceId || !totals[priceId]}
                        onClick={() => subscribe(priceId)}>
                  {busy === priceId ? "Opening…" : "Subscribe"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
