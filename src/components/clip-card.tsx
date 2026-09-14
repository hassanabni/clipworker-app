"use client";

import Link from "next/link";
import { useState } from "react";
import { Download, Loader2, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export type ClipRow = {
  id: string;
  status: string;
  query: string;
  canvas: string;
  isTrim: boolean;
  when: string;
  playUrl: string | null;
};

/**
 * One clip in the grid, ported from the redesign.
 *
 * Two things carried over from the version this replaces, because they were
 * fixes rather than styling: the box is a FIXED shape for every clip whatever
 * its canvas (a 16:9 clip in a 9:16 box used to be cropped to a sliver, and
 * mixed shapes left the titles on ragged lines), and the footer is a fixed
 * height so the date sits on the same line across the row. The design's box is
 * 16:9 rather than 4:5; object-contain still letterboxes a portrait clip whole
 * rather than cropping it.
 */
export function ClipCard({ clip }: { clip: ClipRow }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="border-border overflow-hidden rounded-xl border bg-white transition-all hover:border-[#c0bfb8] hover:shadow-md"
    >
      <div className="bg-muted relative aspect-video">
        <Link href={`/app/clips/${clip.id}`} className="block size-full">
          {clip.playUrl ? (
            <video src={`${clip.playUrl}#t=1`} muted preload="metadata" playsInline
                   className="size-full bg-black object-contain" />
          ) : clip.status === "failed" ? (
            <div className="text-destructive grid size-full place-items-center text-xs font-medium">
              Failed
            </div>
          ) : (
            <div className="text-muted-foreground grid size-full place-items-center gap-2">
              <div className="flex flex-col items-center gap-1.5">
                <Loader2 className="text-primary size-4 animate-spin" />
                <span className="text-[10px] capitalize">{clip.status}</span>
              </div>
            </div>
          )}
        </Link>

        <div className="pointer-events-none absolute top-2 left-2 flex gap-1">
          <span className="rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
            {clip.canvas}
          </span>
          {clip.isTrim && (
            <span className="rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
              Trim
            </span>
          )}
        </div>

        {/* The hover controls are the two things a finished clip can do, and
            both already existed -- open it, or download it. Nothing new. */}
        {hover && clip.playUrl && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/25">
            <Link href={`/app/clips/${clip.id}`} aria-label="Open clip"
                  className="grid size-9 place-items-center rounded-full bg-white/90 shadow-sm transition-colors hover:bg-white">
              <Play className="size-4 fill-[#111] text-[#111]" />
            </Link>
            <a href={clip.playUrl} download aria-label="Download clip"
               className="grid size-9 place-items-center rounded-full bg-white/90 shadow-sm transition-colors hover:bg-white">
              <Download className="size-4 text-[#111]" />
            </a>
          </div>
        )}
      </div>

      <div className="flex h-[58px] items-center justify-between px-3 py-3">
        <div className="min-w-0">
          <Link href={`/app/clips/${clip.id}`} title={clip.query}
                className="hover:text-primary block truncate text-sm font-medium">
            {clip.query}
          </Link>
          <p className="text-muted-foreground mt-0.5 text-xs">{clip.when}</p>
        </div>
        {clip.playUrl && (
          <a href={clip.playUrl} download aria-label={`Download ${clip.query}`}
             className={cn("text-muted-foreground hover:bg-muted grid size-7 shrink-0",
                           "place-items-center rounded-lg transition-colors hover:text-[#555]")}>
            <Download className="size-4" />
          </a>
        )}
      </div>
    </div>
  );
}
