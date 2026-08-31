import Link from "next/link";
import { presignGet } from "@/lib/r2";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Film, Loader2 } from "lucide-react";

// Everything this user has made. Row Level Security scopes the query, so there
// is deliberately no user_id filter here -- and no way for a mistake in this
// file to show somebody else's clips.
export async function MyClips({ limit = 12, heading = "Your clips", href }:
  { limit?: number; heading?: string; href?: string }) {
  const db = await createClient();
  const { data } = await db
    .from("jobs")
    .select("id, status, result_url, created_at, request_json")
    // Suggest jobs produce a shortlist, not a clip -- they would show here as
    // permanently unplayable cards.
    .neq("request_json->>mode", "suggest")
    .order("created_at", { ascending: false })
    .limit(limit);

  const rows = await Promise.all((data ?? []).map(async (j: any) => ({
    id: j.id as string,
    status: j.status as string,
    query: (j.request_json?.query as string) || "Auto-picked",
    when: new Date(j.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    playUrl: j.status === "done" && j.result_url?.startsWith("storage://")
      ? await presignGet(j.result_url.replace("storage://", "")) : null,
  })));

  return (
    <section className="mt-8">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-lg font-medium">{heading}</h2>
        {href && rows.length > 0 && (
          <Link href={href} className="text-sm text-muted-foreground hover:text-foreground">
            See all →
          </Link>
        )}
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
          <div className="grid size-10 place-items-center rounded-full bg-brand/10 text-brand">
            <Film className="size-5" />
          </div>
          Nothing yet. Upload a video and your clips will collect here.
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3">
          {rows.map((r) => (
            <Card key={r.id}
                  className="overflow-hidden py-0 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand/10">
              <div className="relative grid aspect-[9/16] place-items-center bg-muted">
                {r.playUrl ? (
                  <video src={`${r.playUrl}#t=1`} muted preload="metadata" playsInline
                         className="size-full object-cover" />
                ) : r.status === "failed" ? (
                  <Badge variant="destructive" className="text-[10px]">Failed</Badge>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Loader2 className="size-4 animate-spin text-brand" />
                    <span className="text-[10px] capitalize">{r.status}</span>
                  </div>
                )}
                {r.playUrl && (
                  <Badge className="absolute top-1.5 right-1.5 bg-black/60 text-[10px] text-white backdrop-blur-sm">
                    9:16
                  </Badge>
                )}
              </div>
              <div className="space-y-1.5 p-2.5">
                <div className="truncate text-xs" title={r.query}>{r.query}</div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] text-muted-foreground">{r.when}</span>
                  {r.playUrl && (
                    <a href={r.playUrl} download
                       className="text-[11px] text-brand hover:text-brand/80">Download</a>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
