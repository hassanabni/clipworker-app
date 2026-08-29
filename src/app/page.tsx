import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
        Say what your clip is about.{" "}
        <span className="text-muted-foreground">Get it back ready to post.</span>
      </h1>
      <p className="max-w-md text-muted-foreground">
        Upload the whole video and describe the moment you want. It finds it,
        crops to the speaker, and burns in captions.
      </p>
      <Button asChild size="lg"><Link href="/login">Get started</Link></Button>
    </main>
  );
}
