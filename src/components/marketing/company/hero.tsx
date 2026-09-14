import Image from "next/image";

/**
 * Company hero — Figma node 2:1633.
 *
 * Measurements are the design's: 60/68px Newsreader headline at -1.5px
 * tracking, 896px copy column, 64px gap to the banner, 16px banner radius, the
 * two ambient glows behind it.
 *
 * The glows are absolutely positioned like the design, but the section clips
 * them (`overflow-hidden`): in Figma the canvas has no viewport, so a -128px
 * top offset is harmless there and would otherwise give the real page a
 * horizontal scrollbar.
 */
export function CompanyHero() {
  return (
    <section className="relative overflow-hidden pt-[160px] pb-[96px]">
      {/* Ambient Radial Glows — 2:1634 */}
      <div aria-hidden
           className="pointer-events-none absolute top-[-128px] left-1/2 h-[360px] w-[720px] -translate-x-1/2 bg-gradient-to-b from-[rgba(225,224,255,0.4)] via-[rgba(96,99,238,0.1)] to-[rgba(96,99,238,0)] blur-[32px]" />
      {/* Overlay+Blur — 2:1635 */}
      <div aria-hidden
           className="pointer-events-none absolute top-[192px] right-[40px] size-[384px] bg-[rgba(201,233,230,0.2)] blur-[60px]" />

      <div className="relative mx-auto flex max-w-[1280px] flex-col items-center gap-[64px] px-[48px]">
        <div className="flex w-full max-w-[896px] flex-col items-center">
          {/* Badge Chip — 2:1639 */}
          <div className="mb-[24px] flex items-center gap-[8px] rounded-full bg-[#eae8e4] px-[16px] py-[6px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
            <span className="bg-primary size-[8px] shrink-0 rounded-full" />
            <span className="text-[12px] leading-[16px] font-semibold tracking-[0.6px] uppercase">
              About clipworker • Building the future of work video
            </span>
          </div>

          {/* Heading 1 — 2:1644 */}
          <h1 className="font-display text-center text-[40px] leading-[1.14] font-normal tracking-[-1px] text-balance sm:text-[52px] md:text-[60px] md:leading-[68px] md:tracking-[-1.5px]">
            Making it easy for every team to turn what they record into what
            people <em className="italic">actually watch</em>.
          </h1>

          {/* Subheadline — 2:1647 */}
          <p className="text-muted-foreground mt-[24px] max-w-[672px] text-center text-[18px] leading-[30px] text-balance">
            We are an ambitious, early-stage distributed team building{" "}
            <span className="text-foreground">Mira</span> — the autonomous AI
            video agent eliminating editing bottlenecks for modern comms,
            executive presence, and people teams.
          </p>

          {/* CTA Cluster — 2:1649 */}
          <div className="mt-[40px] flex flex-wrap items-center justify-center gap-[16px]">
            <a href="#roles"
               className="bg-primary flex items-center gap-[4px] rounded-full px-[24px] py-[8px] text-[14px] leading-[20px] font-semibold tracking-[0.14px] text-white drop-shadow-[0px_4px_10px_rgba(70,72,212,0.28)] transition-opacity hover:opacity-90">
              See open positions
              <Image src="/figma/icon-arrow-up-right.svg" alt="" width={11} height={11}
                     className="size-[11.25px]" />
            </a>
            <a href="#story"
               className="flex items-center gap-[4px] rounded-full bg-white px-[24px] py-[8px] text-[14px] leading-[20px] font-semibold tracking-[0.14px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-colors hover:bg-[#f5f3ef]">
              Read our founding story
              <Image src="/figma/icon-arrow-down.svg" alt="" width={12} height={12}
                     className="size-[12px]" />
            </a>
          </div>
        </div>

        {/* Hero banner — 2:1660 */}
        <div className="relative w-full overflow-hidden rounded-[16px] bg-[#e4e2de] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]">
          <div className="relative aspect-[1184/507]">
            <Image src="/figma/hero-team.jpg" alt="The clipworker team" fill priority
                   sizes="(max-width: 1280px) 100vw, 1184px"
                   className="object-cover" />
          </div>
          {/* Ambient Scrim — 2:1662 */}
          <div aria-hidden
               className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.8)] via-[rgba(0,0,0,0.2)] to-transparent" />

          {/* Floating status chips — 2:1663 */}
          <div className="absolute bottom-[32px] left-[32px] flex flex-wrap items-center gap-[8px]">
            <span className="flex items-center gap-[8px] rounded-full bg-[rgba(251,249,245,0.9)] px-[16px] py-[6px] text-[12px] leading-[16px] font-semibold tracking-[0.24px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] backdrop-blur-[6px]">
              <span className="size-[8px] shrink-0 rounded-full bg-[#10b981]" />
              100% remote • async-first
            </span>
            <span className="hidden rounded-full bg-[rgba(255,255,255,0.8)] px-[16px] py-[6px] text-[12px] leading-[16px] font-semibold tracking-[0.24px] backdrop-blur-[6px] sm:block">
              Building Mira with our early access partners
            </span>
          </div>

          <div className="absolute right-[32px] bottom-[32px]">
            <span className="rounded-full bg-[rgba(0,0,0,0.6)] px-[16px] py-[6px] text-[12px] leading-[16px] font-semibold tracking-[0.24px] text-white backdrop-blur-[6px]">
              clipworker™ • Early access
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
