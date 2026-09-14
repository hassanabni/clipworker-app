import Image from "next/image";

/**
 * Founders & early story — Figma node 2:1674.
 *
 * 12-column grid, 6/6 split, 32px gutter, on the #f5f3ef band. The right card
 * is white with a 16px radius holding a 12px-radius photo and a quote callout
 * in Newsreader italic at 24/33px.
 */
export function CompanyStory() {
  return (
    <section id="story" className="bg-muted px-[48px] py-[96px]">
      <div className="mx-auto grid max-w-[1184px] items-center gap-[32px] lg:grid-cols-12">
        {/* Left: Editorial Narrative — 2:1676 */}
        <div className="flex flex-col items-start gap-[24px] lg:col-span-6">
          <span className="bg-background text-primary flex items-center gap-[8px] rounded-full px-[8px] py-[4px] text-[12px] leading-[16px] font-semibold tracking-[0.24px]">
            <Image src="/figma/icon-spark.svg" alt="" width={9} height={12}
                   className="h-[11.667px] w-[9.333px]" />
            The Autonomous Movement
          </span>

          <h2 className="font-display text-[34px] leading-[1.2] font-normal tracking-[-1.1px] md:text-[44px] md:leading-[55px]">
            Join the video-agent revolution.
          </h2>

          <p className="text-muted-foreground text-[18px] leading-[30px]">
            We kept seeing the same dilemma in every fast-growing enterprise:
            executives, product leads, and people teams record hours of
            all-hands briefings, town halls, and sprint demos — and{" "}
            <em className="text-foreground italic">almost none of it ever gets reused</em>.
          </p>

          <p className="text-muted-foreground text-[16px] leading-[26px]">
            Not because the insights weren&apos;t valuable, but because cutting a
            45-minute recording into four punchy, on-brand clips took three hours
            of agency billables or half a day of Premiere scrubbing. Comms teams
            were exhausted.
          </p>

          <p className="text-muted-foreground text-[16px] leading-[26px]">
            We started clipworker to fix that permanently. By giving every comms
            professional an autonomous video specialist named Mira, we turn raw
            workplace speech into broadcast-ready, branded micro-content in under
            three minutes.
          </p>

          <div className="flex flex-wrap items-center gap-[16px] pt-[8px]">
            <a href="#roles"
               className="flex items-center gap-[8px] rounded-full bg-black px-[16px] py-[8px] text-[14px] leading-[20px] font-semibold tracking-[0.14px] text-white transition-opacity hover:opacity-90">
              See our open roles
              <Image src="/figma/icon-arrow-ur-sm.svg" alt="" width={11} height={11}
                     className="size-[10.667px]" />
            </a>
            <span className="text-muted-foreground flex items-center gap-[12px] text-[12px] leading-[16px] font-semibold tracking-[0.24px]">
              <span className="size-[10px] shrink-0 rounded-full bg-[#10b981]" />
              Co-building with our early access partners
            </span>
          </div>
        </div>

        {/* Right: photo card — 2:1700 */}
        <div className="flex flex-col gap-[16px] rounded-[16px] bg-white p-[16px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] lg:col-span-6">
          <div className="relative overflow-hidden rounded-[12px] bg-[#e4e2de]">
            <div className="relative aspect-[544/408]">
              <Image src="/figma/founders.jpg" alt="Hassan Abni, founder of clipworker"
                     fill sizes="(max-width: 1024px) 100vw, 544px"
                     className="object-cover" />
            </div>
            <div aria-hidden
                 className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.8)] to-transparent" />
            <div className="absolute right-[16px] bottom-[16px] left-[16px]">
              <p className="text-[20px] leading-[28px] font-semibold tracking-[-0.2px] text-white">
                Hassan Abni
              </p>
              <p className="text-[12px] leading-[16px] font-semibold tracking-[0.24px] text-[#e4e2de] opacity-90">
                Founder • Product &amp; Video AI Architecture
              </p>
            </div>
          </div>

          {/* Founder Quote Callout — 2:1710 */}
          <div className="bg-muted flex items-start gap-[8px] rounded-[12px] p-[16px]">
            <Image src="/figma/icon-quote.svg" alt="" width={17} height={12}
                   className="mt-[6px] h-[12px] w-[17px] shrink-0" />
            <p className="font-display text-[19px] leading-[27px] tracking-[-0.24px] italic md:text-[24px] md:leading-[33px]">
              &ldquo;The problem isn&apos;t that companies lack things to say.
              It&apos;s that recordings never get turned into something people
              actually watch.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
