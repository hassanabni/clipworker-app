import { NextResponse } from "next/server";
import { presignGet, NotConfigured } from "@/lib/r2";
import { createClient, currentUser } from "@/lib/supabase/server";
import { getOrg } from "@/lib/org";
import { MAX_QUERY_CHARS, MIN_CLIP_SECONDS, MAX_CLIP_SECONDS, isCanvas,
         MAX_CLIP_COUNT, DEFAULT_CLIP_COUNT } from "@/lib/limits";
import { kitToJobBrand, type BrandKit } from "@/lib/brand";

// The caps live in database triggers (they must: any caller holding a session
// can post straight to PostgREST and never touch a route handler). Each raises
// a bare code; these are the user-facing translations. Order matters only in
// that the first match wins.
const REFUSALS = [
  { code: /clip_quota_reached/,
    message: "This workspace has used all its clips for the month." },
  { code: /org_queue_full/,
    message: "Your workspace already has the maximum number of clips rendering. Try again in a few minutes." },
  { code: /job_already_running/,
    message: "You already have a clip rendering. Wait for it, or cancel it from Clips and try again.",
    // The form uses this to offer a one-click cancel rather than leaving the
    // user stuck behind a job that may well be a leftover.
    offerCancel: true },
  { code: /suggest_limit_reached/,
    message: "This workspace has hit its daily limit for suggestions." },
  { code: /user_has_no_org/,
    message: "Your account isn't attached to a workspace yet." },
];

/** Shortest trim worth making. Mirrors pipeline.MIN_TRIM_SECONDS in the worker. */
const MIN_TRIM_SECONDS = 1;

/**
 * File a trim against an existing finished clip.
 *
 * Ownership is proved by the SELECT: RLS scopes it to the caller's workspace, so
 * a sourceJobId from another org simply does not come back. The id is never
 * trusted on its own.
 */
