import { loadClips } from "@/components/my-clips";
import { ClipsGallery } from "@/components/clips-gallery";

export const metadata = { title: "Clips · clipworker" };

export default async function Page() {
  const clips = await loadClips(60);

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">My clips</h1>
        <p className="text-muted-foreground mt-1 text-sm">Links stay live for 30 days.</p>
      </header>
      <ClipsGallery clips={clips} />
    </main>
  );
}
