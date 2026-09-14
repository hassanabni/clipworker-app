import Link from "next/link";
import { presignGet } from "@/lib/r2";
import { createClient } from "@/lib/supabase/server";
import { ClipCard, type ClipRow } from "@/components/clip-card";
import { ClipsEmpty } from "@/components/clips-empty";

/**
 * Load the workspace's clips. Row Level Security scopes the query to the
 * caller's org, so there is deliberately no user_id filter here -- and no way
 * for a mistake in this file to show another workspace's clips.
 */
export async function loadClips(limit: number): Promise<ClipRow[]> {
  const db = await createClient();
  const { data } = await db
    .from("jobs")
    .select("id, status, result_url, created_at, request_json")
    // Suggest jobs produce a shortlist, not a clip -- they would show here as
    // permanently unplayable cards.
    // A render job carries no "mode" key at all, so request_json->>'mode' is NULL
    // for it -- and `neq` becomes `<> 'suggest'`, which evaluates to NULL, not
    // TRUE. SQL keeps only rows where a WHERE clause is TRUE, so this filter was
    // silently excluding EVERY clip. Measured on the real database: 0 rows
    // returned where 13 exist. Has to test for the null explicitly.
    .or("request_json->>mode.is.null,request_json->>mode.neq.suggest")
    .order("created_at", { ascending: false })
    .limit(limit);

  type Row = {
    id: string; status: string; result_url: string | null; created_at: string;
    request_json: Record<string, unknown> | null;
  };
  return Promise.all(((data ?? []) as Row[]).map(async (j) => ({
    id: j.id,
    status: j.status,
    query: (j.request_json?.query as string) || "Auto-picked",
    // Read from the job, never assumed: the card shows which shape it is.
    canvas: (j.request_json?.canvas as string) || "9:16",
    isTrim: Boolean(j.request_json?.source_job_id),
    when: new Date(j.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    playUrl: j.status === "done" && j.result_url?.startsWith("storage://")
      ? await presignGet(j.result_url.replace("storage://", "")) : null,
  })));
}

/** The "Recent clips" strip on the dashboard. */
export async function MyClips({ limit = 12, heading = "Recent clips", href }:
  { limit?: number; heading?: string; href?: string }) {
  const rows = await loadClips(limit);

  return (
    <section>
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-base font-semibold">{heading}</h2>
        {href && rows.length > 0 && (
          <Link href={href} className="text-muted-foreground hover:text-foreground text-sm">
            See all →
          </Link>
        )}
      </div>

      {rows.length === 0 ? (
        <ClipsEmpty />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((r) => <ClipCard key={r.id} clip={r} />)}
        </div>
      )}
    </section>
  );
}
