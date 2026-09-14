import { NextResponse } from "next/server";
import { createClient, currentUser } from "@/lib/supabase/server";

/**
 * Cancel a job that is queued or still rendering.
 *
 * The real check lives inside public.cancel_job: it is SECURITY DEFINER and
 * matches on org_id = my_org_id(), so an id from another workspace simply does
 * not match. `jobs` has no UPDATE policy on purpose -- an open one would let a
 * member rewrite request_json on a queued row -- which is why this goes through
 * a function granting one narrow power rather than a table write.
 */
export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });

  const { id } = await req.json();
  if (!id || typeof id !== "string")
    return NextResponse.json({ error: "id required" }, { status: 400 });

  const db = await createClient();
  const { data, error } = await db.rpc("cancel_job", { p_id: id });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data)
    return NextResponse.json(
      { error: "That job has already finished, or isn't yours to cancel." },
      { status: 409 });

  return NextResponse.json({ cancelled: true });
}
