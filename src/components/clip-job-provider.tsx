"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { checkUpload, type Canvas } from "@/lib/limits";

/**
 * The clip being uploaded or rendered, held ABOVE the page.
 *
 * It used to live in ClipForm's own state, which meant leaving /app/new -- a
 * glance at Team, a click on Clips -- unmounted the form, abandoned the upload
 * in flight, and lost track of a render that was still running. Coming back
 * showed an empty form, so the obvious move was to start the clip again: a
 * second upload of the same file, and a job the database then refuses with
 * "job_already_running".
 *
 * Mounted in app/layout.tsx, so it survives any navigation inside the
 * dashboard. Two things it deliberately does NOT try to survive: a full page
 * reload or leaving /app entirely (the browser cannot keep an upload alive
 * without the page), which is why a job in flight is also restored from the
 * server on mount -- the upload cannot be resumed, but the render can be
 * followed.
 */

export type JobStatus = "idle" | "uploading" | "queued" | "processing" | "done" | "failed";

export type StartOpts = {
  video: File;
  overlay: File | null;
  track: File | null;
  query: string;
  length: string;
  captions: boolean;
  treatment: string;
  canvas: Canvas;
  clipCount: number;
};

type Candidate = { start: number; end: number; duration: number; title?: string; reason?: string; text?: string };
type Sibling = { id: string; status: string; playUrl: string | null; batchOf: string | null };

type ClipJob = {
  status: JobStatus;
  pct: number;
  note: string;
  jobId: string | null;
  mode: "render" | "suggest";
  notes: string[];
  playUrl: string | null;
  candidates: Candidate[] | null;
  siblings: Sibling[];
  clipCount: number;
  err: string | null;
  blocked: boolean;
  picking: number | null;
  clearing: boolean;
  /** True while the first "is something already running?" check is in flight. */
  restoring: boolean;
  busy: boolean;
  start: (opts: StartOpts) => Promise<void>;
  renderPick: (i: number, opts: { treatment: string; canvas: Canvas; captions: boolean }) => Promise<void>;
  clearStuck: () => Promise<void>;
  reset: () => void;
  setErr: (msg: string | null) => void;
};

const Ctx = createContext<ClipJob | null>(null);

export function useClipJob(): ClipJob {
  const c = useContext(Ctx);
  if (!c) throw new Error("useClipJob must be used inside <ClipJobProvider>");
  return c;
}

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

