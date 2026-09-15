import Link from "next/link";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { CTA_HREF } from "@/lib/cta";

/**
 * FAQ (2:1948) and the closing CTA (2:1981).
 *
 * The accordion is the project's shadcn Accordion rather than a hand-rolled
 * <details>, restyled to the design's white 16px card with 24px padding — it
 * already has the keyboard and ARIA behaviour the Figma's static frame can't
 * show.
 */
const FAQS = [
  {
    q: "What is your work culture like as a distributed startup?",
    a: "We are an asynchronous-first team. We minimize real-time meetings in favour of crisp written memos, recorded walkthroughs, and written discussion. Everyone has dedicated uninterrupted blocks for deep work, and we make a point of getting together in person to build and plan.",
  },
  {
    q: "How do equity and compensation work for early employees?",
    a: "The founding sales hire is a meaningful equity position, because joining before there is a repeatable sales motion is a real risk and should be paid for as one. Cash and equity are both open to conversation — tell us what would make the move work for you and we'll have an honest discussion rather than sending a take-it-or-leave-it band.",
  },
  {
    q: "Can I apply even if my exact role isn't listed?",
    a: "Yes. We only advertise roles we're genuinely hiring for, which is why the list is short. If you can see something you'd own that we haven't thought of, write to us and say what it is — speculative applications get read properly.",
  },
  {
    q: "What does the interview process look like?",
    a: "A first conversation with the founder, then a practical working session on a real problem from our pipeline rather than a whiteboard puzzle, then a conversation about scope and terms. We aim to give a decision within a week, and we tell you where you stand at each step.",
  },
];

export function CompanyFaq() {
  return (
    <section className="px-[48px] py-[96px]">
      <div className="mx-auto max-w-[896px]">
        <div className="mb-[40px] text-center">
          <p className="text-primary mb-[6.5px] text-[12px] leading-[16px] font-semibold tracking-[0.6px] uppercase">
            Answers &amp; clarity
          </p>
          <h2 className="font-display text-[34px] leading-[1.2] font-normal tracking-[-1.1px] md:text-[44px] md:leading-[52px]">
            Frequently asked questions.
          </h2>
        </div>

        <Accordion type="single" collapsible defaultValue={FAQS[0].q}
                   className="flex flex-col gap-[8px]">
          {FAQS.map((f) => (
            <AccordionItem key={f.q} value={f.q}
                           className="rounded-[16px] border-0 bg-white px-[24px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
              <AccordionTrigger className="py-[24px] text-left text-[18px] leading-[26px] font-semibold tracking-[-0.2px] hover:no-underline md:text-[20px] md:leading-[28px]">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-[24px] text-[16px] leading-[26px]">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export function CompanyCta() {
  return (
    <section className="px-[48px] pt-[96px] pb-[128px]">
      <div className="relative mx-auto max-w-[1184px] overflow-hidden rounded-[24px] bg-white px-[24px] py-[96px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
        {/* Subtle Glow Refraction — 2:1983 */}
        <div aria-hidden
             className="pointer-events-none absolute inset-x-0 top-[-40px] mx-auto h-[320px] w-[900px] bg-gradient-to-b from-[rgba(225,224,255,0.35)] to-transparent blur-[60px]" />

        <div className="relative mx-auto flex max-w-[656px] flex-col items-center gap-[14px] text-center">
          <span className="bg-primary size-[12px] rounded-full" />
          <h2 className="font-display text-[38px] leading-[1.14] font-normal tracking-[-1.5px] md:text-[60px] md:leading-[68px]">
            We&apos;d rather show you than pitch you.
          </h2>
          <p className="text-muted-foreground max-w-[576px] text-[18px] leading-[30px] text-balance">
            Bring a real 20-minute company recording to an introductory call and
            watch Mira extract publish-ready, branded highlights in real time.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-[16px] pt-[26px]">
            <Link href={CTA_HREF}
               className="bg-primary rounded-full px-[40px] py-[16px] text-[14px] leading-[20px] font-semibold tracking-[0.14px] text-white drop-shadow-[0px_4px_12px_rgba(70,72,212,0.35)] transition-opacity hover:opacity-90">
              Request access ↗
            </Link>
            <a href="#roles"
               className="rounded-full bg-[#eae8e4] px-[40px] py-[16px] text-[14px] leading-[20px] font-semibold tracking-[0.14px] transition-colors hover:bg-[#e4e2de]">
              Explore careers
            </a>
          </div>

          <p className="text-subtle pt-[2px] text-[12px] leading-[16px] font-semibold tracking-[0.24px]">
            No credit card required • 20-minute live session • Full privacy protections
          </p>
        </div>
      </div>
    </section>
  );
}
