import Link from "next/link";
import { notFound } from "next/navigation";
import { presignGet } from "@/lib/r2";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TrimPanel } from "@/components/trim-panel";
import { ArrowLeft, Download } from "lucide-react";

export const metadata = { title: "Clip · clipworker" };

export default async function ClipPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await createClient();

  // RLS scopes this to the caller's workspace, so a clip belonging to another
  // org is simply not found -- there is no ownership check to forget here.
  const { data } = await db
    .from("jobs")
    .select("id, status, result_url, error, notes, created_at, request_json")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();

  const req = (data.request_json ?? {}) as Record<string, unknown>;
  const canvas = (req.canvas as string) || "9:16";
  const playUrl =
    data.status === "done" && data.result_url?.startsWith("storage://")
      ? await presignGet(data.result_url.replace("storage://", ""))
      : null;

  const title = (req.query as string) || "Auto-picked";
  const notes = Array.isArray(data.notes) ? (data.notes as string[]) : [];

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-8">
      <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
        <Link href="/app/clips"><ArrowLeft className="size-4" /> All clips</Link>
      </Button>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">{title}</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {new Date(data.created_at).toLocaleString(undefined,
              { dateStyle: "medium", timeStyle: "short" })}
            {typeof req.source_job_id === "string" && req.source_job_id && (
              <>
                {" · "}
                <Link href={`/app/clips/${req.source_job_id}`} className="text-brand underline">
                  trimmed from another clip
                </Link>
              </>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{canvas}</Badge>
          {playUrl && (
            <Button size="sm" variant="outline" asChild>
              <a href={playUrl} download><Download className="size-4" /> Download</a>
            </Button>
          )}
        </div>
      </div>

      {data.status === "failed" ? (
        <Card>
          <CardContent className="space-y-2 py-6">
            <p className="font-medium">This clip didn&apos;t render.</p>
            <p className="text-muted-foreground text-sm">{data.error ?? "No reason recorded."}</p>
          </CardContent>
        </Card>
      ) : !playUrl ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-sm capitalize">{data.status}…</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Reload in a moment — this page doesn&apos;t update on its own yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <TrimPanel jobId={data.id} canvas={canvas} playUrl={playUrl} />
      )}

      {notes.length > 0 && (
        <details className="text-muted-foreground mt-8 text-xs">
          <summary className="cursor-pointer select-none">Render details</summary>
          <ul className="mt-2 space-y-1">
            {notes.map((n, i) => <li key={i}>{n}</li>)}
          </ul>
        </details>
      )}
    </main>
  );
}
