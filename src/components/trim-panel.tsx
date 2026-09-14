"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Scissors } from "lucide-react";

const MIN_TRIM_SECONDS = 1;

const fmt = (t: number) => {
  const m = Math.floor(t / 60);
  const s = t % 60;
  return `${m}:${s.toFixed(1).padStart(4, "0")}`;
};

/**
 * Trim a finished clip.
 *
 * Cut-inward only, and that is inherent rather than a limitation of the UI: the
 * trim re-cuts this rendered file, so frames outside the range do not exist to
 * put back. The source video was deleted when this clip rendered.
 *
 * Captions are already burned into the pixels, so a trim can never desync them.
 */
export function TrimPanel({ jobId, canvas, playUrl }:
  { jobId: string; canvas: string; playUrl: string }) {
  const router = useRouter();
  const video = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newJobId, setNewJobId] = useState<string | null>(null);

  // Duration comes from the element rather than a server probe: the file is
  // small and already presigned, so the browser knows before we could ask.
  function onMeta() {
    const d = video.current?.duration ?? 0;
    if (!Number.isFinite(d) || d <= 0) return;
    setDuration(d);
    setStart(0);
    setEnd(d);
  }

  // Loop the selection while it is being adjusted, so the handles show what
  // they are actually doing.
  useEffect(() => {
    const v = video.current;
    if (!v || !open) return;
    const onTime = () => {
      if (v.currentTime >= end - 0.03) { v.currentTime = start; }
    };
    v.addEventListener("timeupdate", onTime);
    return () => v.removeEventListener("timeupdate", onTime);
  }, [open, start, end]);

  // Poll the new trim the same way the clip form polls a render.
  useEffect(() => {
    if (!newJobId) return;
    const t = setInterval(async () => {
      const r = await fetch(`/api/jobs?id=${newJobId}`);
      const j = await r.json();
      if (j.status === "done") {
        clearInterval(t);
        toast.success("Trimmed clip is ready.");
        router.push(`/app/clips/${newJobId}`);
      } else if (j.status === "failed") {
        clearInterval(t);
        setNewJobId(null);
        toast.error(j.error || "That trim failed.");
      }
    }, 3000);
    return () => clearInterval(t);
  }, [newJobId, router]);

  function seek(t: number) {
    const v = video.current;
    if (v) v.currentTime = Math.max(0, Math.min(t, duration));
  }

  async function submit() {
    setSubmitting(true);
    try {
      const r = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "trim", sourceJobId: jobId, start, end }),
      });
      const j = await r.json();
      if (j.error) throw new Error(j.error);
      setNewJobId(j.id);
      toast.info("Trimming…");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not start that trim.");
      setSubmitting(false);
    }
  }

  const selected = Math.max(end - start, 0);
  const tooShort = selected < MIN_TRIM_SECONDS;
  const unchanged = start <= 0.01 && end >= duration - 0.01;

  return (
    <div className="space-y-4">
      <div className="mx-auto w-full" style={{ maxWidth: canvas === "16:9" ? 720 : 380 }}>
        <video ref={video} src={playUrl} controls playsInline preload="metadata"
               onLoadedMetadata={onMeta}
               className="w-full rounded-lg border bg-black"
               style={{ aspectRatio: canvas.replace(":", " / ") }} />
      </div>

      {!open ? (
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => setOpen(true)} disabled={duration <= 0}>
            <Scissors className="size-4" /> Trim this clip
          </Button>
        </div>
      ) : (
        <Card>
          <CardContent className="space-y-4 py-5">
            <div className="flex items-baseline justify-between">
              <h2 className="font-medium">Trim</h2>
              <span className="text-muted-foreground font-mono text-xs">
                {fmt(start)} – {fmt(end)} · {selected.toFixed(1)}s
              </span>
            </div>

            <Handle label="Start" value={start} max={duration}
                    onChange={(v) => { const s = Math.min(v, end - MIN_TRIM_SECONDS);
                                       setStart(Math.max(0, s)); seek(Math.max(0, s)); }} />
            <Handle label="End" value={end} max={duration}
                    onChange={(v) => { const e = Math.max(v, start + MIN_TRIM_SECONDS);
                                       setEnd(Math.min(duration, e)); seek(Math.min(duration, e)); }} />

            <p className="text-muted-foreground text-xs">
              Trimming makes a new clip and keeps this one. It only removes from
              the ends — what&apos;s cut can&apos;t be brought back, so start again
              from the original if you need more.
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <Button onClick={submit} disabled={submitting || tooShort || unchanged || !!newJobId}>
                {(submitting || newJobId) && <Loader2 className="size-4 animate-spin" />}
                {newJobId ? "Trimming…" : "Create trimmed clip"}
              </Button>
              <Button variant="ghost" onClick={() => { setOpen(false); setStart(0); setEnd(duration); }}
                      disabled={submitting || !!newJobId}>
                Cancel
              </Button>
              {tooShort && (
                <span className="text-muted-foreground text-xs">
                  Keep at least {MIN_TRIM_SECONDS}s.
                </span>
              )}
              {!tooShort && unchanged && (
                <span className="text-muted-foreground text-xs">
                  Move a handle to choose what to keep.
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Handle({ label, value, max, onChange }:
  { label: string; value: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <label className="text-muted-foreground text-sm">{label}</label>
        <span className="font-mono text-xs">{fmt(value)}</span>
      </div>
      <input type="range" min={0} max={max || 0} step={0.1} value={value}
             aria-label={label}
             onChange={(e) => onChange(Number(e.target.value))}
             className="accent-brand h-2 w-full cursor-pointer" />
    </div>
  );
}
