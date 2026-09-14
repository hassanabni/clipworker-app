import Image from "next/image";
import { CONTACT_EMAIL } from "@/lib/contact";

/**
 * Where we actually are — Figma node 2:1824.
 *
 * Three #f5f3ef cards with an uppercase tag chip and a footer line, then the
 * white contact strip (2:1869) underneath.
 */
const CARDS = [
  {
    tag: "Early-stage • founder-led",
    body: "We are deliberately small, agile, and in active co-building mode. When you onboard with clipworker, you don't get routed to a junior tier-1 ticket queue — you work directly with the people who build the product.",
    foot: "Direct founder access",
    icon: { src: "/figma/icon-t1-foot.svg", w: 16, h: 8 },
  },
  {
    tag: "Enterprise privacy architecture",
    body: "We enforce strict multi-tenant workspace isolation at the database layer. Your internal executive briefings and confidential town halls are never used to train public LLMs or external foundation models.",
    foot: "Zero public training guarantee",
    icon: { src: "/figma/icon-t2-foot.svg", w: 10.667, h: 14 },
  },
  {
    tag: "Invite-only, on purpose",
    body: "Rather than opening self-serve registration to thousands of unfocused users, we curate each batch of communications teams carefully. Every early access partner directly influences Mira's roadmap and core agent skills.",
    foot: "Co-designing with our early access partners",
    icon: { src: "/figma/icon-t3-foot.svg", w: 14.673, h: 13.333 },
  },
];

export function CompanyTransparency() {
  return (
    <section className="px-[48px] py-[96px]">
      <div className="mx-auto max-w-[1184px]">
        <div className="mb-[40px] max-w-[672px]">
          <p className="text-primary mb-[6.5px] text-[12px] leading-[16px] font-semibold tracking-[1.2px] uppercase">
            Radical transparency
          </p>
          <h2 className="font-display mb-[16px] text-[34px] leading-[1.2] font-normal tracking-[-1.1px] md:text-[44px] md:leading-[52px]">
            Where we actually are.
          </h2>
          <p className="text-muted-foreground text-[16px] leading-[26px]">
            The exact state of our company, architecture, and roadmap before our
            first conversation. No smoke, no mirrors.
          </p>
        </div>

        <div className="grid gap-[32px] md:grid-cols-3">
          {CARDS.map((c) => (
            <article key={c.tag}
                     className="bg-muted flex flex-col justify-between rounded-[16px] p-[24px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
              <div className="flex flex-col items-start gap-[16px] pt-[4px]">
                <span className="rounded-[4px] bg-[#e4e2de] px-[4px] py-[2px] text-[12px] leading-[16px] font-semibold tracking-[0.24px] uppercase">
                  {c.tag}
                </span>
                <p className="text-[16px] leading-[26px]">{c.body}</p>
              </div>
              <div className="flex items-center gap-[8px] pt-[24px]">
                <Image src={c.icon.src} alt="" width={Math.round(c.icon.w)}
                       height={Math.round(c.icon.h)}
                       style={{ width: c.icon.w, height: c.icon.h }} />
                <span className="text-muted-foreground text-[12px] leading-[16px] font-semibold tracking-[0.24px]">
                  {c.foot}
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Contact strip — 2:1869 */}
        <div className="mt-[40px] flex flex-col items-start justify-between gap-[16px] rounded-[12px] bg-white p-[16px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] sm:flex-row sm:items-center">
          <div className="flex items-center gap-[8px]">
            <span className="grid size-[40px] shrink-0 place-items-center rounded-full bg-[#e1e0ff]">
              <Image src="/figma/icon-help.svg" alt="" width={17} height={17}
                     className="size-[16.667px]" />
            </span>
            <p className="text-muted-foreground text-[14px] leading-[22px]">
              Have questions about our architecture, privacy controls, or company
              status? Speak to us:{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary">
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>
          <a href={`mailto:${CONTACT_EMAIL}`}
             className="shrink-0 rounded-full bg-[#eae8e4] px-[16px] py-[6px] text-[12px] leading-[16px] font-semibold tracking-[0.24px] transition-colors hover:bg-[#e4e2de]">
            Email us ↗
          </a>
        </div>
      </div>
    </section>
  );
}
