import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-[-160px] -z-10 flex justify-center">
        <div className="h-[480px] w-[900px] rounded-full bg-gradient-to-r from-brand/35 to-brand-2/35 blur-[120px]" />
      </div>

      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 pt-24 pb-20 text-center sm:pt-32 sm:pb-28">
        <Badge variant="outline" className="mb-6 h-auto gap-2 rounded-full border-brand/30 bg-brand/10 px-4 py-1.5 text-brand">
          No timestamps. No scrubbing. Just describe the clip.
        </Badge>

        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          Say what your clip is about.{" "}
          <span className="bg-gradient-to-r from-brand to-brand-2 bg-clip-text text-transparent">
            Get it back ready to post.
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-lg text-muted-foreground text-balance">
          Upload the whole video and describe the moment you want. It finds it,
          crops to the speaker, and burns in captions — in about a minute.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Button size="lg" variant="gradient" asChild>
            <Link href="/login">Create your first clip</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="#how">See how it works</a>
          </Button>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          3 clips free · No card required
        </p>
      </div>
    </section>
  );
}
