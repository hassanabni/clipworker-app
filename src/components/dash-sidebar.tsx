"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Home, Plus, LayoutGrid, Palette, Users, LogOut, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The dark rail, ported from the redesign.
 *
 * Every behaviour here is the one that was here before -- the same routes, the
 * same quota numbers, the same sign-out. What changed is the surface: a dark
 * #1a1a1a rail against the light app, a purple bar marking the active row, and
 * the account reduced to a name so the widest thing in the sidebar is not
 * somebody's email address.
 */
export function DashSidebar({ email, orgName, used, allowed }:
  { email: string; orgName: string; used: number; allowed: number }) {
  const path = usePathname();
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);

  const pct = allowed > 0 ? Math.min((used / allowed) * 100, 100) : 0;

  async function signOut() {
    setLeaving(true);
    await createClient().auth.signOut();
    router.replace("/login");
  }

  const nav = [
    { href: "/app", label: "Home", icon: Home, exact: true },
    { href: "/app/new", label: "New clip", icon: Plus, shortcut: "⌘N" },
    { href: "/app/clips", label: "Clips", icon: LayoutGrid },
    { href: "/app/brand", label: "Brand kit", icon: Palette },
    { href: "/app/team", label: "Team", icon: Users },
  ];

  // The account name, derived rather than stored: the design shows a person, and
  // the only name the app has ever held is the local part of the email.
  const name = (email.split("@")[0] ?? "")
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <aside className="bg-sidebar flex h-full w-56 shrink-0 flex-col">
      <div className="px-5 pt-5 pb-5">
        <Link href="/app" className="flex items-center gap-2">
          <span className="bg-primary grid size-7 place-items-center rounded-lg text-xs font-bold text-white">
            C
          </span>
          <span className="text-sm font-semibold tracking-tight text-white">clipworker</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-0.5 px-3">
        {nav.map(({ href, label, icon: Icon, shortcut, exact }) => {
          const active = exact ? path === href : path.startsWith(href);
          return (
            <Link key={href} href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex w-full items-center gap-2.5 overflow-hidden rounded-lg py-2 pr-3 pl-2 text-sm transition-colors",
                    active
                      ? "bg-white/10 font-medium text-white"
                      : "text-sidebar-muted hover:bg-white/5 hover:text-[#ccc]")}>
              {active && (
                <span className="bg-primary absolute top-1 bottom-1 left-0 w-[3px] rounded-full" />
              )}
              <Icon className="ml-1 size-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {shortcut && <span className="font-mono text-[10px] text-[#444]">{shortcut}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-white/5 p-4">
        <div>
          <div className="mb-1.5 flex justify-between text-xs">
            <span className="text-[#555]">Clips used</span>
            <span className="text-sidebar-muted">{used} / {allowed}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="bg-primary h-full rounded-full transition-all"
                 style={{ width: `${pct}%` }} />
          </div>
        </div>

        <Link href="/pricing"
              className="from-brand to-brand-2 block w-full rounded-lg bg-gradient-to-r py-2 text-center text-xs font-medium text-white transition-opacity hover:opacity-90">
          Upgrade
        </Link>

        <div className="h-px bg-white/5" />

        <div className="flex items-center gap-2.5 px-1">
          <span className="bg-primary/70 grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold text-white">
            {(name[0] ?? email[0] ?? "?").toUpperCase()}
          </span>
          <span className="text-sidebar-muted min-w-0 flex-1 truncate text-xs font-medium"
                title={`${email} · ${orgName}`}>
            {name || email}
          </span>
          <button onClick={signOut} disabled={leaving} title="Log out"
                  aria-label="Log out"
                  className="text-[#444] transition-colors hover:text-[#aaa]">
            {leaving
              ? <Loader2 className="size-3.5 animate-spin" />
              : <LogOut className="size-3.5" />}
          </button>
        </div>
      </div>
    </aside>
  );
}
