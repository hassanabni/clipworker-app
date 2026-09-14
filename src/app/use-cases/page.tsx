import Image from "next/image";
import Link from "next/link";
import {
  MessageSquare, Smartphone, ShieldCheck, Sparkles, Palette,
  Frame, Gauge, RefreshCw, Lock,
} from "lucide-react";
import { SiteNav } from "@/components/marketing/site-nav";
import { SiteFooter } from "@/components/marketing/site-footer";
import { CtaBand, Pill } from "@/components/marketing/kit";
import { USE_CASE_LIST } from "@/lib/use-cases";

export const metadata = {
  title: "Use cases · clipworker",
  description:
    "How comms, HR and marketing teams put Mira to work — from town hall digests to onboarding modules and webinar repurposing.",
};

/**
 * Use cases overview — Figma frame 8:2107 (Main 2:1228).
 *
 * The design's tab switcher shows Internal Comms as the active view. This is a
 * server page, so the tabs are links to the three existing use-case pages with
 * the first shown inline — same shape, and every tab goes somewhere real.
 *
 * Four claims from the mock are corrected, all in the same direction: the
 * design asserts SOC-2 Type II, ISO 27001 and GDPR compliance, plus measured
 * outcome percentages. None of those exist. What is true — workspace isolation
 * enforced in the database, and no customer footage used for training — is
 * stated instead.
 */
const PILLARS = [
  {
    icon: MessageSquare,
    title: "Town Hall & All-Hands Digest",
    body: "Mira identifies key leadership quotes, trims speech pauses and highlights the tactical takeaways. No waiting 48 hours for an agency turnaround.",
  },
  {
    icon: Smartphone,
    title: "Deskless & Frontline Delivery",
    body: "Reframes speakers into 9:16 vertical video with high-contrast burnt-in captions, so plant and retail workers can watch sound-off on mobile.",
  },
  {
    icon: ShieldCheck,
    title: "Walled Data Isolation",
    body: "Confidential communications stay in your workspace — isolation is enforced in the database itself, and your footage is never used to train public models. We hold no certification yet, and don't claim one.",
  },
];

const WHY = [
  { icon: Sparkles, t: "Zero Editing Skills Required",
    d: "Anyone on your comms, HR or marketing team can upload a recording and get a production-ready clip. No Premiere Pro, no timeline." },
  { icon: Palette, t: "Locked Brand Guardrails",
    d: "Font, palette and logo placement are set per workspace and applied automatically. Off-brand clips stop being possible rather than being caught in review." },
  { icon: Frame, t: "Cross-Ratio Native Output",
    d: "Render 9:16 mobile, 1:1 feed, 4:5 portrait and 16:9 monitor from a single upload. Mira crops and tracks speaker framing for each." },
  { icon: Gauge, t: "Velocity",
    d: "About a minute of processing for a ten-minute recording. From the end of an event to a posted clip inside the same hour is realistic." },
  { icon: RefreshCw, t: "Shift-to-Shift Consistency",
    d: "Office staff, remote contractors and night-shift crews get the same message the same way, instead of a briefing re-run four times." },
  { icon: Lock, t: "Workspace-Level Access",
    d: "Owners and admins control who joins and who can change the brand kit; members make clips and see the shared library." },
];

const QUOTES = [
  "With Mira, executive all-hands updates reach the deskless workforce within a couple of hours of the live recording — not the following week.",
  "Mira reduced our onboarding video creation from three weeks to an afternoon. It changed what we bother to make at all.",
  "We repurpose every customer webinar into a week of vertical clips. It is the highest-leverage content work we do.",
];

