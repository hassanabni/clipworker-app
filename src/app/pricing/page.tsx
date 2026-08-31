import Link from "next/link";
import { currentUser, createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UpgradeButton } from "@/components/upgrade-button";
import { Check } from "lucide-react";
import { freeFeatures as free, proFeatures } from "@/lib/pricing-plans";

export default async function Pricing() {
  const user = await currentUser();
  let pro = false;
  if (user) {
    const db = await createClient();
    const { data } = await db.rpc("my_clip_quota").single();
    pro = Boolean((data as any)?.pro);
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Pricing</h1>
        <p className="mt-2 text-muted-foreground">Start free. Upgrade when you need the volume.</p>
      </div>

      <div className="grid items-stretch gap-5 sm:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-base font-medium">Free</CardTitle>
            <div className="text-3xl font-semibold">$0</div>
            <CardDescription>Enough to see whether it works for you.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col space-y-4">
            <ul className="space-y-2 text-sm">
              {free.map((f) => (
                <li key={f} className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-muted-foreground" />{f}
                </li>
              ))}
            </ul>
            <Button variant="outline" className="mt-auto w-full" asChild>
              <Link href={user ? "/app" : "/login"}>{user ? "Go to app" : "Get started"}</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col border-brand/40">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">Pro</CardTitle>
              {pro && <Badge>Current plan</Badge>}
            </div>
            <div className="text-3xl font-semibold">$15<span className="text-base font-normal text-muted-foreground">/mo</span></div>
            <CardDescription>For clipping at volume.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col space-y-4">
            <ul className="space-y-2 text-sm">
              {proFeatures.map((f) => (
                <li key={f} className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-brand" />{f}
                </li>
              ))}
            </ul>
            <div className="mt-auto">
              {!user ? (
                <Button variant="gradient" className="w-full" asChild>
                  <Link href="/login">Sign in to upgrade</Link>
                </Button>
              ) : pro ? (
                <UpgradeButton label="Manage billing" variant="outline" portal />
              ) : (
                <UpgradeButton />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
