import Link from "next/link";
import Image from "next/image";
import { CTA_HREF } from "@/lib/cta";

/**
 * Homepage hero — Figma node 2:24.
 *
 * The stage under the copy is a browser-chrome mockup: traffic lights, a
 * clipworker.ai URL pill, a speaker tag, the auto-ratio badge, a play button,
 * a burned-in caption bar and a scrub bar. It is presentational — there is no
 * real recording we are allowed to show — so it is marked aria-hidden rather
 * than pretending to be a video player.
 *
 * Type note: the Figma sets this headline in Inter ExtraBold. The site runs on
 * Plus Jakarta Sans (the shared header and the Company page both use it), so
 * the weight, 70px size and -2.45px tracking are the design's and the family is
 * the site's. See the summary — this is the one place the two Figma pages
 * disagree with each other.
 */
export function HomeHero() {
  return (
    <section className="relative overflow-hidden px-[24px] pt-[160px] pb-[128px] md:px-[128px]">
      {/* The radial wash behind the hero — 2:24's background fill */}
      <div aria-hidden
           className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_45%_at_50%_30%,rgba(99,102,241,0.12)_0%,rgba(79,70,229,0.04)_45%,rgba(79,70,229,0)_70%)]" />

      <div className="relative mx-auto flex max-w-[1024px] flex-col items-center gap-[16px]">
        {/* Top Pill Tag — 2:26 */}
        <div className="flex items-center gap-[8px] rounded-full border border-[#c7d2fe] bg-[rgba(238,234,253,0.8)] px-[17px] py-[7px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
          <span className="size-[6px] shrink-0 rounded-full bg-[#4f46e5]" />
          <span className="text-[12px] leading-[16px] font-semibold tracking-[0.3px] text-[#4f46e5]">
            AI video agent for internal communication
          </span>
        </div>

        {/* Heading 1 — 2:30 */}
        {/* No text-balance: the Figma breaks after "for" and after "Video",
            and balancing re-wraps it into a different shape. */}
        <h1 className="max-w-[896px] pt-[16px] text-center text-[40px] leading-[1.05] font-extrabold tracking-[-1.4px] text-[#030712] sm:text-[54px] md:text-[70px] md:leading-[70px] md:tracking-[-2.45px]">
          Your AI Video Agent for Optimized Video Production
        </h1>

        {/* Subtitle — 2:32 */}
        <p className="max-w-[672px] pt-[8px] text-center text-[18px] leading-[28px] text-[#4b5563] text-balance md:text-[20px]">
          Automate dynamic on-brand clips, executive highlights, and
          cross-platform video summaries with Mira. Faster, smarter, and easier
          than ever before.
        </p>

        {/* Action Buttons — 2:33 */}
        <div className="flex flex-wrap items-center justify-center gap-[14px] pt-[24px]">
          <Link href={CTA_HREF}
             className="flex items-center justify-center gap-[8px] rounded-full bg-[#4f46e5] px-[24px] py-[12px] text-[14px] leading-[20px] font-medium text-white shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] transition-opacity hover:opacity-90">
            Get a demo
            <Image src="/figma/icon-arrow-ur-14.svg" alt="" width={14} height={14}
                   className="size-[14px]" />
          </Link>
          <a href="#mira"
             className="flex items-center justify-center gap-[8px] rounded-full border border-[rgba(229,231,235,0.9)] bg-white px-[25px] py-[13px] text-[14px] leading-[20px] font-medium text-[#1f2937] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-colors hover:bg-[#fafafa]">
            <Image src="/figma/icon-play-14.svg" alt="" width={14} height={14}
                   className="size-[14px]" />
            Watch Mira in action
          </a>
        </div>

        {/* Walkthrough Microcopy — 2:46 */}
        <p className="text-center text-[13px] leading-[16px] tracking-[-0.325px] text-[#9ca3af]">
          20-minute walkthrough. Bring a real recording, see real output.
        </p>

        {/* Hero Video Stage — 2:47 */}
        <div aria-hidden
             className="mt-[16px] w-full max-w-[896px] overflow-hidden rounded-[16px] border border-[rgba(31,41,55,0.9)] bg-[#0f1117] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]">
          <div className="flex items-center justify-between border-b border-[rgba(31,41,55,0.8)] px-[16px] py-[13px]">
            <div className="flex items-center gap-[8px]">
              <span className="size-[12px] rounded-full bg-[#ff5f56]" />
              <span className="size-[12px] rounded-full bg-[#ffbd2e]" />
              <span className="size-[12px] rounded-full bg-[#27c93f]" />
            </div>
            <span className="rounded-[6px] border border-[#27272a] bg-[rgba(24,24,27,0.9)] px-[15px] py-[5px] font-mono text-[12px] leading-[16px] text-[#a1a1aa]">
              clipworker.ai
            </span>
            <span className="w-[56px]" />
          </div>

          <div className="relative aspect-[894/503] bg-[radial-gradient(circle_at_50%_50%,#4338ca_0%,#312a8b_27.5%,#27226b_41%,#1e1b4b_55%,#161531_77%,#0d0f17_100%)]">
            <div className="absolute top-[20px] left-[20px] flex items-center gap-[8px] rounded-full border border-[rgba(255,255,255,0.15)] bg-[rgba(0,0,0,0.6)] px-[15px] py-[7px] backdrop-blur-[6px]">
              <span className="size-[8px] rounded-full bg-[#34d399]" />
              <span className="text-[12px] leading-[16px] font-medium text-white">
                Speaker 1: David (VP Operations)
              </span>
            </div>

            <div className="absolute top-[20px] right-[20px] rounded-full border border-[rgba(129,140,248,0.4)] bg-[rgba(79,70,229,0.9)] px-[13px] py-[5px] backdrop-blur-[6px]">
              <span className="font-mono text-[11px] leading-[16.5px] text-white uppercase">
                Auto-clip • 9:16
              </span>
            </div>

            <div className="absolute inset-0 grid place-items-center">
              <span className="relative grid size-[80px] place-items-center rounded-full bg-[#4f46e5] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]">
                <span className="absolute inset-0 rounded-full bg-[#818cf8] opacity-25" />
                <Image src="/figma/icon-play-32.svg" alt="" width={32} height={32}
                       className="relative size-[32px]" />
              </span>
            </div>

            <div className="absolute right-[24px] bottom-[20px] left-[24px] flex flex-col items-center">
              <p className="max-w-[576px] rounded-[12px] border border-[rgba(255,255,255,0.1)] bg-[rgba(0,0,0,0.8)] px-[32px] py-[11px] text-center text-[14px] leading-[20px] font-medium text-white shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1)] backdrop-blur-[6px]">
                &ldquo;We transformed our 45-minute Q3 briefing into 4 bite-sized
                clips in under 3 minutes.&rdquo;
              </p>
              <div className="flex items-center gap-[8px] pt-[10px]">
                <span className="font-mono text-[11px] leading-[16.5px] text-[#a1a1aa]">01:14</span>
                <span className="h-[4px] w-[180px] overflow-hidden rounded-full bg-[rgba(255,255,255,0.2)] sm:w-[288px]">
                  <span className="block h-full w-[40%] bg-[#6366f1]" />
                </span>
                <span className="font-mono text-[11px] leading-[16.5px] text-[#a1a1aa]">03:20</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
