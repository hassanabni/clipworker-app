import Image from "next/image";
import { Play, Sparkles } from "lucide-react";
import { CTA_HREF } from "@/lib/cta";

/**
 * Product hero — Figma nodes 2:689 / 2:718.
 *
 * Newsreader display headline, then the "Mira Studio" stage: macOS chrome, a
 * still from a town hall, the live auto-crop bounding box with a synced
 * subtitle, HUD chips and a scrubber. Decorative, so aria-hidden.
 *
 * One line of the design's microcopy is changed. It reads "Connects to Zoom,
 * Teams & Google Drive" — there are no integrations, you upload a file. The
 * claim is replaced with what is actually true of setup.
 */
export function ProductHero() {
  return (
    <section className="relative overflow-hidden px-[24px] pt-[152px] pb-[80px] md:px-[48px]">
      <div aria-hidden
           className="pointer-events-none absolute -top-[80px] left-1/2 size-[520px] -translate-x-1/2 rounded-full bg-[#e1e0ff] opacity-40 blur-[60px]" />

      <div className="relative mx-auto max-w-[1184px]">
        <div className="mx-auto flex max-w-[900px] flex-col items-center text-center">
          <span className="border-border mb-[24px] inline-flex items-center gap-[6px] rounded-full border bg-white px-[14px] py-[6px] text-[13px] font-semibold shadow-sm">
            <Sparkles className="text-primary size-[14px]" />
            Meet Mira · Autonomous Video Agent
          </span>

          <h1 className="font-display text-[38px] leading-[1.1] font-normal tracking-[-1.2px] text-balance md:text-[56px] md:tracking-[-1.7px]">
            Mira, Your AI Agent for High-Impact Comms Videos
          </h1>

          <p className="text-muted-foreground mt-[20px] max-w-[720px] text-[17px] leading-[28px] text-balance md:text-[18px] md:leading-[30px]">
            Mira transforms hour-long town halls, briefings, and interviews into
            short, engaging clips designed to be watched — completely on
            autopilot.
          </p>

          <div className="mt-[28px] flex flex-wrap items-center justify-center gap-[12px]">
            <a href={CTA_HREF}
               className="bg-primary flex items-center gap-[8px] rounded-full px-[24px] py-[11px] text-[14px] font-semibold text-white shadow-sm transition-opacity hover:opacity-90">
              Get a demo 🎬
            </a>
            <a href="#capabilities"
               className="border-border flex items-center gap-[8px] rounded-full border bg-white px-[24px] py-[11px] text-[14px] font-semibold shadow-sm transition-colors hover:bg-[#f5f3ef]">
              <Play className="text-primary fill-primary size-[14px]" />
              Watch Mira create clips
            </a>
          </div>

          <p className="mt-[14px] text-[13px] text-[#9ca3af]">
            20-minute setup. Zero editing software required. Upload a recording
            and download finished MP4s.
          </p>
        </div>

        {/* HERO SHOWCASE VIDEO PLAYER UI — 2:718 */}
        <div aria-hidden
             className="mt-[48px] overflow-hidden rounded-[12px] bg-[#01201f] shadow-[0px_30px_70px_-15px_rgba(1,32,31,0.35)]">
          <div className="flex h-[44px] items-center justify-between bg-[#091515] px-[16px]">
            <div className="flex items-center gap-[8px]">
              <span className="size-[12px] rounded-full bg-[#ff5f56]" />
              <span className="size-[12px] rounded-full bg-[#ffbd2e]" />
              <span className="size-[12px] rounded-full bg-[#27c93f]" />
              <span className="pl-[16px] text-[12px] font-semibold tracking-[0.24px] text-[#6c8988]">
                Mira Studio · Live Pipeline #8492
              </span>
            </div>
            <span className="flex items-center gap-[4px] rounded-full bg-[rgba(255,255,255,0.1)] px-[8px] py-[2px]">
              <span className="bg-primary size-[8px] rounded-full" />
              <span className="text-[12px] font-semibold tracking-[0.24px] text-white">
                Autopilot: Active
              </span>
            </span>
          </div>

          <div className="relative flex h-[420px] flex-col justify-between overflow-hidden p-[24px] md:h-[500px]">
            <Image src="/figma/mira-stage.jpg" alt="" fill priority
                   sizes="(max-width: 1184px) 100vw, 1184px"
                   className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.95)] via-[rgba(0,0,0,0.3)] to-transparent" />

            {/* Live Auto-Crop Bounding Box — 2:732 */}
            <div className="absolute top-[86px] bottom-[64px] left-1/2 flex w-[240px] -translate-x-1/2 flex-col justify-between rounded-[8px] bg-[rgba(225,224,255,0.1)] p-[8px] shadow-[0px_0px_0px_2px_rgba(96,99,238,0.7)] backdrop-blur-[0.5px] md:w-[288px]">
              <div className="flex items-center justify-between">
                <span className="bg-primary rounded-[4px] px-[4px] py-[2px] text-[10px] leading-[16px] font-semibold tracking-[0.24px] text-white">
                  FACIAL LOCK 60FPS
                </span>
                <Image src="/figma/icon-crop-corner.svg" alt="" width={12} height={12}
                       className="size-[12px]" />
              </div>
              <div className="rounded-[4px] bg-[rgba(0,0,0,0.8)] px-[8px] py-[8px] text-center backdrop-blur-[6px]">
                <p className="text-[12px] leading-[16px] font-semibold tracking-[0.24px] text-white">
                  &ldquo;…we unlocked{" "}
                  <span className="bg-primary rounded-[4px] px-[4px]">14x speed</span>{" "}
                  without adding head-count.&rdquo;
                </p>
              </div>
            </div>

            {/* Top Stage HUD — 2:745 */}
            <div className="relative flex items-start justify-between gap-[8px]">
              <div className="flex flex-col items-start gap-[4px]">
                <span className="flex items-center gap-[4px] rounded-[4px] bg-[rgba(0,0,0,0.8)] px-[8px] py-[4px] backdrop-blur-[6px]">
                  <Image src="/figma/icon-speaker.svg" alt="" width={13} height={13}
                         className="size-[13.333px]" />
                  <span className="text-[12px] leading-[16px] font-semibold tracking-[0.24px] text-white">
                    Speaker 1: Dr. Elena Vance (SVP Comms)
                  </span>
                </span>
                <span className="hidden items-center gap-[4px] rounded-[4px] bg-[#e1e0ff] px-[8px] py-[4px] sm:flex">
                  <Image src="/figma/icon-bolt-sm.svg" alt="" width={11} height={13}
                         className="h-[13.333px] w-[10.667px]" />
                  <span className="text-[12px] leading-[16px] font-semibold tracking-[0.24px] text-[#07006c]">
                    Highlight identified: &lsquo;Q3 Global Expansion Strategy&rsquo; (98% Relevance)
                  </span>
                </span>
              </div>
              <span className="shrink-0 rounded-full bg-[rgba(255,255,255,0.2)] px-[8px] py-[4px] text-[12px] leading-[16px] font-semibold tracking-[0.24px] whitespace-nowrap text-white backdrop-blur-[6px]">
                Framing: 9:16 Auto-Locked
              </span>
            </div>

            {/* Scrubber — 2:760 */}
            <div className="relative flex flex-col gap-[4px]">
              <div className="flex h-[6px] overflow-hidden rounded-full bg-[rgba(255,255,255,0.2)]">
                <span className="bg-primary h-full w-[40%]" />
                <span className="h-full w-[20%] bg-[#e1e0ff]" />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-[8px] pt-[4px]">
                <div className="flex items-center gap-[16px]">
                  <span className="bg-primary grid size-[32px] place-items-center rounded-full">
                    <Image src="/figma/icon-play-sm.svg" alt="" width={9} height={11}
                           className="h-[10.5px] w-[8.25px]" />
                  </span>
                  <span className="text-[12px] font-semibold tracking-[0.24px] text-white">
                    01:14 / 03:20
                  </span>
                  <span className="hidden text-[12px] font-semibold tracking-[0.24px] text-[#6c8988] sm:block">
                    • Auto-generated chapters (4 found)
                  </span>
                </div>
                <div className="flex items-center gap-[8px]">
                  <span className="rounded-[4px] bg-[rgba(16,185,129,0.2)] px-[4px] py-[2px] text-[11px] leading-[16px] font-semibold tracking-[0.24px] text-[#6ee7b7]">
                    Workspace-isolated
                  </span>
                  <Image src="/figma/icon-settings-sm.svg" alt="" width={14} height={14}
                         className="size-[13.5px]" />
                  <Image src="/figma/icon-expand-sm.svg" alt="" width={14} height={14}
                         className="size-[13.5px]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
