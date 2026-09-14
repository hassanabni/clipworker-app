import { createClient } from "@/lib/supabase/server";
import { ClipForm } from "@/components/clip-form";

export const metadata = { title: "New clip · clipworker" };

// The auth guard is in layout.tsx, so this page only fetches what it renders.
// The page heading and the "My clips" link both moved into the shell -- the
// breadcrumb names the page and the rail links the library, so repeating either
// here would be two of the same control on one screen.
export default async function Page() {
  const db = await createClient();
  const { data: quota } = await db.rpc("my_clip_quota").single();

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">New clip</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Upload a video and say what the moment should be about.
        </p>
      </header>
      <ClipForm used={(quota as any)?.used ?? 0} allowed={(quota as any)?.allowed ?? 3} />
    </main>
  );
}
