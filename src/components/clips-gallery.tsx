"use client";

import { useMemo, useState } from "react";
import { ClipCard, type ClipRow } from "@/components/clip-card";
import { ClipsEmpty } from "@/components/clips-empty";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CANVASES } from "@/lib/limits";

/**
 * The clip library.
 *
 * The filter and sort are pure presentation over rows the server already sent:
 * nothing is re-fetched and no query changes, so this adds a way to LOOK at the
 * library rather than a new thing the library does. The ratios offered come from
 * lib/limits so this list cannot drift from the ones a clip can actually be.
 */
export function ClipsGallery({ clips }: { clips: ClipRow[] }) {
  const [filter, setFilter] = useState<string>("all");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");

  const shown = useMemo(() => {
    const rows = filter === "all" ? clips : clips.filter((c) => c.canvas === filter);
    // The server sends newest first, so "oldest" is the same list reversed --
    // no date parsing, and no chance of disagreeing with the server's order.
    return sort === "newest" ? rows : [...rows].reverse();
  }, [clips, filter, sort]);

  if (clips.length === 0) return <ClipsEmpty />;

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          {["all", ...CANVASES].map((f) => (
            <button key={f} type="button" onClick={() => setFilter(f)}
                    aria-pressed={filter === f}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                      filter === f
                        ? "bg-primary text-white"
                        : "border-border text-muted-foreground border bg-white hover:border-[#c0bfb8]")}>
              {f === "all" ? "All" : f}
            </button>
          ))}
        </div>
        <Select value={sort} onValueChange={(v) => setSort(v as "newest" | "oldest")}>
          <SelectTrigger className="w-36 bg-white"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {shown.length === 0 ? (
        <p className="text-muted-foreground py-16 text-center text-sm">
          No {filter} clips yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {shown.map((c) => <ClipCard key={c.id} clip={c} />)}
        </div>
      )}
    </>
  );
}
