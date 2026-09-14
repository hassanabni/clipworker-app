import { createClient } from "@/lib/supabase/server";

/** The workspace a signed-in user belongs to. One org per user, for now. */
export type Org = { id: string; name: string; slug: string };

/**
 * Resolve the caller's org, or null if they have none.
 *
 * Read from `orgs`, NOT from `org_members`. That is the whole point of this
 * function and it is worth being explicit about, because the obvious version is
 * wrong in a way that only shows up later:
 *
 *   db.from("org_members").select("orgs(...)").maybeSingle()
 *
 * The RLS policy on org_members is `org_id = my_org_id()` -- it scopes reads to
 * the caller's WORKSPACE, not to the caller's own membership row. In a
 * single-member org that is the same thing, so the query worked for as long as
 * every org had exactly one person in it. The moment a workspace gained a second
 * member it returned two rows, maybeSingle() failed with "more than one row",
 * and the whole app told the newly invited user "No workspace yet".
 *
 * `orgs` has the policy `id = my_org_id()`, which can match at most one row by
 * construction. So this cannot regress as teams grow.
 *
 * Null is a real state, not just an error case: a user can exist without a
 * membership if they were created outside the provisioning flow (an old B2C
 * signup, or a `provisioned_emails` row that was missing when they first signed
 * in). Callers must handle it -- letting it through means the user hits a raw
 * NOT NULL violation from the database on their first upload instead.
 */
export async function getOrg(): Promise<Org | null> {
  const db = await createClient();
  const { data } = await db
    .from("orgs")
    .select("id, name, slug")
    .maybeSingle();

  return (data as Org | null) ?? null;
}
