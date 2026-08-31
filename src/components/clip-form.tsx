"use client";

import { useEffect, useRef, useState } from "react";
import { checkUpload, maxBytesFor, humanBytes } from "@/lib/limits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  Loader2, Upload, X, FileVideo, ChevronDown, Download,
} from "lucide-react";

type Status = "idle" | "uploading" | "queued" | "processing" | "done" | "failed";
const mb = (n: number) => `${(n / 1048576).toFixed(n > 10485760 ? 0 : 1)}MB`;

/** fetch() cannot report upload progress -- no browser exposes a stream for the
 *  request body. A 400MB source therefore looked frozen, which is exactly when
 *  people click the button again. XHR is the only way to get real bytes-sent. */
function putWithProgress(url: string, file: File, onBytes: (sent: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
    xhr.upload.onprogress = (e) => { if (e.lengthComputable) onBytes(e.loaded); };
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300)
      ? resolve()
      : reject(new Error(`Upload failed (${xhr.status}) for ${file.name}`));
    xhr.onerror = () => reject(new Error(`Network error uploading ${file.name}`));
    xhr.send(file);
  });
}

function Drop({ file, onFile, accept, label, hint, disabled }: {
  file: File | null; onFile: (f: File | null) => void;
  accept: string; label: string; hint?: string; disabled?: boolean;
}) {
  const [over, setOver] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div
        role="button" tabIndex={disabled ? -1 : 0} aria-disabled={disabled}
        onClick={() => !disabled && ref.current?.click()}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); ref.current?.click(); }
        }}
        onDragOver={(e) => { if (!disabled) { e.preventDefault(); setOver(true); } }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          if (disabled) return;
          e.preventDefault(); setOver(false);
          const f = e.dataTransfer.files?.[0];
          if (f) onFile(f);
        }}
        className={cn(
          "rounded-lg border border-dashed transition-colors",
          file ? "border-solid p-3" : "p-7 text-center",
          over && "border-brand bg-brand/5",
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:border-brand/60"
        )}
      >
        {file ? (
          <div className="flex items-center gap-3">
            <div className="grid size-9 shrink-0 place-items-center rounded-md bg-brand/10 text-brand">
              <FileVideo className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm">{file.name}</div>
              <div className="text-xs text-muted-foreground">{mb(file.size)}</div>
            </div>
            <Button type="button" variant="ghost" size="icon" disabled={disabled}
                    aria-label={`Remove ${file.name}`}
                    onClick={(e) => { e.stopPropagation(); onFile(null); }}>
              <X className="size-4" />
            </Button>
          </div>
        ) : (
          <>
            <Upload className="mx-auto mb-2 size-5 text-muted-foreground" />
            <div className="text-sm">Drop a file here, or click to choose</div>
            {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
          </>
        )}
        <input ref={ref} type="file" accept={accept} hidden disabled={disabled}
               onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
      </div>
    </div>
  );
}

