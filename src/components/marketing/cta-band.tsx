import { Button } from "@/components/ui/button";
import { CTA_HREF, CTA_LABEL } from "@/lib/cta";

export function CtaBand() {
  return (
    <section className="relative overflow-hidden border-y border-border/60">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 flex -translate-y-1/2 justify-center">
        <div className="h-[300px] w-[700px] rounded-full bg-gradient-to-r from-brand/25 to-brand-2/25 blur-[120px]" />
      </div>

      <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 px-6 py-20 text-center">
        <h2 className="font-display text-3xl font-normal tracking-[-1.1px] sm:text-4xl">
          Try it on your own footage.
        </h2>
        <p className="text-muted-foreground">
          We set your workspace up with you, and configure your brand kit before
          your first clip.
        </p>
        <Button size="lg" variant="gradient" asChild>
          <a href={CTA_HREF}>{CTA_LABEL}</a>
        </Button>
      </div>
    </section>
  );
}
