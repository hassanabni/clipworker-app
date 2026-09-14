import { NextResponse } from "next/server";
import { createClient, currentUser } from "@/lib/supabase/server";
import { getOrg } from "@/lib/org";
import { CANVASES } from "@/lib/limits";
import { CAPTION_FONTS, CAPTION_POSITIONS, LOGO_POSITIONS } from "@/lib/brand";

// The Brand Kit: one row per workspace.
//
// Validation here is a courtesy that gives a readable message; the real rules
// are CHECK constraints on the table, so a caller going straight to PostgREST
// gets refused too.

const HEX = /^#[0-9A-Fa-f]{6}$/;

/** Matches the cap the palette editor enforces in brand-kit-form.tsx. */
const MAX_BRAND_COLOURS = 12;

/** null when acceptable, otherwise a message safe to show a user. */
function validate(b: Record<string, unknown>): string | null {
  const inSet = (v: unknown, set: readonly string[], what: string) =>
    typeof v === "string" && set.includes(v) ? null : `Pick a valid ${what}.`;

  const checks = [
    b.caption_font !== undefined && inSet(b.caption_font, CAPTION_FONTS, "font"),
    b.caption_position !== undefined && inSet(b.caption_position, CAPTION_POSITIONS, "caption position"),
    b.logo_position !== undefined && inSet(b.logo_position, LOGO_POSITIONS, "logo position"),
    b.default_canvas !== undefined && inSet(b.default_canvas, CANVASES, "aspect ratio"),
  ].filter((x): x is string => typeof x === "string");
  if (checks.length) return checks[0];

  for (const key of ["caption_primary", "caption_highlight", "caption_outline"] as const) {
    if (b[key] !== undefined && !HEX.test(String(b[key])))
      return "Colours must be six-digit hex, like #FED732.";
  }

  const ranges: [string, number, number][] = [
    ["logo_scale", 0.04, 0.4],
    ["logo_opacity", 0.1, 1],
    ["logo_margin", 0, 0.15],
    ["caption_outline_w", 0, 20],
    ["caption_font_scale", 0.5, 2],
    // Free placement, as a fraction of the frame.
    ["logo_x", 0, 1], ["logo_y", 0, 1],
    ["caption_x", 0, 1], ["caption_y", 0, 1],
  ];
  for (const [key, lo, hi] of ranges) {
    if (b[key] === undefined) continue;
    const n = Number(b[key]);
    if (!Number.isFinite(n) || n < lo || n > hi) return `${key} must be between ${lo} and ${hi}.`;
  }

  // brand_colors is the one field with no CHECK constraint behind it -- it is
  // jsonb, so the database will accept any shape at all. That makes this the
  // only guard, which is why it checks the element type and not just the array.
  if (b.brand_colors !== undefined) {
    const v = b.brand_colors;
    if (!Array.isArray(v)) return "Brand colours must be a list.";
    if (v.length > MAX_BRAND_COLOURS)
      return `Keep the palette to ${MAX_BRAND_COLOURS} colours or fewer.`;
    if (!v.every((c) => typeof c === "string" && HEX.test(c)))
      return "Brand colours must be six-digit hex, like #FED732.";
  }

  // A logo has to live under brands/. uploads/ is on a 1-day lifecycle rule, so
  // a logo stored there would vanish and every clip after that would fail on a
  // missing ffmpeg input.
  if (b.logo_url !== undefined && b.logo_url !== null && b.logo_url !== "") {
    if (!String(b.logo_url).startsWith("storage://brands/"))
      return "That logo was not uploaded correctly. Try choosing the file again.";
  }
  return null;
}

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });
  const org = await getOrg();
  if (!org) return NextResponse.json({ error: "no workspace" }, { status: 403 });

  const db = await createClient();
  const { data } = await db.from("brand_kits").select("*").maybeSingle();
  return NextResponse.json({ kit: data ?? null, org });
}

export async function PUT(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });
  const org = await getOrg();
  if (!org) return NextResponse.json({ error: "no workspace" }, { status: 403 });

  // The RLS policy in sql/kit_admins.sql is what actually enforces this; the
  // check here exists so a refusal reads as a sentence instead of surfacing as
  // a bare "new row violates row-level security policy".
  const db0 = await createClient();
  const { data: role } = await db0.rpc("my_org_role");
  if (role !== "owner" && role !== "admin")
    return NextResponse.json(
      { error: "Only an owner or admin can change the brand kit." }, { status: 403 });

  const fields = (await req.json()) ?? {};

  const problem = validate(fields);
  if (problem) return NextResponse.json({ error: problem }, { status: 400 });

  const db = await createClient();
  const row = { ...fields, org_id: org.id };

  // upsert rather than insert-or-update: the kit row may not exist yet, and
  // there is exactly one per org, keyed by org_id.
  const { data, error } = await db
    .from("brand_kits").upsert(row, { onConflict: "org_id" }).select().maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ kit: data });
}