export function ClipForm({ used, allowed }: { used: number; allowed: number }) {
  const left = Math.max(allowed - used, 0);
  const [video, setVideo] = useState<File | null>(null);
  const [overlay, setOverlay] = useState<File | null>(null);
  const [track, setTrack] = useState<File | null>(null);
  const [query, setQuery] = useState("");
  const [length, setLength] = useState("auto");
  const [captions, setCaptions] = useState(true);
  const [treatment, setTreatment] = useState("talking_head");
  const [more, setMore] = useState(false);
  const [learnMoreOpen, setLearnMoreOpen] = useState(false);

  const [status, setStatus] = useState<Status>("idle");
  const [note, setNote] = useState("");
  const [pct, setPct] = useState(0);
  const [jobId, setJobId] = useState<string | null>(null);
  const [playUrl, setPlayUrl] = useState<string | null>(null);
  const [notes, setNotes] = useState<string[]>([]);
  const [candidates, setCandidates] = useState<any[] | null>(null);
  const [mode, setMode] = useState<"render" | "suggest">("render");
  const [picking, setPicking] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const timer = useRef<any>(null);
  const sending = useRef(false);

  const busy = status === "uploading" || status === "queued" || status === "processing";

  useEffect(() => {
    if (!jobId || status === "done" || status === "failed") return;
    timer.current = setInterval(async () => {
      const j = await (await fetch(`/api/jobs?id=${jobId}`)).json();
      if (j.status) setStatus(j.status);
      if (Array.isArray(j.notes)) setNotes(j.notes);
      if (j.status === "done") {
        setPlayUrl(j.playUrl);
        if (Array.isArray(j.candidates)) setCandidates(j.candidates);
        clearInterval(timer.current);
      }
      if (j.status === "failed") { setErr(j.error ?? "Job failed"); clearInterval(timer.current); }
    }, 3000);
    return () => clearInterval(timer.current);
  }, [jobId, status]);

  // Closing the tab mid-upload loses the bytes already sent for nothing.
  useEffect(() => {
    if (status !== "uploading") return;
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [status]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    // The button is disabled while busy, but a double Enter in the text field
    // can still fire submit twice before React re-renders. This cannot.
    if (sending.current) return;
    setErr(null); setPlayUrl(null); setNotes([]); setCandidates(null);
    if (!video) return setErr("Choose a video to get started.");

    for (const [f, kind] of [[video, "main"], [overlay, "overlay"], [track, "music"]] as const) {
      if (!f) continue;
      const problem = checkUpload(kind, f.size, f.type);
      if (problem) return setErr(`${f.name}: ${problem}`);
    }

    const wantSuggest = !query.trim();
    setMode(wantSuggest ? "suggest" : "render");
    sending.current = true;
    try {
      setStatus("uploading"); setPct(0);
      const queue = [
        { file: video, kind: "main" },
        ...(overlay ? [{ file: overlay, kind: "overlay" }] : []),
        ...(track ? [{ file: track, kind: "music" }] : []),
      ];
      // One bar for all files, weighted by bytes, so it never jumps backwards
      // when a small overlay follows a large source.
      const total = queue.reduce((n, q) => n + q.file.size, 0);
      let done = 0;
      const keys: Record<string, string[]> = { main: [], overlay: [], music: [] };

      for (const { file, kind } of queue) {
        setNote(`${file.name} · ${mb(file.size)}`);
        const r = await fetch("/api/upload-url", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: file.name, kind, contentType: file.type, size: file.size }),
        });
        const { key, url, error } = await r.json();
        if (error) throw new Error(error);
        await putWithProgress(url, file, (sent) =>
          setPct(Math.min(Math.round(((done + sent) / total) * 100), 100)));
        done += file.size;
        setPct(Math.round((done / total) * 100));
        keys[kind].push(key);
      }

      setNote("Creating job…");
      const r = await fetch("/api/jobs", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mainPath: keys.main[0], treatment, overlayPaths: keys.overlay,
          musicPaths: keys.music, length, captions,
          ...(wantSuggest ? { mode: "suggest" } : { query: query.trim() }),
        }),
      });
      const j = await r.json();
      if (j.error) throw new Error(
        /quota/i.test(j.error) ? "That was your last free clip." : j.error);
      setJobId(j.id); setStatus("queued"); setNote("");
    } catch (e: any) {
      setErr(e.message); setStatus("failed");
    } finally {
      sending.current = false;
    }
  }

  // The upload is already in R2 and the job row still carries its path, so the
  // pick reuses it -- nobody re-uploads to render a suggested moment.
  async function renderPick(i: number) {
    if (picking !== null) return;
    setPicking(i); setErr(null);
    try {
      const c = candidates![i];
      const src = (await (await fetch(`/api/jobs?id=${jobId}`)).json())
        .request_json?.main_video_url ?? "";
      const j = await (await fetch("/api/jobs", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mainPath: src.replace("storage://", ""), treatment, captions,
          length: "auto", start: c.start, end: c.end,
        }),
      })).json();
      if (j.error) throw new Error(
        /quota/i.test(j.error) ? "That was your last free clip." : j.error);
      setCandidates(null); setNotes([]); setJobId(j.id);
      setStatus("queued"); setMode("render");
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setPicking(null);
    }
  }

  const stage = (s: Status[]) => s.includes(status);
  const extras = [overlay, track].filter(Boolean).length;

  return (
    <form onSubmit={submit} className="space-y-4">
      <Card>
        <CardContent className="">
          <Drop file={video} onFile={setVideo} accept="video/*" label="Your video"
                disabled={busy}
                hint={`Up to ${humanBytes(maxBytesFor("main"))}, and the whole thing gets transcribed and searched.`} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-5">
          <div className="space-y-4 border-b pb-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-muted-foreground">Clip length</Label>
                <Select value={length} onValueChange={setLength} disabled={busy}>
                  <SelectTrigger size="sm" className="w-full">
                    <SelectValue>{length === "auto" ? "Auto" : `~${length}s`}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">
                      <div className="flex flex-col py-0.5">
                        <span className="font-medium">Auto</span>
                        <span className="text-xs text-muted-foreground">Let us decide</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="15">~15s</SelectItem>
                    <SelectItem value="30">~30s</SelectItem>
                    <SelectItem value="60">~60s</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-muted-foreground">Framing</Label>
                <Select value={treatment} onValueChange={setTreatment} disabled={busy}>
                  <SelectTrigger size="sm" className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="talking_head">Follow the speaker</SelectItem>
                    <SelectItem value="fit_to_frame">Fit the whole frame</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <Switch checked={captions} disabled={busy}
                      onCheckedChange={(v) => setCaptions(Boolean(v))} />
              <span className="text-muted-foreground">Burn in captions</span>
            </label>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between gap-4">
              <div className="flex items-baseline gap-2">
                <Label htmlFor="query">Include specific moments</Label>
                <Badge variant="secondary" className="text-[10px]">optional</Badge>
              </div>
              <button type="button" onClick={() => setLearnMoreOpen(true)}
                      className="shrink-0 text-xs text-muted-foreground">
                Not sure how to prompt?{" "}
                <span className="text-brand underline-offset-4 hover:underline">Learn more</span>
              </button>
            </div>
            <Input id="query" value={query} disabled={busy}
                   placeholder="e.g. the moment they talk about almost going bankrupt"
                   onChange={(e) => setQuery(e.target.value)} />
            <p className="text-xs text-muted-foreground">
              {query.trim()
                ? "No timestamps needed — the moment is found for you."
                : "Leave this empty and the best moments get suggested for you."}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden py-0">
        <button type="button" onClick={() => setMore(!more)} aria-expanded={more}
                disabled={busy}
                className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-muted/50 disabled:opacity-60">
          <div className="grid size-9 shrink-0 place-items-center rounded-md bg-brand/10 text-brand">
            <Upload className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium">B-roll and music</div>
            <div className="truncate text-xs text-muted-foreground">
              Optional — add an overlay clip or a track
            </div>
          </div>
          {extras > 0 && <Badge>{extras}</Badge>}
          <ChevronDown className={cn("size-4 shrink-0 text-muted-foreground transition-transform",
                                     more && "rotate-180")} />
        </button>

        {more && (
          <CardContent className="space-y-4 border-t pt-4 pb-6">
            <Drop file={overlay} onFile={setOverlay} accept="video/*,image/*" disabled={busy}
                  label="B-roll overlay (optional)"
                  hint="Cut away to this where it fits what's being said." />
            <Drop file={track} onFile={setTrack} accept="audio/*" disabled={busy}
                  label="Music (optional)"
                  hint="Mixed under the dialogue and level-matched automatically." />
          </CardContent>
        )}
      </Card>

      <Dialog open={learnMoreOpen} onOpenChange={setLearnMoreOpen}>
        <DialogContent className="gap-5 p-6 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Writing a good prompt</DialogTitle>
            <DialogDescription>
              The whole transcript is searched by meaning, not keywords — describe the
              moment, not the exact words used.
            </DialogDescription>
          </DialogHeader>
          <ul className="space-y-3 text-sm">
            <li>
              <div className="font-medium">Describe the topic, not a quote</div>
              <p className="text-muted-foreground">
                &ldquo;the story about his first job&rdquo; finds it even if he never says those words.
              </p>
            </li>
            <li>
              <div className="font-medium">Name a person, place, or event</div>
              <p className="text-muted-foreground">
                &ldquo;when Sarah talks about the funding round&rdquo; beats &ldquo;the interesting part.&rdquo;
              </p>
            </li>
            <li>
              <div className="font-medium">Or leave it blank</div>
              <p className="text-muted-foreground">
                With no prompt at all, the best few moments are ranked and suggested for
                you to pick from.
              </p>
            </li>
          </ul>
        </DialogContent>
      </Dialog>

      <Button type="submit" size="lg" variant="gradient" className="w-full" disabled={busy || left === 0}>
        {busy && <Loader2 className="animate-spin" />}
        {status === "uploading" ? `Uploading… ${pct}%`
          : busy ? "Working…"
          : left === 0 ? "No clips left"
          : query.trim() ? "Generate clip" : "Suggest the best moments"}
      </Button>

      {err && status === "idle" && (
        <Alert variant="destructive"><AlertDescription>{err}</AlertDescription></Alert>
      )}
      <p className="text-center text-xs text-muted-foreground">
        {left === 0 ? "You've used all your free clips."
                    : `${left} of ${allowed} free clips left`}
      </p>

      {status !== "idle" && (
        <Card>
          <CardContent className="space-y-4 pt-6">
            {status === "uploading" && (
              <div className="space-y-2">
                <div className="flex items-baseline justify-between text-sm">
                  <span className="truncate text-muted-foreground">{note}</span>
                  <span className="font-medium tabular-nums">{pct}%</span>
                </div>
                <Progress value={pct} indicatorClassName="bg-gradient-to-r from-brand to-brand-2" />
                <p className="text-xs text-muted-foreground">
                  Keep this tab open until the upload finishes.
                </p>
              </div>
            )}

            {candidates && candidates.length > 0 && (
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium">Pick a moment</h3>
                  <p className="text-xs text-muted-foreground">
                    Nothing has been rendered yet — choosing one uses a clip.
                  </p>
                </div>
                {candidates.map((c, i) => (
                  <div key={i} className="rounded-lg border p-3">
                    <div className="mb-1.5 flex items-center gap-2">
                      <Badge className="shrink-0 bg-brand/15 text-brand">{i + 1}</Badge>
                      <span className="min-w-0 flex-1 truncate text-sm font-medium">
                        {c.title || `${Math.round(c.duration)}s moment`}
                      </span>
                      <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                        {Math.floor(c.start / 60)}:{String(Math.floor(c.start % 60)).padStart(2, "0")} · {Math.round(c.duration)}s
                      </span>
                    </div>
                    {c.reason && <p className="mb-2 text-xs text-muted-foreground">{c.reason}</p>}
                    <p className="mb-3 line-clamp-3 text-xs text-muted-foreground/80">“{c.text}”</p>
                    <Button type="button" size="sm" className="w-full"
                            disabled={picking !== null} onClick={() => renderPick(i)}>
                      {picking === i && <Loader2 className="animate-spin" />}
                      {picking === i ? "Starting…" : "Make this clip"}
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <ol className="space-y-2 text-sm">
              {[
                ["Uploading", stage(["uploading"])],
                ["Queued", stage(["queued"])],
                [mode === "suggest" ? "Transcribing and ranking" : "Transcribing, finding your moment, rendering",
                 stage(["processing"])],
                [mode === "suggest" ? "Moments ready" : "Done", stage(["done"])],
              ].map(([label, active], i) => (
                <li key={i} className={cn("flex items-center gap-2.5",
                                          active ? "text-foreground" : "text-muted-foreground")}>
                  <span className={cn("size-1.5 shrink-0 rounded-full",
                                      active ? "animate-pulse bg-brand" : "bg-border")} />
                  {label as string}
                </li>
              ))}
            </ol>

            {notes.length > 0 && (
              <ul className="space-y-1 border-t pt-3 text-xs text-muted-foreground">
                {notes.map((n, i) => <li key={i}>{n}</li>)}
              </ul>
            )}
            {err && <Alert variant="destructive"><AlertDescription>{err}</AlertDescription></Alert>}

            {playUrl && (
              <div className="space-y-3 border-t pt-4">
                <video src={playUrl} controls playsInline
                       className="max-h-[480px] w-full rounded-lg bg-black" />
                <Button asChild className="w-full">
                  <a href={playUrl} download><Download className="size-4" />Download clip</a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </form>
  );
}
