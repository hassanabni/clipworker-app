import Image from "next/image";
import { SiteNav } from "@/components/marketing/site-nav";
import { SiteFooter } from "@/components/marketing/site-footer";
import { DepartmentSections } from "@/components/marketing/usecases/departments";
import { CTA_HREF } from "@/lib/cta";
import { CONTACT_EMAIL } from "@/lib/contact";

export const metadata = {
  title: "Use cases · clipworker",
  description:
    "How comms, HR and marketing teams put Mira to work — from town hall digests to onboarding modules and webinar repurposing.",
};

/**
 * Use Cases — Figma frame 8:2107 (Main 2:1228).
 *
 * Section order as designed: announce bar, hero, sticky department bar, why
 * grid, proof, CTA. The one deliberate change: all three departments are laid
 * out on this page one after another, and the sticky bar jumps between them,
 * instead of tabs hiding two of them. /use-cases/<slug> redirects here.
 *
 * Claims corrected from the mock (see the summary for the full list):
 *  - "Mira v3.2 … Enterprise Ready" — no such version exists; early access.
 *  - Why card 6 "GDPR & SOC-2 Security … RBAC and audit trails" — none held or
 *    built; workspace isolation and owner/admin roles are.
 *  - "Over 300+ enterprise teams rely on Mira daily" — removed.
 *  - Named testimonials (Simone Teufel at Accenture, Franziska Dahl at
 *    Montblanc, Mimi Carlotta Rietzel at TUI) — real people at real companies,
 *    none of them customers. Role and department only, labelled illustrative.
 *  - CTA chips "Enterprise SOC-2 certified" and "Unlimited team seats" —
 *    replaced; pricing and seats are undecided.
 */

const WHY = [
  { label: "01 // SKILL INDEPENDENCE", icon: { src: "/figma/icon-w1.svg", w: 15.75, h: 12.75 },
    title: "Zero Editing Skills Required",
    body: "Anyone on your comms, HR, or marketing team can upload a recording and get production-ready videos. No Premiere Pro or After Effects required." },
  { label: "02 // BRAND COMPLIANCE", icon: { src: "/figma/icon-w2.svg", w: 16.5, h: 15.75 },
    title: "Locked Brand Guardrails",
    body: "Fonts, palettes, and logo placement are set once per workspace and applied to every clip. Off-brand fonts and colours never make it into a render." },
  { label: "03 // ADAPTABILITY", icon: { src: "/figma/icon-w3.svg", w: 15, h: 12 },
    title: "Cross-Ratio Native Output",
    body: "Render in 9:16 mobile, 1:1 feed, 4:5 portrait, and 16:9 monitor view. Mira crops and tracks speaker framing with zero pixel distortion." },
  { label: "04 // SPEED", icon: { src: "/figma/icon-w4.svg", w: 12, h: 15 },
    title: "Same-Day Turnaround",
    body: "From event conclusion to a ready-to-post clip in minutes. Keep cadence with fast-moving organizational pivots without agency delays." },
  { label: "05 // ALIGNMENT", icon: { src: "/figma/icon-w5.svg", w: 15, h: 13.5 },
    title: "Shift-to-Shift Consistency",
    body: "Deliver uniform key messaging to office workers, remote contractors, and graveyard warehouse shifts at exactly the same time in matching quality." },
  { label: "06 // TRUST & PRIVACY", icon: { src: "/figma/icon-w6.svg", w: 12, h: 15 },
    title: "Walled Workspace Isolation",
    body: "Every clip belongs to your workspace, and that isolation is enforced in the database itself. Owners and admins control who joins and who can change the brand kit." },
];

const PROOF = [
  { dept: "Internal Comms", role: "Head of Corporate Comms", org: "Multi-site manufacturer",
    quote: "Our all-hands updates need to reach the deskless workforce the same day — not a week after the live recording." },
  { dept: "HR & People", role: "VP People & Culture", org: "Healthcare network",
    quote: "Onboarding videos take us weeks. If that became an afternoon, it would change what we bother to make at all." },
  { dept: "Brand Marketing", role: "Global Content Director", org: "Logistics group",
    quote: "Every customer webinar should become a week of vertical clips. Right now most of them just sit in a folder." },
];

const briefingHref =
  `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Architecture briefing — clipworker")}`;

