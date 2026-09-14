"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Plus } from "lucide-react";

/**
 * The breadcrumb strip above every page in the app.
 *
 * Its "New clip" button disappears on the new-clip page itself, which is the
 * one place it would send you where you already are.
 */
const LABELS: [string, string][] = [
  ["/app/new", "New clip"],
  ["/app/clips", "Clips"],
  ["/app/brand", "Brand kit"],
  ["/app/team", "Team"],
  ["/app", "Home"],
];

export function DashHeader() {
  const path = usePathname();
  // Longest prefix wins, so /app/clips/<id> reads "Clips" rather than "Home".
  const label = LABELS.find(([href]) => path === href || path.startsWith(href + "/"))?.[1]
    ?? LABELS.find(([href]) => path === href)?.[1]
    ?? "Home";

  return (
    <header className="border-border bg-background flex h-12 shrink-0 items-center justify-between border-b px-6">
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <span>clipworker</span>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground font-medium">{label}</span>
      </div>

      {!path.startsWith("/app/new") && (
        <Link href="/app/new"
              className="bg-primary hover:bg-primary/90 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-white transition-colors">
          <Plus className="size-3.5" />
          New clip
        </Link>
      )}
    </header>
  );
}