export function ClipJobProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<JobStatus>("idle");
  const [pct, setPct] = useState(0);
  const [note, setNote] = useState("");
  const [jobId, setJobId] = useState<string | null>(null);
  const [mode, setMode] = useState<"render" | "suggest">("render");
  const [notes, setNotes] = useState<string[]>([]);
  const [playUrl, setPlayUrl] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<Candidate[] | null>(null);
  const [siblings, setSiblings] = useState<Sibling[]>([]);
  const [clipCount, setClipCount] = useState(1);
  const [err, setErr] = useState<string | null>(null);
  const [blocked, setBlocked] = useState(false);
  const [picking, setPicking] = useState<number | null>(null);
  const [clearing, setClearing] = useState(false);
  const [restoring, setRestoring] = useState(true);
  const sending = useRef(false);

  const busy = status === "uploading" || status === "queued" || status === "processing";

  // Adopt a job that is already running -- after a reload, or when this provider
  // mounts for the first time in a session that left a render going.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await (await fetch("/api/jobs")).json();
        const live = (list.clips ?? []).find(
          (c: { status: string }) => c.status === "queued" || c.status === "processing");
        if (!live || cancelled) return;
        const j = await (await fetch(`/api/jobs?id=${live.id}`)).json();
        if (cancelled) return;
        setJobId(live.id);
        setStatus((j.status ?? live.status) as JobStatus);
        setMode(j.mode === "suggest" ? "suggest" : "render");
        setNotes(Array.isArray(j.notes) ? j.notes : []);
        setClipCount(Number(j.request_json?.clip_count ?? 1));
      } catch {
        /* the form still works; it just will not know about an older job */
      } finally {
        if (!cancelled) setRestoring(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Follow the job until it finishes.
  useEffect(() => {
    if (!jobId || status === "done" || status === "failed" || status === "idle") return;
    const t = setInterval(async () => {
      try {
        const j = await (await fetch(`/api/jobs?id=${jobId}`)).json();
        if (j.status) setStatus(j.status as JobStatus);
        if (Array.isArray(j.notes)) setNotes(j.notes);
        if (j.status === "done") {
          setPlayUrl(j.playUrl ?? null);
          if (Array.isArray(j.candidates)) setCandidates(j.candidates);
          clearInterval(t);
        }
        if (j.status === "failed") { setErr(j.error ?? "Job failed"); clearInterval(t); }
      } catch { /* transient; the next tick retries */ }
    }, 3000);
    return () => clearInterval(t);
  }, [jobId, status]);

  // Once reel 1 is done the worker queues the rest, one after another. Poll
  // until they land, or the page shows one clip when five were asked for.
  useEffect(() => {
    if (!jobId || clipCount < 2 || status !== "done") return;
    let stop = false;
    const tick = async () => {
      try {
        const list = await (await fetch("/api/jobs")).json();
        const mine = (list.clips ?? []).filter((c: Sibling) => c.batchOf === jobId);
        if (!stop) setSiblings(mine);
        if (mine.length >= clipCount - 1 &&
            mine.every((c: Sibling) => c.status === "done" || c.status === "failed")) {
          clearInterval(t);
        }
      } catch { /* transient */ }
    };
    const t = setInterval(tick, 4000);
    void tick();
    return () => { stop = true; clearInterval(t); };
  }, [jobId, clipCount, status]);

  // Closing the tab mid-upload loses the bytes already sent for nothing.
  useEffect(() => {
    if (status !== "uploading") return;
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [status]);

  const reset = useCallback(() => {
    setStatus("idle"); setPct(0); setNote(""); setJobId(null); setNotes([]);
    setPlayUrl(null); setCandidates(null); setSiblings([]); setErr(null);
    setBlocked(false); setClipCount(1); setMode("render");
  }, []);

  const start = useCallback(async (o: StartOpts) => {
    // The button is disabled while busy, but a double Enter in the text field
    // can still fire submit twice before React re-renders. This cannot.
    if (sending.current) return;
    setErr(null); setPlayUrl(null); setNotes([]); setCandidates(null); setSiblings([]);

    for (const [f, kind] of [[o.video, "main"], [o.overlay, "overlay"], [o.track, "music"]] as const) {
      if (!f) continue;
      const problem = checkUpload(kind, f.size, f.type);
      if (problem) { setErr(`${f.name}: ${problem}`); return; }
    }

    // An empty prompt used to mean "show me a shortlist to pick from". That is
    // still right for a single clip, but asking for SEVERAL reels is an
    // instruction to make them, not a request for options -- and a suggest job
    // renders nothing, so it would silently ignore the count.
    const wantSuggest = !o.query.trim() && o.clipCount === 1;
    setMode(wantSuggest ? "suggest" : "render");
    setClipCount(o.clipCount);
    sending.current = true;
    try {
      setStatus("uploading"); setPct(0);
      const queue = [
        { file: o.video, kind: "main" },
        ...(o.overlay ? [{ file: o.overlay, kind: "overlay" }] : []),
        ...(o.track ? [{ file: o.track, kind: "music" }] : []),
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
          mainPath: keys.main[0], treatment: o.treatment, canvas: o.canvas,
          clipCount: o.clipCount, overlayPaths: keys.overlay, musicPaths: keys.music,
          length: o.length, captions: o.captions,
          ...(wantSuggest ? { mode: "suggest" } : { query: o.query.trim() }),
        }),
      });
      const j = await r.json();
      if (j.error) {
        // A leftover job blocking the queue is the common case here, so offer
        // the fix instead of just reporting the wall.
        if (j.offerCancel) setBlocked(true);
        throw new Error(/quota/i.test(j.error) ? "That was your last free clip." : j.error);
      }
      setJobId(j.id); setStatus("queued"); setNote("");
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
      setStatus("failed");
    } finally {
      sending.current = false;
    }
  }, []);

  // The upload is already in R2 and the job row still carries its path, so the
  // pick reuses it -- nobody re-uploads to render a suggested moment.
  const renderPick = useCallback(async (
    i: number, o: { treatment: string; canvas: Canvas; captions: boolean },
  ) => {
    if (picking !== null || !candidates || !jobId) return;
    setPicking(i); setErr(null);
    try {
      const c = candidates[i];
      const src = (await (await fetch(`/api/jobs?id=${jobId}`)).json())
        .request_json?.main_video_url ?? "";
      const j = await (await fetch("/api/jobs", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // `canvas` matters here too: without it, picking a suggested moment
          // silently reverts to the workspace default and quietly ignores what
          // was chosen on the form.
          mainPath: src.replace("storage://", ""), treatment: o.treatment,
          canvas: o.canvas, captions: o.captions,
          length: "auto", start: c.start, end: c.end,
        }),
      })).json();
      if (j.error) throw new Error(
        /quota/i.test(j.error) ? "That was your last free clip." : j.error);
      setCandidates(null); setNotes([]); setJobId(j.id);
      setStatus("queued"); setMode("render");
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setPicking(null);
    }
  }, [candidates, jobId, picking]);

  /** Cancel whatever is in flight so the queue is free again. */
  const clearStuck = useCallback(async () => {
    setClearing(true);
    try {
      const list = await (await fetch("/api/jobs")).json();
      const live = (list.clips ?? []).filter(
        (c: { status: string }) => c.status === "queued" || c.status === "processing");
      for (const c of live as { id: string }[]) {
        await fetch("/api/jobs/cancel", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: c.id }),
        });
      }
      setBlocked(false);
      setJobId(null);
      setStatus("idle");
      setErr(live.length
        ? `Cleared ${live.length} job${live.length > 1 ? "s" : ""}. Try again.`
        : "Nothing was actually running. Try again.");
    } catch {
      setErr("Could not clear it. Reload and try again.");
    } finally {
      setClearing(false);
    }
  }, []);

  return (
    <Ctx.Provider value={{
      status, pct, note, jobId, mode, notes, playUrl, candidates, siblings,
      clipCount, err, blocked, picking, clearing, restoring, busy,
      start, renderPick, clearStuck, reset, setErr,
    }}>
      {children}
    </Ctx.Provider>
  );
}