export default function UseCasesPage() {
  return (
    <>
      <SiteNav />

      {/* Status & Announce Pill — 2:1230 */}
      <div className="bg-muted mt-[80px] px-[24px] py-[8px] md:px-[48px]">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-center gap-[8px]">
          <span className="flex items-center gap-[6px] rounded-full bg-[#e1e0ff] px-[4px] py-[2px] text-[12px] leading-[16px] font-semibold tracking-[0.24px] text-[#07006c]">
            <span className="bg-primary size-[6px] rounded-full" />
            Unified Platform
          </span>
          <p className="text-center text-[14px] leading-[22px]">
            <strong className="font-bold">Mira for Enterprise:</strong>
            <span className="text-muted-foreground">
              {" "}One autonomous video agent across Internal Comms, HR, and Marketing. Ready on autopilot.
            </span>
          </p>
        </div>
      </div>

      {/* Hero Header — 2:1237 */}
      <section className="bg-background relative overflow-hidden px-[24px] py-[96px] md:px-[128px]">
        <div aria-hidden
             className="pointer-events-none absolute top-[40px] left-1/2 h-[340px] w-[700px] -translate-x-1/2 rounded-full bg-[rgba(225,224,255,0.4)] blur-[60px]" />
        <div className="relative mx-auto flex max-w-[1024px] flex-col items-center text-center">
          <span className="mb-[16px] flex items-center gap-[4px] rounded-full bg-[#eae8e4] px-[8px] py-[4px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
            <span className="bg-primary grid size-[16px] place-items-center rounded-full">
              <Image src="/figma/icon-uc-badge.svg" alt="" width={11} height={11} className="size-[11px]" />
            </span>
            <span className="text-muted-foreground text-[12px] leading-[16px] font-semibold tracking-[0.24px]">
              Clipworker Use Cases • Powered by Mira
            </span>
          </span>

          <h1 className="font-display max-w-[896px] text-[40px] leading-[1.13] font-normal tracking-[-1px] md:text-[60px] md:leading-[68px] md:tracking-[-1.5px]">
            One Autonomous AI Agent. Infinite Ways Your Organization Communicates.
          </h1>

          <p className="text-muted-foreground mt-[16px] max-w-[672px] text-[18px] leading-[30px] text-balance">
            Mira turns raw town halls, HR briefings, and marketing webinars into
            short, high-retention clips tailored for every department — on-brand,
            captioned, and formatted automatically.
          </p>

          <div className="mt-[40px] flex flex-wrap items-center justify-center gap-[16px]">
            <a href={CTA_HREF}
               className="bg-primary rounded-full px-[24px] py-[8px] text-[14px] leading-[20px] font-semibold tracking-[0.14px] text-white shadow-[0px_10px_15px_-3px_rgba(70,72,212,0.2),0px_4px_6px_-4px_rgba(70,72,212,0.2)] transition-opacity hover:opacity-90">
              Get a demo ↗
            </a>
            <a href="/product"
               className="rounded-full bg-[#efeeea] px-[24px] py-[8px] text-[14px] leading-[20px] font-semibold tracking-[0.14px] transition-colors hover:bg-[#e4e2de]">
              Explore Mira&apos;s Capabilities
            </a>
          </div>

          <span className="mt-[40px] flex items-center gap-[8px] rounded-full bg-white py-[4px] pr-[4px] pl-[16px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
            <span className="bg-primary size-[8px] rounded-full" />
            <span className="text-muted-foreground text-[12px] leading-[16px] font-semibold tracking-[0.24px]">
              Active Agent: <span className="text-foreground font-normal">Mira · Autonomous Comms Specialist</span>
            </span>
            <span className="rounded-full bg-[#eae8e4] px-[4px] py-[2px] text-[12px] leading-[16px] font-semibold tracking-[0.24px]">
              Early Access
            </span>
          </span>
        </div>
      </section>

      <DepartmentSections />

      {/* Why Teams Choose Mira — 2:1348 */}
      <section className="bg-muted py-[96px]">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-[64px] px-[24px] md:px-[48px]">
          <div className="flex max-w-[768px] flex-col gap-[8px] text-center">
            <h2 className="font-display text-[34px] leading-[1.18] font-normal tracking-[-0.66px] md:text-[44px] md:leading-[52px]">
              Why Organizations Standardize on Mira
            </h2>
            <p className="text-muted-foreground text-[18px] leading-[30px]">
              Replacing fragmented video tools with a single autonomous agent that
              understands your company voice, security policies, and brand
              standards.
            </p>
          </div>
          <div className="grid w-full gap-[32px] md:grid-cols-3">
            {WHY.map((w) => (
              <article key={w.title}
                       className="flex flex-col gap-[4px] rounded-[16px] bg-white p-[24px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
                <div className="flex items-center gap-[8px]">
                  <span className="grid size-[32px] shrink-0 place-items-center rounded-full bg-[#e1e0ff]">
                    <Image src={w.icon.src} alt="" width={Math.round(w.icon.w)} height={Math.round(w.icon.h)}
                           style={{ width: w.icon.w, height: w.icon.h }} />
                  </span>
                  <span className="font-mono text-[12px] leading-[16px] font-bold tracking-[0.24px] text-[#c6c6cd]">
                    {w.label}
                  </span>
                </div>
                <h3 className="pt-[12px] text-[20px] leading-[28px] font-semibold tracking-[-0.2px]">{w.title}</h3>
                <p className="text-muted-foreground text-[14px] leading-[22px]">{w.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Departmental Proof — 2:1422 */}
      <section className="bg-background py-[96px]">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-[64px] px-[24px] md:px-[48px]">
          <div className="flex flex-col items-start justify-between gap-[12px] md:flex-row md:items-end">
            <div className="flex flex-col gap-[6.5px] pt-[5.5px]">
              <p className="text-primary text-[12px] leading-[16px] font-semibold tracking-[0.6px] uppercase">
                Enterprise Evidence
              </p>
              <h2 className="font-display text-[34px] leading-[1.18] font-normal tracking-[-0.66px] md:text-[44px] md:leading-[52px]">
                What Comms Leaders Are After
              </h2>
            </div>
            <p className="text-muted-foreground text-[14px] leading-[20px] font-semibold tracking-[0.14px]">
              Illustrative quotes from early access conversations
            </p>
          </div>
          <div className="grid gap-[32px] md:grid-cols-3">
            {PROOF.map((p) => (
              <figure key={p.dept}
                      className="flex flex-col justify-between rounded-[16px] bg-white p-[24px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
                <div className="flex flex-col items-start gap-[9px] pt-[4px]">
                  <span className="rounded-[4px] bg-[#efeeea] px-[4px] py-[1.5px] text-[12px] leading-[16px] font-semibold tracking-[0.24px] text-muted-foreground">
                    {p.dept}
                  </span>
                  <blockquote className="font-display text-[22px] leading-[33px] tracking-[-0.24px] italic md:text-[24px] md:leading-[36px]">
                    &ldquo;{p.quote}&rdquo;
                  </blockquote>
                </div>
                <figcaption className="pt-[32px]">
                  <span className="block text-[14px] leading-[20px] font-semibold tracking-[0.14px]">{p.role}</span>
                  <span className="text-muted-foreground block text-[14px] leading-[22px]">{p.org}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA — 2:1471 */}
      <section className="bg-background px-[24px] pb-[96px] md:px-[48px]">
        <div className="relative mx-auto max-w-[1184px] overflow-hidden rounded-[24px] bg-[#141b2b] px-[24px] py-[96px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] md:px-[80px] lg:px-[208px]">
          <div aria-hidden className="bg-primary pointer-events-none absolute -top-[96px] -right-[96px] size-[384px] rounded-full opacity-30 blur-[50px]" />
          <div aria-hidden className="pointer-events-none absolute -bottom-[96px] -left-[96px] size-[384px] rounded-full bg-[#e1e0ff] opacity-20 blur-[50px]" />
          <div className="relative mx-auto flex max-w-[768px] flex-col items-center text-center">
            <span className="flex items-center gap-[4px] rounded-full bg-[rgba(70,72,212,0.3)] px-[8px] py-[4px] text-[12px] leading-[16px] font-semibold tracking-[0.24px] text-[#e1e0ff]">
              <span className="size-[8px] rounded-full bg-[#e1e0ff]" />
              Now Onboarding Early Access Teams
            </span>
            <h2 className="font-display pt-[16px] text-[38px] leading-[1.13] font-normal tracking-[-1.2px] text-white md:text-[60px] md:leading-[68px]">
              Ready to Put Mira to Work Across Your Organization?
            </h2>
            <p className="max-w-[576px] pt-[16px] text-[18px] leading-[30px] text-[#c6c6cd]">
              Upload your next recording and watch Mira generate your first
              department-tailored clips in minutes.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-[16px] pt-[32px]">
              <a href={CTA_HREF}
                 className="bg-primary rounded-full px-[40px] py-[8px] text-[14px] leading-[20px] font-semibold tracking-[0.14px] text-white shadow-[0px_10px_15px_-3px_rgba(70,72,212,0.3)] transition-opacity hover:opacity-90">
                Request Access with Mira ↗
              </a>
              <a href={briefingHref}
                 className="rounded-full bg-[rgba(228,226,222,0.2)] px-[24px] py-[8px] text-[14px] leading-[20px] font-semibold tracking-[0.14px] text-white transition-colors hover:bg-[rgba(228,226,222,0.3)]">
                Schedule Architecture Briefing
              </a>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-[24px] pt-[32px]">
              {["Zero prompt engineering", "Workspace-isolated data", "Invite your whole team"].map((c) => (
                <span key={c} className="flex items-center gap-[6px] text-[12px] leading-[16px] font-semibold tracking-[0.24px] text-[#c6c6cd]">
                  <Image src="/figma/icon-check-c.svg" alt="" width={13} height={13} className="size-[13.333px]" />
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
