"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Plus, Film, Sparkles, LogOut, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function DashSidebar({ email, used, allowed }:
  { email: string; used: number; allowed: number }) {
  const path = usePathname();
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);

  const left = Math.max(allowed - used, 0);
  const pct = allowed > 0 ? Math.min((used / allowed) * 100, 100) : 0;

  async function signOut() {
    setLeaving(true);
    await createClient().auth.signOut();
    router.replace("/login");
  }

  const nav = [
    { href: "/app", label: "New clip", icon: Plus },
    { href: "/app/clips", label: "My clips", icon: Film },
  ];

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r bg-card/40 p-3">
      <Link href="/" className="mb-4 flex items-center gap-2 px-2 py-1 font-semibold">
        <img src="/logo.png" alt="" width={24} height={24} className="rounded-md" />
        clipworker
      </Link>

      <div className="mb-4 flex items-center gap-2 rounded-lg border bg-background p-2">
        <Avatar className="size-7">
          <AvatarFallback className="bg-gradient-to-br from-brand to-brand-2 text-xs text-white">
            {(email[0] ?? "?").toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 text-xs">
          <div className="truncate font-medium">{email}</div>
          <div className="text-muted-foreground">Free plan</div>
        </div>
      </div>

      <nav className="space-y-1">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}
                aria-current={path === href ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                  path === href
                    ? "bg-brand/10 font-medium text-brand"
                    : "text-muted-foreground hover:bg-background/60 hover:text-foreground"
                )}>
            <Icon className="size-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="flex-1" />

      <div className="mb-2 rounded-lg border bg-background p-3">
        <div className="mb-2 flex items-baseline justify-between text-xs">
          <span className="text-muted-foreground">Clips used</span>
          <span className="font-medium">{used} / {allowed}</span>
        </div>
        <Progress value={pct} className="h-1.5"
                  indicatorClassName="bg-gradient-to-r from-brand to-brand-2" />
        {left === 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            You have used all your free clips.
          </p>
        )}
      </div>

      <Separator className="my-2" />

      <Button variant="gradient" size="sm" className="justify-start" asChild>
        <Link href="/pricing"><Sparkles className="size-4" />Upgrade</Link>
      </Button>
      <Button variant="ghost" size="sm" className="justify-start text-muted-foreground"
              onClick={signOut} disabled={leaving}>
        {leaving ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
        {leaving ? "Signing out…" : "Sign out"}
      </Button>
    </aside>
  );
}
