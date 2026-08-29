import { NextResponse } from "next/server";
import { presignGet, NotConfigured } from "@/lib/r2";
import { createClient, currentUser } from "@/lib/supabase/server";
import { MAX_QUERY_CHARS, MIN_CLIP_SECONDS, MAX_CLIP_SECONDS } from "@/lib/limits";

// POST: create a job row. The worker is polling for exactly this.
export async function POST(req: Request) {
  try {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });
  const body = await req.json();
  const { mainPath, query, start, end, treatment, length, captions = true,
          overlayPaths = [], musicPaths = [], moodTags = [], mode } = body;
  const isSuggest = mode === "suggest";

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
  // mainPath must be a key we issued for THIS user, not an arbitrary string --
  // otherwise a caller could point a job at someone else's upload.
  if (!String(mainPath).startsWith(`uploads/${user.id}/`))
    return NextResponse.json({ error: "unknown upload" }, { status: 400 });

  const request_json = {
    main_video_url: `storage://${mainPath}`,
    // A range is a manual trim; a query lets the worker find the moment itself.
    ...(hasRange ? { clip_range: { start: Number(start), end: Number(end) } } : {}),
    ...(hasQuery ? { query: String(query).trim() } : {}),
    // "suggest" stops after ranking and returns candidates; the pick is filed
    // afterwards as an ordinary render job carrying a clip_range.
    ...(isSuggest ? { mode: "suggest" } : {}),
    canvas: "9:16",
    treatment: treatment ?? "talking_head",
    overlays: overlayPaths.map((p: string) => ({ url: `storage://${p}`, tags: [] })),
    music: musicPaths.map((p: string) => ({ url: `storage://${p}`, tags: [] })),
    mood_tags: moodTags,
    // "auto" lets the worker pick the length from the content.
    target_duration: length === "auto" || length === undefined ? "auto" : Number(length),
    captions: Boolean(captions),
    caption_style: "bold-yellow-pop",
    allow_vocals: true,
  };

  // Written through the USER's session, so Row Level Security checks
  // auth.uid() = user_id in Postgres. Even if this handler had a bug, the
  // database would refuse to file a job under somebody else's id.
  const db = await createClient();
  const { data, error } = await db
    .from("jobs")
    .insert({ user_id: user.id, status: "queued", request_json })
    .select("id")
    .single();

  if (error) {
    // The database trigger is the source of truth for the free-tier caps, so this
    // is where the quota refusal surfaces.
    if (/clip_quota_reached/.test(error.message))
      return NextResponse.json(
        { error: "You've used all your free clips." }, { status: 403 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // The output path needs the job id, which only exists after the insert.
  // A suggest job renders nothing, so reserving an outputs/ key for it would
  // promise a file that never arrives.
  if (!isSuggest) {
    const outPath = `storage://outputs/${user.id}/${data.id}.mp4`;  // outputs/ prefix = 30-day lifecycle rule
    await db.from("jobs")
      .update({ request_json: { ...request_json, output_bucket_path: outPath } })
      .eq("id", data.id);
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
      .neq("request_json->>mode", "suggest")
      .order("created_at", { ascending: false })
      .limit(25);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const clips = await Promise.all((data ?? []).map(async (j: any) => ({
      id: j.id,
      status: j.status,
      created_at: j.created_at,
      query: j.request_json?.query ?? null,
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
