import { NextResponse } from "next/server";
import { presignPut, NotConfigured } from "@/lib/r2";
import { currentUser } from "@/lib/supabase/server";
import { checkUpload, maxBytesFor } from "@/lib/limits";

// Hands the browser a presigned PUT so the file goes STRAIGHT to R2. Routing a
// 2GB video through the Next server would buffer it in memory and fall over.
export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });

    const { filename, kind, contentType, size } = await req.json();
    if (!filename) return NextResponse.json({ error: "filename required" }, { status: 400 });

    // Validate BEFORE signing. This URL is a write capability for the bucket,
    // so everything the form checks has to be checked again here -- the form is
    // not in the trust boundary.
    const slot = kind ?? "main";
    const declared = Number(size);
    if (!Number.isFinite(declared) || declared <= 0)
      return NextResponse.json(
        { error: "size (in bytes) is required" }, { status: 400 });

    const problem = checkUpload(slot, declared, contentType);
    if (problem) return NextResponse.json({ error: problem }, { status: 413 });

    const safe = String(filename).replace(/[^\w.\-]/g, "_");
    // Keyed by the AUTHENTICATED user id, never anything the client sent, so a
    // caller cannot write into someone else's prefix. The `uploads/` prefix is
    // what the bucket lifecycle rule expires after a day.
    const key = `uploads/${user.id}/${Date.now()}_${kind ?? "asset"}_${safe}`;
    // The signed length is the declared one, already checked against the cap.
    // R2 refuses a body that does not match it, so an oversize upload fails at
    // the storage layer even if the caller never loads our JavaScript.
    const url = await presignPut(key, contentType || "application/octet-stream", declared);
    return NextResponse.json({ key, url, maxBytes: maxBytesFor(slot) });
  } catch (e) {
    if (e instanceof NotConfigured) return NextResponse.json({ error: e.message }, { status: 503 });
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
