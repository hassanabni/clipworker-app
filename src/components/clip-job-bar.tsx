"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useClipJob } from "@/components/clip-job-provider";

/**
 * The clip in flight, visible from every page in the dashboard.
 *
 * Without it, an upload or a render is only visible on /app/new, so stepping
 * over to Team or Clips looks exactly like nothing is happening -- which is how
 * someone ends up starting the same clip twice.
 */
export function ClipJobBar() {
  const { status, pct, busy, mode } = useClipJob();
  const path = usePathname();
  if (!busy) return null;

  const label =
    status === "uploading" ? `Uploading your video — ${pct}%`
    : status === "queued" ? "Queued — waiting for a render slot"
    : mode === "suggest" ? "Transcribing and ranking moments…"
    : "Making your clip…";

  return (
    <div className="border-border bg-primary/5 flex shrink-0 items-center gap-3 border-b px-6 py-2 text-sm">
      <Loader2 className="text-primary size-4 shrink-0 animate-spin" />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {status === "uploading" && (
        <span className="bg-primary/15 h-1.5 w-32 shrink-0 overflow-hidden rounded-full">
          <span className="bg-primary block h-full transition-[width] duration-300"
                style={{ width: `${pct}%` }} />
        </span>
      )}
      {!path.startsWith("/app/new") && (
        <Link href="/app/new" className="text-primary shrink-0 font-medium hover:underline">
          View progress
        </Link>
      )}
    </div>
  );
}
