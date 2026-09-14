import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { currentUser } from "@/lib/supabase/server";
import { MyClips } from "@/components/my-clips";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Film, TrendingUp, Zap } from "lucide-react";

export const metadata = { title: "Home · clipworker" };

/** What my_clip_quota() returns. Typed here so the dashboard does not need `any`. */
type Quota = { used: number; allowed: number };

/**
 * Kept out of the component body on purpose: reading the clock is impure, and
 * React's lint rules (rightly) object to it happening during a render. Here it
 * is an ordinary function the data fetch calls.
 */
function weekAgoIso(): string {
  return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
}

/**
 * The dashboard.
 *
 * New page, but no new data: every number on it already existed somewhere in
 * the app. `used` and `allowed` are the same my_clip_quota() the sidebar reads,
 * and "this week" is counted from the jobs the gallery already lists. Nothing
 * here reaches for anything the product did not already know.
 */
export default async function Page() {
  const db = await createClient();
  const [{ data: quota }, user] = await Promise.all([
    db.rpc("my_clip_quota").single(),
    currentUser(),
  ]);

  const { count: thisWeek } = await db
    .from("jobs")
    .select("id", { count: "exact", head: true })
    .gte("created_at", weekAgoIso());

  const q = quota as Quota | null;
  const used = q?.used ?? 0;
  const allowed = q?.allowed ?? 3;
  const left = Math.max(allowed - used, 0);

  const hour = new Date().getHours();
  const partOfDay = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  const name = (user?.email?.split("@")[0] ?? "")
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const stats = [
    { icon: Film, label: "Clips generated", value: used, sub: `of ${allowed} this month`,
      tint: "bg-primary/10 text-primary" },
    { icon: TrendingUp, label: "This week", value: thisWeek ?? 0, sub: "clips created",
      tint: "bg-emerald-500/10 text-emerald-600" },
    { icon: Zap, label: "Credits left", value: left, sub: "clips remaining",
      tint: "bg-amber-500/10 text-amber-600" },
  ];

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">
          Good {partOfDay}{name ? `, ${name}` : ""} 👋
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Here&apos;s what&apos;s happening with your clips today.
        </p>
      </header>

      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        {stats.map(({ icon: Icon, label, value, sub, tint }) => (
          <Card key={label}>
            <CardContent className="p-5">
              <div className={`mb-3 grid size-8 place-items-center rounded-lg ${tint}`}>
                <Icon className="size-4" />
              </div>
              <div className="text-3xl font-semibold tabular-nums">{value}</div>
              <div className="mt-1 text-sm font-medium">{label}</div>
              <div className="text-muted-foreground text-xs">{sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="from-brand to-brand-2 mb-8 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-gradient-to-r p-6">
        <div className="text-white">
          <div className="font-semibold">Ready to create your next clip?</div>
          <p className="text-sm text-white/80">
            Upload a video and let AI find the best moments.
          </p>
        </div>
        <Link href="/app/new"
              className="text-primary flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90">
          <Plus className="size-4" />
          New clip
        </Link>
      </div>

      <MyClips limit={3} heading="Recent clips" href="/app/clips" />

      <Card className="mt-8">
        <CardContent className="p-6">
          <div className="mb-4 text-sm font-medium">Get the most out of clipworker</div>
          <ol className="grid gap-5 sm:grid-cols-3">
            {[
              ["Set your brand kit", "Upload your logo and pick caption styles once."],
              ["Upload a long video", "Interviews, podcasts and webinars work best."],
              ["Share or download", "Links are live for 30 days. Download as MP4."],
            ].map(([title, body], i) => (
              <li key={title} className="flex gap-3">
                <span className="bg-muted text-muted-foreground grid size-5 shrink-0 place-items-center rounded text-[11px] font-semibold">
                  {i + 1}
                </span>
                <div>
                  <div className="text-sm font-medium">{title}</div>
                  <p className="text-muted-foreground mt-0.5 text-xs">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </main>
  );
}