async function createTrim(orgId: string, userId: string, sourceJobId: unknown,
                          start: unknown, end: unknown) {
  if (!sourceJobId || typeof sourceJobId !== "string")
    return NextResponse.json({ error: "sourceJobId required" }, { status: 400 });

  const db = await createClient();
  const { data: parent } = await db
    .from("jobs").select("id, status, result_url, request_json")
    .eq("id", sourceJobId).maybeSingle();

  if (!parent || parent.status !== "done" ||
      !String(parent.result_url ?? "").startsWith("storage://outputs/"))
    return NextResponse.json({ error: "That clip cannot be trimmed." }, { status: 400 });

  const s = Number(start), e = Number(end);
  if (!Number.isFinite(s) || !Number.isFinite(e) || s < 0 || !(e > s))
    return NextResponse.json({ error: "Choose a start and an end." }, { status: 400 });
  if (e - s < MIN_TRIM_SECONDS)
    return NextResponse.json(
      { error: `A trim has to keep at least ${MIN_TRIM_SECONDS}s.` }, { status: 400 });

  const jobId = crypto.randomUUID();
  const request_json = {
    mode: "trim",
    // The parent's OUTPUT is the input. The original upload is long gone -- it
    // is deleted as soon as a render succeeds.
    main_video_url: parent.result_url,
    source_job_id: parent.id,
    clip_range: { start: s, end: e },
    // Carried so the gallery and the detail page can shape the card correctly;
    // the trim itself does not re-frame anything.
    canvas: (parent.request_json as Record<string, unknown>)?.canvas ?? "9:16",
    output_bucket_path: `storage://outputs/${orgId}/${jobId}.mp4`,
  };

  const { data, error } = await db
    .from("jobs")
    .insert({ id: jobId, user_id: userId, status: "queued", request_json })
    .select("id").single();

  if (error) {
    const refusal = REFUSALS.find((r) => r.code.test(error.message));
    if (refusal) return NextResponse.json({ error: refusal.message }, { status: 403 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ id: data.id });
}

// POST: create a job row. The worker is polling for exactly this.
export async function POST(req: Request) {
  try {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });
  const org = await getOrg();
  if (!org) return NextResponse.json({ error: "no workspace" }, { status: 403 });
  const body = await req.json();
  const { mainPath, query, start, end, treatment, length, captions = true,
          overlayPaths = [], musicPaths = [], moodTags = [], mode, canvas,
          sourceJobId, clipCount } = body;
  // A suggest job ranks moments and renders nothing, so it has no use for a
  // reel count. If a caller sends both, the count is the real instruction:
  // "make me 3 reels" cannot be satisfied by handing back a shortlist.
  const isSuggest = mode === "suggest" && Number(body.clipCount ?? 1) <= 1;

  // A trim re-cuts a clip that already exists. It shares nothing with the
  // render path except the jobs table, so it gets its own branch rather than a
  // pile of conditionals through the one below.
  if (mode === "trim") return createTrim(org.id, user.id, sourceJobId, start, end);

  if (!mainPath) return NextResponse.json({ error: "mainPath required" }, { status: 400 });
  const hasRange = start !== undefined && end !== undefined && end !== "" && start !== "";
  const hasQuery = typeof query === "string" && query.trim().length > 0;
  // Neither a range nor a query is valid now: that is auto mode, where the
  // worker ranks the candidate moments itself and picks one.
  // Range sanity. Order was checked; magnitude was not, so a job could ask for
  // 0 to 999999 and occupy the only worker indefinitely.
  if (hasRange) {
    const s = Number(start), e = Number(end);
    if (!Number.isFinite(s) || !Number.isFinite(e) || s < 0)
      return NextResponse.json({ error: "start and end must be numbers" }, { status: 400 });
    if (!(e > s))
      return NextResponse.json({ error: "end must be after start" }, { status: 400 });
    const len = e - s;
    if (len < MIN_CLIP_SECONDS || len > MAX_CLIP_SECONDS)
      return NextResponse.json(
        { error: `A clip must be between ${MIN_CLIP_SECONDS}s and ${MAX_CLIP_SECONDS}s.` },
        { status: 400 });
  }
  if (hasQuery && String(query).trim().length > MAX_QUERY_CHARS)
    return NextResponse.json(
      { error: `Keep the description under ${MAX_QUERY_CHARS} characters.` },
      { status: 400 });
  // mainPath must be a key we issued for THIS workspace, not an arbitrary
  // string -- otherwise a caller could point a job at someone else's upload.
  //
  // The old per-user prefix is still accepted for one release. Two things need
  // it: an upload that finished just before this deployed, and -- less
  // obviously -- clip-form's renderPick, which re-submits a PREVIOUS suggest
  // job's main_video_url straight back through this validator. Without the
  // dual accept every pre-deploy shortlist becomes un-renderable. uploads/ has
  // a 1-day lifecycle rule, so those keys are gone within a day anyway.
  const path = String(mainPath);
  if (!path.startsWith(`uploads/${org.id}/`) && !path.startsWith(`uploads/${user.id}/`))
    return NextResponse.json({ error: "unknown upload" }, { status: 400 });

  // The id is generated here rather than let the database default it, so the
  // output path (which needs the id) can go into the INSERT. It used to be a
  // second UPDATE, which raced the worker -- it polls every 3s and could claim
  // the row before the path was written -- and depended on an UPDATE policy on
  // `jobs` that the schema does not grant.
  const jobId = crypto.randomUUID();

  const db = await createClient();
  // RLS scopes this to the caller's own workspace.
  const { data: kit } = await db.from("brand_kits").select("*").maybeSingle();

  // Aspect ratio is a per-JOB choice, not a brand-kit lock: it is a
  // distribution decision (where this clip gets posted), not brand identity.
  // The kit only supplies the default.
  const chosenCanvas = isCanvas(canvas) ? canvas : (kit?.default_canvas ?? "9:16");

  // Clamped server-side, not just in the form: each reel costs a clip credit,
  // so an unbounded value here would spend the whole month's quota on one
  // upload. A manual range means the user already chose the moment, so there is
  // nothing to make a batch out of.
  const count = hasRange
    ? 1
    : Math.min(MAX_CLIP_COUNT, Math.max(1, Number(clipCount) || DEFAULT_CLIP_COUNT));

  const request_json = {
    main_video_url: `storage://${mainPath}`,
    // A range is a manual trim; a query lets the worker find the moment itself.
    ...(hasRange ? { clip_range: { start: Number(start), end: Number(end) } } : {}),
    ...(hasQuery ? { query: String(query).trim() } : {}),
    // "suggest" stops after ranking and returns candidates; the pick is filed
    // afterwards as an ordinary render job carrying a clip_range.
    ...(isSuggest ? { mode: "suggest" } : {}),
    canvas: chosenCanvas,
    treatment: treatment ?? "talking_head",
    overlays: overlayPaths.map((p: string) => ({ url: `storage://${p}`, tags: [] })),
    music: musicPaths.map((p: string) => ({ url: `storage://${p}`, tags: [] })),
    mood_tags: moodTags,
    // "auto" lets the worker pick the length from the content.
    target_duration: length === "auto" || length === undefined ? "auto" : Number(length),
    captions: Boolean(captions),
    clip_count: count,
    // The workspace's brand kit, snapshotted onto this job. Without this the
    // worker falls back to its dataclass defaults and the clip renders in stock
    // styling with no logo -- the kit is read here but has to be SENT.
    brand: kitToJobBrand(kit as BrandKit | null),
    caption_style: "bold-yellow-pop",
    allow_vocals: true,
    // A suggest job renders nothing, so reserving an outputs/ key for it would
    // promise a file that never arrives.
    ...(isSuggest
      ? {}
      // outputs/ prefix = 30-day lifecycle rule
      : { output_bucket_path: `storage://outputs/${org.id}/${jobId}.mp4` }),
  };

  // Written through the USER's session, so Row Level Security checks the row
  // against their workspace in Postgres. Even if this handler had a bug, the
  // database would refuse to file a job into somebody else's workspace.
  // org_id is filled by the a_set_job_org trigger from user_id, so it is
  // deliberately not sent from here.
  const { data, error } = await db
    .from("jobs")
    .insert({ id: jobId, user_id: user.id, status: "queued", request_json })
    .select("id")
    .single();

  if (error) {
    // The database triggers are the source of truth for every cap, so this is
    // where they surface. Each raises a bare code; turn it into a sentence that
    // says what happened and what to do about it.
    const refusal = REFUSALS.find((r) => r.code.test(error.message));
    if (refusal)
      return NextResponse.json(
        { error: refusal.message, offerCancel: Boolean(refusal.offerCancel) },
        { status: 403 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
  } catch (e) {
    if (e instanceof NotConfigured) return NextResponse.json({ error: e.message }, { status: 503 });
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// GET ?id= : status for the polling UI, plus a playable URL once it's done.
export async function GET(req: Request) {
  try {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });

  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  const db = await createClient();
  // No id: return this user's recent clips. RLS scopes the rows, not this code.
  if (!id) {
    const { data, error } = await db
      .from("jobs")
      .select("id, status, result_url, error, created_at, request_json")
      // A render job carries no "mode" key at all, so request_json->>'mode' is NULL
    // for it -- and `neq` becomes `<> 'suggest'`, which evaluates to NULL, not
    // TRUE. SQL keeps only rows where a WHERE clause is TRUE, so this filter was
    // silently excluding EVERY clip. Measured on the real database: 0 rows
    // returned where 13 exist. Has to test for the null explicitly.
    .or("request_json->>mode.is.null,request_json->>mode.neq.suggest")
      .order("created_at", { ascending: false })
      .limit(25);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const clips = await Promise.all((data ?? []).map(async (j: any) => ({
      id: j.id,
      status: j.status,
      created_at: j.created_at,
      query: j.request_json?.query ?? null,
      // The reels of a batch are separate rows created by the WORKER after the
      // first one renders, so the page that filed the job has no other way to
      // find them.
      batchOf: j.request_json?.batch_of ?? null,
      canvas: j.request_json?.canvas ?? "9:16",
      playUrl: j.status === "done" && j.result_url?.startsWith("storage://")
        ? await presignGet(j.result_url.replace("storage://", "")) : null,
    })));
    return NextResponse.json({ clips });
  }
  const { data, error } = await db
    .from("jobs").select("status, result_url, error, notes, result_json, request_json, created_at, updated_at")
    .eq("id", id).single();   // RLS also restricts this to the owner
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });

  let playUrl: string | null = null;
  if (data.status === "done" && data.result_url?.startsWith("storage://")) {
    playUrl = await presignGet(data.result_url.replace("storage://", ""));
  }
  return NextResponse.json({
    ...data,
    mode: (data as any).request_json?.mode ?? "render",
    candidates: (data as any).result_json ?? null,
    playUrl,
  });
  } catch (e) {
    if (e instanceof NotConfigured) return NextResponse.json({ error: e.message }, { status: 503 });
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
