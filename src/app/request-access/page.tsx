import { SiteNav } from "@/components/marketing/site-nav";
import { SiteFooter } from "@/components/marketing/site-footer";
import { RequestAccessForm } from "@/components/marketing/request-access-form";

export const metadata = {
  title: "Book a demo · clipworker",
  description:
    "Book a live demo of Mira, clipworker's AI video agent, and see it turn one of your recordings into on-brand clips.",
};

/**
 * Where every "Request access" and "Get a demo" button lands.
 *
 * Layout follows the reference the user supplied: pitch on a dark ground on
 * the left, a white form card on the right. Submissions go to
 * /api/request-access, which stores them and emails the team.
 */
export default function RequestAccessPage() {
  return (
    <>
      <SiteNav />

      <section className="relative mt-[80px] overflow-hidden bg-[linear-gradient(135deg,#0b1120_0%,#141b2b_45%,#232a66_100%)] px-[24px] py-[64px] md:px-[48px] md:py-[96px]">
        <div aria-hidden className="bg-primary pointer-events-none absolute -right-[120px] -bottom-[160px] size-[520px] rounded-full opacity-30 blur-[80px]" />
        <div aria-hidden className="pointer-events-none absolute -top-[120px] -left-[120px] size-[420px] rounded-full bg-[#e1e0ff] opacity-10 blur-[80px]" />

        <div className="relative mx-auto grid max-w-[1184px] items-start gap-[48px] lg:grid-cols-[minmax(0,1fr)_minmax(0,540px)] lg:gap-[64px]">
          <div className="flex flex-col items-start text-white lg:pt-[24px]">
            <span className="mb-[24px] flex items-center gap-[6px] rounded-full bg-[rgba(70,72,212,0.3)] px-[10px] py-[4px] text-[12px] leading-[16px] font-semibold tracking-[0.24px] text-[#e1e0ff]">
              <span className="size-[6px] rounded-full bg-[#e1e0ff]" />
              Now onboarding early access teams
            </span>

            <h1 className="font-display text-[44px] leading-[1.08] font-normal tracking-[-1.2px] md:text-[64px] md:leading-[70px] md:tracking-[-1.8px]">
              Book a live demo of Mira
            </h1>

            <p className="mt-[28px] max-w-[520px] text-[18px] leading-[30px] text-[#c6c6cd]">
              See firsthand how fast <strong className="font-semibold text-white">an AI video agent</strong> can
              turn your team&apos;s recordings into clips people actually watch.
            </p>

            <p className="mt-[28px] text-[18px] leading-[30px] text-[#c6c6cd]">In this session, you will:</p>
            <ul className="mt-[12px] flex max-w-[520px] list-disc flex-col gap-[10px] pl-[22px] text-[17px] leading-[28px] text-[#c6c6cd] marker:text-[#8f91f0]">
              <li>
                Watch Mira turn <strong className="font-semibold text-white">one of your own recordings</strong> into
                finished, captioned clips.
              </li>
              <li>
                Set up <strong className="font-semibold text-white">your brand kit</strong> — logo, fonts and colours
                applied to every clip.
              </li>
              <li>
                Get a <strong className="font-semibold text-white">clear plan</strong> for how your comms, HR or
                marketing team would put Mira to work.
              </li>
            </ul>

            <p className="mt-[40px] text-[17px] leading-[28px] font-semibold text-white">
              Tell us a little about you and we&apos;ll be in touch to schedule it.
            </p>
          </div>

          <RequestAccessForm />
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
