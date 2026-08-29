import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ClipForm } from "@/components/clip-form";
import { MyClips } from "@/components/my-clips";
import { Button } from "@/components/ui/button";

// The auth guard is in layout.tsx, so this page only fetches what it renders.
export default async function Page() {
  const db = await createClient();
  const { data: quota } = await db.rpc("my_clip_quota").single();

  return (
    <>
      <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b bg-background/80 px-8 py-3.5 backdrop-blur">
        <div>
          <h1 className="font-medium">New clip</h1>
          <p className="text-xs text-muted-foreground">
            Upload a video and say what the moment should be about.
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/app/clips">My clips</Link>
        </Button>
      </header>
      <div className="mx-auto max-w-2xl px-8 py-8">
        <ClipForm used={(quota as any)?.used ?? 0} allowed={(quota as any)?.allowed ?? 3} />
        <MyClips limit={6} heading="Recent" href="/app/clips" />
      </div>
    </>
  );
}
