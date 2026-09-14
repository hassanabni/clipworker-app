import Image from "next/image";

/**
 * Operating principles — Figma node 2:1714.
 *
 * 2×2 bento of white cards: 40px padding, 16px radius, a Newsreader numeral at
 * 32px in the brand at 40% opacity, a 48px #e1e0ff icon tile, and a footer line
 * in the brand. Card icons are the design's exported glyphs, each kept at the
 * leaf size the Figma specifies (20×18, 22×15, 19.012×20, 21×21) inside the
 * shared 48px tile.
 */
const VALUES = [
  {
    n: "01",
    icon: { src: "/figma/icon-value-1.svg", w: 20, h: 18 },
    title: "We validate before we build.",
    body: "We don't ship complex workflows just because a legacy editing suite has them. We spend hours speaking with real enterprise comms and HR leads, build what they explicitly confirm solves friction, and iterate in days, not quarterly cycles.",
    foot: "Velocity through customer proximity",
    footIcon: { src: "/figma/icon-value-foot.svg", w: 13.334, h: 10.667 },
  },
  {
    n: "02",
    icon: { src: "/figma/icon-value-2.svg", w: 22, h: 15 },
    title: "We're upfront about what's not there yet.",
    body: "If an AI feature isn't production-reliable, we tell you right away. If an enterprise certification is still in audit, we don't stamp it. Trust and intellectual honesty matter infinitely more to us than appearing artificially finished.",
    foot: "Radical product transparency",
    footIcon: { src: "/figma/icon-t2-foot.svg", w: 10.667, h: 14 },
  },
  {
    n: "03",
    icon: { src: "/figma/icon-value-3.svg", w: 19.012, h: 20 },
    title: "We act bravely & move at the pace of evidence.",
    body: "We actively avoid over-planning and analysis paralysis. We make bold technical moves — like autonomous transcription re-framing — and recognize that real breakthroughs come from rapid failure and empirical iteration.",
    foot: "Bias to shipping and learning",
    footIcon: { src: "/figma/icon-t3-foot.svg", w: 14.673, h: 13.333 },
  },
  {
    n: "04",
    icon: { src: "/figma/icon-value-4.svg", w: 21, h: 21 },
    title: "We keep it simple for the people using it.",
    body: "Branding, subtitle presets, and multi-ratio aspect crops should be configured once. Comms specialists should never have to manage keyframes or complex video timelines. Enterprise software should feel like pure craft, not administrative homework.",
    foot: "Configured once, applied forever",
    footIcon: { src: "/figma/icon-t1-foot.svg", w: 16, h: 8 },
  },
];

export function CompanyValues() {
  return (
    <section className="px-[48px] py-[96px]">
      <div className="mx-auto max-w-[1184px]">
        {/* Header — 2:1716 */}
        <div className="mb-[48px] flex flex-col items-start justify-between gap-[16px] md:flex-row md:items-end">
          <div>
            <p className="text-primary mb-[6.5px] text-[12px] leading-[16px] font-semibold tracking-[1.2px] uppercase">
              How we work
            </p>
            <h2 className="font-display text-[34px] leading-[1.2] font-normal tracking-[-1.1px] md:text-[44px] md:leading-[52px]">
              Who we are and how we want to be.
            </h2>
          </div>
          <p className="text-muted-foreground max-w-[448px] text-[16px] leading-[26px]">
            These aren&apos;t aspirational slogans etched on glass doors. They
            are the daily guardrails we use to ship software, debate trade-offs,
            and treat one another.
          </p>
        </div>

        {/* 4 Value Bento Cards — 2:1722 */}
        <div className="grid gap-[32px] md:grid-cols-2">
          {VALUES.map((v) => (
            <article key={v.n}
                     className="flex flex-col justify-between rounded-[16px] bg-white p-[28px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] md:p-[40px]">
              <div className="flex flex-col gap-[8px]">
                <div className="flex items-center justify-between">
                  <span className="font-display text-[32px] leading-[40px] text-[rgba(70,72,212,0.4)]">
                    {v.n}
                  </span>
                  <span className="grid size-[48px] shrink-0 place-items-center rounded-[12px] bg-[#e1e0ff]">
                    <Image src={v.icon.src} alt="" width={Math.round(v.icon.w)}
                           height={Math.round(v.icon.h)}
                           style={{ width: v.icon.w, height: v.icon.h }} />
                  </span>
                </div>
                <h3 className="pt-[16px] text-[20px] leading-[28px] font-semibold tracking-[-0.2px]">
                  {v.title}
                </h3>
                <p className="text-muted-foreground text-[16px] leading-[26px]">{v.body}</p>
              </div>
              <div className="flex items-center gap-[8px] pt-[40px]">
                <Image src={v.footIcon.src} alt="" width={Math.round(v.footIcon.w)}
                       height={Math.round(v.footIcon.h)}
                       style={{ width: v.footIcon.w, height: v.footIcon.h }} />
                <span className="text-primary text-[12px] leading-[16px] font-semibold tracking-[0.24px]">
                  {v.foot}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
