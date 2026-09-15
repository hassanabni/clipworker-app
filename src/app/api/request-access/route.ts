import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { CONTACT_EMAIL } from "@/lib/contact";

/**
 * The /request-access form.
 *
 * Two independent deliveries, so a request is not lost if one is down:
 *  1. A row in public.demo_requests (sql/demo_requests.sql in the worker repo),
 *     written with the service-role key. RLS is on with no policies, so nothing
 *     in the browser can read it back.
 *  2. An email to the team via Resend, when RESEND_API_KEY is set. It goes to
 *     REQUEST_ACCESS_TO (comma-separated; defaults to CONTACT_EMAIL), with the
 *     visitor as reply-to so answering the email answers them.
 *
 * The visitor sees success if either delivery worked.
 */

const LIMITS = {
  first_name: 100, last_name: 100, email: 320, phone: 40, country: 100, message: 4000, source: 500,
} as const;
type Field = keyof typeof LIMITS;
type Request_ = Record<Field, string>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function bad(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}

export async function POST(req: Request) {
  let raw: Record<string, unknown>;
  try {
    raw = await req.json();
  } catch {
    return bad("Invalid request.");
  }

  // Honeypot filled in: pretend it worked so the bot moves on.
  if (typeof raw.website === "string" && raw.website.trim()) return NextResponse.json({ ok: true });

  const v = {} as Request_;
  for (const k of Object.keys(LIMITS) as Field[]) {
    const s = typeof raw[k] === "string" ? (raw[k] as string).trim() : "";
    v[k] = s.slice(0, LIMITS[k]);
  }
  if (!v.first_name || !v.last_name) return bad("Please enter your first and last name.");
  if (!EMAIL_RE.test(v.email)) return bad("Please enter a valid email address.");

  const id = await store(v);
  const emailed = await notify(v);
  if (id && emailed) await markEmailed(id);

  if (!id && !emailed)
    return bad(`We couldn't submit that just now. Please try again, or email ${CONTACT_EMAIL}.`, 503);
  return NextResponse.json({ ok: true });
}

function admin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && secret ? createClient(url, secret, { auth: { persistSession: false } }) : null;
}

async function store(v: Request_): Promise<string | null> {
  const db = admin();
  if (!db) {
    console.error("request-access: SUPABASE_SERVICE_ROLE_KEY not set; request not stored");
    return null;
  }
  const { data, error } = await db
    .from("demo_requests")
    .insert({
      first_name: v.first_name, last_name: v.last_name, email: v.email,
      phone: v.phone || null, country: v.country || null,
      message: v.message || null, source: v.source || null,
    })
    .select("id")
    .single();
  if (error) {
    console.error("request-access: insert failed", error.message);
    return null;
  }
  return data.id as string;
}

async function markEmailed(id: string) {
  const { error } = await admin()!.from("demo_requests").update({ emailed: true }).eq("id", id);
  if (error) console.error("request-access: could not mark emailed", error.message);
}

async function notify(v: Request_): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;

  const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ");
  const to = (process.env.REQUEST_ACCESS_TO || CONTACT_EMAIL).split(",").map((s) => s.trim()).filter(Boolean);
  const text = [
    `New demo request from the website.`,
    ``,
    `Name:    ${v.first_name} ${v.last_name}`,
    `Email:   ${v.email}`,
    `Phone:   ${v.phone || "—"}`,
    `Country: ${v.country || "—"}`,
    ``,
    `Tell us more about you:`,
    v.message || "—",
    ``,
    `Came from: ${v.source || "direct"}`,
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || "clipworker <onboarding@resend.dev>",
        to,
        reply_to: v.email,
        subject: oneLine(`Demo request: ${v.first_name} ${v.last_name} (${v.email})`),
        text,
      }),
    });
    if (!res.ok) {
      console.error("request-access: email failed", res.status, await res.text());
      return false;
    }
    return true;
  } catch (e) {
    console.error("request-access: email failed", e);
    return false;
  }
}
