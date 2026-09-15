import Link from "next/link";
import { ArrowUpRight, Play } from "lucide-react";
import { CTA_HREF, CTA_LABEL } from "@/lib/cta";

/**
 * The hero, ported from the redesign.
 *
 * Two deliberate departures from the design file, both about not claiming
 * things that are not true yet:
 *
 * - The design's headline is "Your AI Video AgentS" (plural) and the section
 *   below it sells three agents. One exists. Singular here.
 * - The design's second button is "Watch demo" against a video that does not
 *   exist. Offering a play button that plays nothing is worse than not
 *   offering it, so it points at the how-it-works section instead.
 */
export function Hero() {
  return (
    <section className="bg-background px-6 pt-32 pb-16 text-center">
      <div className="mx-auto max-w-3xl">
        <span className="border-primary/15 bg-primary/8 text-primary mb-5 inline-flex rounded-full border px-3 py-1 text-xs font-semibold">
          AI video agent for internal communication
        </span>

        <h1 className="font-display mb-5 text-4xl leading-[1.08] font-normal tracking-[-1.1px] md:text-6xl md:tracking-[-1.5px]">
          Your AI Video Agent, Built for Modern Comms Teams
        </h1>

        <p className="text-muted-foreground mx-auto mb-8 max-w-xl text-base leading-relaxed md:text-lg">
          Deliver clear, consistent internal communication at scale — from the
          recordings you are already making.
        </p>

        <div className="mb-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href={CTA_HREF}
             className="bg-primary flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#4d43b8]">
            {CTA_LABEL} <ArrowUpRight className="size-4" />
          </Link>
          <a href="#how"
             className="border-border text-foreground flex items-center gap-2 rounded-full border bg-white px-6 py-3 text-sm font-medium transition-colors hover:border-[#c0bfb8]">
            <Play className="text-primary fill-primary size-4" />
            See how it works
          </a>
        </div>

        <p className="text-xs text-[#bbb]">
          20-minute walkthrough. Bring a real recording, see real output.
        </p>
      </div>

      <div className="relative mx-auto mt-12 max-w-4xl">
        <div className="border-border relative aspect-video overflow-hidden rounded-2xl border shadow-lg">
          {/* A gradient stands in for footage. There is no customer recording we
              are allowed to show, and a stock video of strangers in an office
              would be pretending otherwise. */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,#5b4fcf,transparent_55%),radial-gradient(circle_at_75%_70%,#8b5cf6,transparent_55%)] bg-[#1a1a1a]" />

          <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 backdrop-blur-sm">
            <span className="size-2 animate-pulse rounded-full bg-red-400" />
            <span className="text-xs font-medium text-white">Speaker 1</span>
          </div>

          <div className="absolute inset-0 grid place-items-center">
            <span className="grid size-16 place-items-center rounded-full border border-white/30 bg-white/20 backdrop-blur-sm">
              <Play className="ml-0.5 size-6 fill-white text-white" />
            </span>
          </div>

          <div className="bg-primary absolute right-4 bottom-4 rounded-full px-3 py-1.5">
            <span className="text-xs font-semibold text-white">Auto-clip · 9:16</span>
          </div>
        </div>
      </div>
    </section>
  );
}
