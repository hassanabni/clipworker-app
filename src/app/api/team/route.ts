import { NextResponse } from "next/server";
import { createClient, currentUser } from "@/lib/supabase/server";
import { getOrg } from "@/lib/org";

/**
 * The workspace's people: who is in it, who has been invited, and the two
 * operations that change that.
 *
 * Every rule lives in the SECURITY DEFINER functions in sql/invites.sql, not
 * here. That is deliberate and it is the same argument the quota triggers make:
 * anyone holding a session can call PostgREST directly and never touch this
 * handler, so a check that only exists in TypeScript is not a check. What this
 * file adds is translation -- the functions raise bare codes, and a person
 * needs a sentence.
 */
const REFUSALS: Record<string, string> = {
  not_an_admin: "Only an owner or admin can change who's in the workspace.",
  owner_only: "Only an owner can do that.",
  already_a_member: "They're already in this workspace.",
  email_in_another_workspace:
    "That address already belongs to another workspace. Each account can be in " +
    "one workspace, so they'd need to be removed from that one first.",
  bad_email: "That doesn't look like an email address.",
  bad_role: "Pick a valid role.",
  cannot_remove_yourself: "You can't remove yourself.",
  last_owner: "A workspace needs at least one owner. Make someone else an owner first.",
  user_has_no_org: "Your account isn't attached to a workspace yet.",
};

/** Map a Postgres error onto a sentence, or fall through to a generic one. */
function refusal(message: string): { text: string; known: boolean } {
  const hit = Object.keys(REFUSALS).find((code) => message.includes(code));
  return hit
    ? { text: REFUSALS[hit], known: true }
    : { text: message, known: false };
}

type Member = {
  user_id: string | null;
  email: string;
  role: string;
  joined: boolean;
  created_at: string;
};

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });
  const org = await getOrg();
  if (!org) return NextResponse.json({ error: "no workspace" }, { status: 403 });

  const db = await createClient();
  const [{ data: people, error }, { data: role }] = await Promise.all([
    db.rpc("team_list"),
    db.rpc("my_org_role"),
  ]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    org,
    myRole: (role as string) ?? "member",
    myUserId: user.id,
    people: (people ?? []) as Member[],
  });
}

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });

  const { email, role = "member" } = (await req.json()) ?? {};
  if (!email || typeof email !== "string")
    return NextResponse.json({ error: "Enter an email address." }, { status: 400 });

  const db = await createClient();
  const { data, error } = await db.rpc("invite_member", {
    p_email: email,
    p_role: role,
  });

  if (error) {
    const { text, known } = refusal(error.message);
    return NextResponse.json({ error: text }, { status: known ? 403 : 500 });
  }
  // "attached" means the account already existed and is now a member; "invited"
  // means the row is waiting for them to sign up. The UI says different things.
  return NextResponse.json({ result: data as string });
}

export async function DELETE(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });

  const { email, userId } = (await req.json()) ?? {};
  const db = await createClient();

  // A joined member is removed by id, an unredeemed invitation by address --
  // the invitation has no user id yet, which is exactly what makes it pending.
  const { error } = userId
    ? await db.rpc("remove_member", { p_user: userId })
    : await db.rpc("revoke_invite", { p_email: email });

  if (error) {
    const { text, known } = refusal(error.message);
    return NextResponse.json({ error: text }, { status: known ? 403 : 500 });
  }
  return NextResponse.json({ ok: true });
}