export default function UseCasesPage() {
  const first = USE_CASE_LIST[0];

  return (
    <>
      <SiteNav />

      {/* Status pill — 2:1230 */}
      <div className="bg-background px-[24px] pt-[104px] text-center">
        <span className="text-muted-foreground inline-flex items-center gap-[8px] text-[13px]">
          <span className="bg-primary size-[6px] rounded-full" />
          <strong className="text-foreground font-semibold">Mira for Enterprise:</strong>
          one agent, every department.
        </span>
      </div>

      {/* Hero — 2:1237 */}
      <section className="relative overflow-hidden px-[24px] pt-[48px] pb-[56px] text-center md:px-[128px]">
        <div aria-hidden
             className="pointer-events-none absolute top-[40px] left-1/2 h-[340px] w-[700px] -translate-x-1/2 rounded-full bg-[#e1e0ff] opacity-40 blur-[70px]" />
        <div className="relative mx-auto max-w-[1024px]">
          <div className="mb-[20px] flex justify-center"><Pill>Built for every department</Pill></div>
          <h1 className="font-display text-[36px] leading-[1.12] font-normal tracking-[-1.2px] text-balance md:text-[52px] md:tracking-[-1.6px]">
            One agent. Every team that has to communicate.
          </h1>
          <p className="text-muted-foreground mx-auto mt-[20px] max-w-[700px] text-[17px] leading-[29px] text-balance md:text-[18px] md:leading-[30px]">
            Comms, HR and Marketing each record different things and answer to
            different people. Mira does the same job for all of them: turn the
            recording into something that gets watched.
          </p>
        </div>
      </section>

      {/* Department tabs — 2:1506 */}
      <div className="flex flex-wrap justify-center gap-[8px] px-[24px] pb-[48px]">
        {USE_CASE_LIST.map((u, i) => (
          <Link key={u.slug} href={`/use-cases/${u.slug}`}
                className={`rounded-full px-[18px] py-[9px] text-[14px] font-semibold transition-colors ${
                  i === 0
                    ? "bg-primary text-white"
                    : "border-border text-muted-foreground border bg-white hover:border-[#c0bfb8]"}`}>
            {u.nav}
          </Link>
        ))}
      </div>

      {/* Active view — 2:1267 */}
      <section className="bg-muted px-[24px] py-[80px] md:px-[48px]">
        <div className="mx-auto max-w-[1184px]">
          <div className="grid items-center gap-[40px] lg:grid-cols-2">
            <div>
              <span className="bg-primary/8 text-primary inline-flex items-center gap-[6px] rounded-[6px] px-[8px] py-[4px] text-[12px] font-semibold">
                Mira for Internal &amp; Executive Comms
              </span>
              <h2 className="font-display mt-[16px] text-[30px] leading-[1.18] font-normal tracking-[-1px] md:text-[40px]">
                Turn 60-minute town halls into high-impact leadership updates
              </h2>
              <p className="text-muted-foreground mt-[16px] text-[16px] leading-[26px]">
                Deskbound and frontline teams rarely watch hour-long recordings.
                Mira ingests the town hall, pinpoints the strategy milestones, and
                delivers short executive summaries you can drop into an intranet
                channel in minutes.
              </p>

              {/* The mock puts 87% / 4.2 min here as measured results. There are
                  no customers to measure, so these describe the product. */}
              <div className="mt-[28px] grid gap-[16px] sm:grid-cols-2">
                {[
                  ["4 ratios", "9:16, 4:5, 1:1 and 16:9 from one upload"],
                  ["~1 minute", "processing for a 10-minute recording"],
                ].map(([big, small]) => (
                  <div key={big} className="border-border rounded-[12px] border bg-white p-[20px]">
                    <p className="text-primary font-display text-[26px] leading-[1.1]">{big}</p>
                    <p className="text-muted-foreground mt-[6px] text-[13px] leading-[20px]">{small}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* SaaS preview — 2:1290 */}
            <div aria-hidden
                 className="overflow-hidden rounded-[16px] bg-[#01201f] p-[12px] shadow-[0px_30px_70px_-15px_rgba(1,32,31,0.35)]">
              <div className="mb-[10px] flex items-center justify-between gap-[8px] px-[4px]">
                <span className="flex items-center gap-[8px]">
                  <span className="size-[8px] rounded-full bg-[#ff5f56]" />
                  <span className="size-[8px] rounded-full bg-[#ffbd2e]" />
                  <span className="size-[8px] rounded-full bg-[#27c93f]" />
                  <span className="ml-[6px] font-mono text-[12px] text-[#6c8988]">
                    Mira · TownHall_Q3_AllHands.mp4
                  </span>
                </span>
                <span className="bg-primary rounded-[6px] px-[8px] py-[3px] text-[11px] font-semibold text-white">
                  Autonomous Processing
                </span>
              </div>

              <div className="relative flex aspect-[16/9] flex-col justify-end overflow-hidden rounded-[12px] p-[16px]">
                <Image src="/figma/townhall.jpg" alt="" fill
                       sizes="(max-width:1024px) 100vw, 560px" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141b2b] via-transparent to-transparent" />
                <div className="relative">
                  <div className="mb-[8px] flex flex-wrap items-center gap-[4px]">
                    <span className="bg-primary rounded-[4px] px-[8px] py-[2px] text-[12px] leading-[16px] font-semibold text-white">
                      Highlight 1 of 3
                    </span>
                    <span className="text-[14px] leading-[22px] text-white">
                      08:14 – 08:59 • &ldquo;FY26 Core Vision&rdquo;
                    </span>
                  </div>
                  <div className="h-[4px] overflow-hidden rounded-full bg-[rgba(228,226,222,0.2)]">
                    <span className="block h-full w-[67%] bg-[#e1e0ff]" />
                  </div>
                </div>
              </div>

              <div className="mt-[10px] flex flex-wrap items-center justify-between gap-[8px] rounded-[10px] bg-[rgba(255,255,255,0.05)] p-[10px]">
                <span className="flex items-start gap-[8px]">
                  <span className="bg-primary mt-[2px] grid size-[22px] shrink-0 place-items-center rounded-full text-[11px] text-white">
                    ✦
                  </span>
                  <span>
                    <span className="block text-[13px] font-semibold text-white">
                      Mira Auto-Cut Complete
                    </span>
                    <span className="block text-[12px] text-[#9ca3af]">
                      3 executive segments • Captions applied • Brand kit matched
                    </span>
                  </span>
                </span>
                <span className="rounded-[6px] bg-[rgba(255,255,255,0.1)] px-[8px] py-[4px] text-[11px] text-white">
                  Ready to share
                </span>
              </div>
            </div>
          </div>

          {/* 3 pillars — 2:1323 */}
          <div className="mt-[56px] grid gap-[24px] md:grid-cols-3">
            {PILLARS.map(({ icon: Icon, title, body }) => (
              <article key={title} className="border-border rounded-[16px] border bg-white p-[24px]">
                <span className="bg-primary/8 text-primary mb-[16px] grid size-[38px] place-items-center rounded-[10px]">
                  <Icon className="size-[18px]" />
                </span>
                <h3 className="mb-[8px] text-[17px] font-semibold tracking-[-0.2px]">{title}</h3>
                <p className="text-muted-foreground text-[14px] leading-[23px]">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Why grid — 2:1348 */}
      <section className="px-[24px] py-[96px] md:px-[48px]">
        <div className="mx-auto max-w-[1184px]">
          <h2 className="font-display mb-[40px] text-center text-[30px] leading-[1.18] font-normal tracking-[-1.1px] md:text-[40px]">
            Why teams choose Mira across every department
          </h2>
          <div className="grid gap-[24px] md:grid-cols-3">
            {WHY.map(({ icon: Icon, t, d }) => (
              <article key={t} className="border-border rounded-[16px] border bg-white p-[24px]">
                <span className="bg-primary/8 text-primary mb-[14px] grid size-[34px] place-items-center rounded-[9px]">
                  <Icon className="size-[16px]" />
                </span>
                <h3 className="mb-[6px] text-[15px] font-semibold">{t}</h3>
                <p className="text-muted-foreground text-[14px] leading-[23px]">{d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Proof — 2:1422 */}
      <section className="bg-muted px-[24px] py-[96px] md:px-[48px]">
        <div className="mx-auto max-w-[1184px]">
          <h2 className="font-display mb-[40px] text-center text-[30px] leading-[1.18] font-normal tracking-[-1.1px] md:text-[40px]">
            What this looks like in practice
          </h2>
          <div className="grid gap-[24px] md:grid-cols-3">
            {QUOTES.map((q, i) => (
              <figure key={q} className="border-border rounded-[16px] border bg-white p-[24px]">
                <blockquote className="text-[15px] leading-[25px]">&ldquo;{q}&rdquo;</blockquote>
                <figcaption className="text-muted-foreground mt-[16px] text-[13px]">
                  {["Internal comms lead", "L&D manager", "Content marketing manager"][i]}
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="text-muted-foreground mt-[20px] text-center text-[12px]">
            Illustrative — describing the workflow Mira replaces, not real
            customers and not attributed to anyone.
          </p>
        </div>
      </section>

      <CtaBand
        headline="Pick the team you're buying for."
        sub={`Start with ${first.nav.toLowerCase()}, or bring a real recording to a 20-minute call and we'll cut it live.`}
      />
      <SiteFooter />
    </>
  );
}
