import Image from "next/image";
import { Check, CircleCheck } from "lucide-react";
import { CTA_HREF } from "@/lib/cta";
import { ProductSpotlight } from "@/components/marketing/product/spotlight";

export { ProductSpotlight };

/**
 * Product page body — Figma nodes 2:780, 2:845, 2:970, 2:1034, 2:1083, 2:1107.
 *
 * Layout, type and spacing are the design's. Copy is the design's except where
 * it describes something that is not built or states a measured result there
 * are no customers to have produced; each correction is noted beside it.
 */

const EYEBROW = "text-primary text-[12px] leading-[16px] font-semibold tracking-[1.2px] uppercase";
const H2 = "font-display text-[34px] leading-[1.18] font-normal tracking-[-0.66px] md:text-[44px] md:leading-[52px]";

/* ── CHALLENGE — 2:780 ─────────────────────────────────────────────── */
export function ProductChallenge() {
  return (
    <section className="px-[24px] py-[96px] md:px-[48px]">
      <div className="mx-auto flex max-w-[1184px] flex-col gap-[64px]">
        <div className="flex max-w-[672px] flex-col gap-[6.5px] pt-[5.5px]">
          <p className={EYEBROW}>The internal comms bottleneck</p>
          <h2 className={H2}>Video Demands Are Rising, Yet Your Resources Stay the Same…</h2>
        </div>

        <div className="grid gap-[32px] md:grid-cols-3">
          {/* Card 1 — 2:787 */}
          <article className="flex flex-col justify-between rounded-[12px] bg-white p-[32px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] lg:p-[40px]">
            <div className="flex flex-col gap-[8px]">
              <span className="grid size-[48px] place-items-center rounded-[8px] bg-[#efeeea]">
                <Image src="/figma/icon-ch-devices.svg" alt="" width={23} height={19}
                       className="h-[18.667px] w-[23.333px]" />
              </span>
              <h3 className="pt-[16px] text-[20px] leading-[28px] font-semibold tracking-[-0.2px]">Multichannel Challenge</h3>
              <p className="text-muted-foreground text-[16px] leading-[26px]">
                Every distribution channel expects its own layout: 9:16 for Slack
                mobile &amp; Teams mobile, 1:1 for intranet feeds, and 16:9 for
                SharePoint embeds. Manual re-editing takes hours per clip.
              </p>
            </div>
            <div aria-hidden className="bg-muted mt-[40px] flex items-center justify-between rounded-[8px] p-[16px]">
              <span className="text-primary grid h-[40px] w-[24px] place-items-center rounded-[4px] bg-[rgba(70,72,212,0.2)] text-[9px]">9:16</span>
              <span className="text-primary grid size-[32px] place-items-center rounded-[4px] bg-[rgba(70,72,212,0.2)] text-[9px]">1:1</span>
              <span className="text-primary grid h-[28px] w-[48px] place-items-center rounded-[4px] bg-[rgba(70,72,212,0.2)] text-[9px]">16:9</span>
            </div>
          </article>

          {/* Card 2 — 2:805 */}
          <article className="flex flex-col justify-between rounded-[12px] bg-white p-[32px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] lg:p-[40px]">
            <div className="flex flex-col gap-[8px]">
              <span className="grid size-[48px] place-items-center rounded-[8px] bg-[#efeeea]">
                <Image src="/figma/icon-ch-clock.svg" alt="" width={23} height={23} className="size-[23.333px]" />
              </span>
              <h3 className="pt-[16px] text-[20px] leading-[28px] font-semibold tracking-[-0.2px]">Velocity Pressure</h3>
              <p className="text-muted-foreground text-[16px] leading-[26px]">
                Strategic announcements lose relevance within 24 hours. Waiting
                days for external video agencies or overstretched internal
                creatives completely kills communication momentum.
              </p>
            </div>
            {/* "Agency turnaround: 4 days / Mira: 90 seconds" — the Mira side
                is stated as what processing actually takes. */}
            <div aria-hidden className="bg-muted mt-[40px] flex items-center justify-between gap-[12px] rounded-[8px] p-[16px] text-[12px] leading-[16px] tracking-[0.24px]">
              <span className="text-muted-foreground font-semibold">Agency turnaround: <b className="font-black">days</b></span>
              <span className="text-primary font-semibold">Mira: <b className="font-black">minutes</b></span>
            </div>
          </article>

          {/* Card 3 — 2:827 */}
          <article className="flex flex-col justify-between rounded-[12px] bg-white p-[32px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] lg:p-[40px]">
            <div className="flex flex-col gap-[8px]">
              <span className="grid size-[48px] place-items-center rounded-[8px] bg-[#efeeea]">
                <Image src="/figma/icon-ch-trend.svg" alt="" width={23} height={14} className="h-[14px] w-[23.333px]" />
              </span>
              <h3 className="pt-[16px] text-[20px] leading-[28px] font-semibold tracking-[-0.2px]">Engagement Hurdle</h3>
              {/* "Only … micro-briefings achieve above 80% completion" is an
                  unsourced figure; the argument stands without it. */}
              <p className="text-muted-foreground text-[16px] leading-[26px]">
                Employees skip 60-minute unedited town hall recordings. Short,
                high-energy, captioned micro-briefings are the format remote and
                frontline workforces actually finish.
              </p>
            </div>
            {/* "Raw Zoom video 12% watched / Mira clip 88%" are invented
                percentages; the tile compares length instead. */}
            <div aria-hidden className="bg-muted mt-[40px] flex items-center justify-between gap-[8px] rounded-[8px] p-[16px] text-[12px] leading-[16px] font-semibold tracking-[0.24px]">
              <span className="text-muted-foreground">Raw recording<br />video</span>
              <span className="text-[#ba1a1a]">60 min<br />to sit through</span>
              <span className="text-primary">Mira clip:<br />45 sec</span>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ── CORE CAPABILITIES — 2:845 (dark) ──────────────────────────────── */
function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-primary inline-flex w-fit rounded-full px-[8px] py-[3px] text-[12px] leading-[16px] font-semibold tracking-[0.24px] text-white">
      {children}
    </span>
  );
}

export function ProductCapabilities() {
  return (
    <section id="capabilities" className="bg-black px-[24px] py-[96px] md:px-[48px]">
      <div className="mx-auto max-w-[1184px]">
        <div className="mx-auto mb-[80px] flex max-w-[768px] flex-col items-center gap-[8px] text-center">
          <p className="text-[12px] leading-[16px] font-semibold tracking-[1.2px] text-[#e1e0ff] uppercase">
            Autonomous intelligence
          </p>
          <h2 className="font-display text-[34px] leading-[1.18] font-normal tracking-[-0.66px] text-white md:text-[44px] md:leading-[52px]">
            Mira Is Your Digital Video Specialist that Delivers Human Results
          </h2>
          <p className="text-[18px] leading-[30px] text-[#6c8988]">
            Built precisely for corporate comms, executive presence, and people
            teams who cannot compromise on brand dignity.
          </p>
        </div>

        <div className="flex flex-col gap-[96px]">
          {/* Feature 1 — 2:853 */}
          <div className="grid items-center gap-[48px] lg:grid-cols-[5fr_7fr]">
            <div className="flex flex-col gap-[16px]">
              <Pill>Interviews &amp; Town Halls</Pill>
              <h3 className="font-display text-[28px] leading-[1.25] font-normal text-white md:text-[32px] md:leading-[40px]">
                Transforming long recordings into punchy, high-retention clips
              </h3>
              <p className="text-[16px] leading-[26px] text-[#6c8988]">
                Whether it&apos;s an hour-long executive interview or an all-hands
                recording, Mira reads the full transcript, isolates
                high-conviction insights, and trims natural pauses automatically.
              </p>
              {/* The design's bullets (applause detection, stutter removal,
                  one-tap quote cards) describe features that are not built;
                  these are the three the pipeline actually does. */}
              <ul className="flex flex-col gap-[8px] pt-[8px]">
                {[
                  "Ranks moments by meaning across the whole transcript",
                  "Tightens the cut by dropping hedging and restatement",
                  "Up to five distinct highlight reels from one upload",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-[8px] text-[14px] leading-[20px] text-white">
                    <Check className="mt-[2px] size-[14px] shrink-0" /> {b}
                  </li>
                ))}
              </ul>
            </div>

            <div aria-hidden className="rounded-[12px] bg-[rgba(255,255,255,0.05)] p-[24px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]">
              <div className="relative flex h-[320px] flex-col justify-end overflow-hidden rounded-[8px] p-[16px] md:h-[384px]">
                <Image src="/figma/cap-1.jpg" alt="" fill sizes="(max-width:1024px) 100vw, 660px" className="object-cover" />
                <div className="absolute top-[16px] left-[16px] flex max-w-[320px] flex-col gap-[4px] rounded-[8px] bg-[rgba(0,0,0,0.9)] p-[16px] backdrop-blur-[6px]">
                  <span className="flex items-center gap-[4px]">
                    <Image src="/figma/icon-quote-sm.svg" alt="" width={13} height={13} className="size-[12.833px]" />
                    <span className="text-[12px] leading-[16px] font-semibold tracking-[0.24px] text-[#e1e0ff]">Key Quotable Isolated</span>
                  </span>
                  <p className="text-[14px] leading-[22px] text-white">
                    &ldquo;Our employees don&apos;t want longer memos; they want
                    authentic 60-second answers directly from leadership.&rdquo;
                  </p>
                </div>
                <div className="relative flex items-center justify-between gap-[8px] rounded-[8px] bg-[rgba(0,0,0,0.8)] p-[8px] backdrop-blur-[6px]">
                  <span className="flex items-center gap-[8px]">
                    <span className="size-[12px] rounded-full bg-[#34d399]" />
                    <span className="text-[12px] leading-[16px] font-semibold tracking-[0.24px] text-white">
                      Extracted Clip #2: &lsquo;Authentic Answers&rsquo;
                    </span>
                  </span>
                  <span className="text-[12px] leading-[16px] font-semibold tracking-[0.24px] text-[#e1e0ff]">0:52 • 98% Match</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 — 2:893, reversed */}
          <div className="grid items-center gap-[48px] lg:grid-cols-[7fr_5fr]">
            <div aria-hidden className="order-2 rounded-[12px] bg-[rgba(255,255,255,0.05)] p-[24px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] lg:order-1">
              <div className="grid gap-[16px] sm:grid-cols-2">
                <div className="flex h-[288px] flex-col justify-between rounded-[8px] bg-[rgba(255,255,255,0.1)] p-[16px]">
                  <div className="flex flex-col gap-[4px] pt-[5.5px]">
                    <p className="text-[12px] leading-[16px] font-semibold tracking-[0.24px] text-[#e1e0ff]">Enforced Typography</p>
                    <p className="font-display pt-[6.5px] text-[32px] leading-[32px] text-white">Newsreader</p>
                    <p className="text-[16px] leading-[26px] text-[#6c8988]">Plus Jakarta Sans (Body)</p>
                  </div>
                  <div className="flex flex-col gap-[6.5px]">
                    <p className="text-subtle text-[12px] leading-[16px] font-semibold tracking-[0.24px]">Brand Color Palette</p>
                    <div className="flex gap-[8px]">
                      {["#4648d4", "#01201f", "#fbf9f5"].map((c) => (
                        <span key={c} className="size-[24px] rounded-full shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" style={{ background: c }} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="relative flex h-[288px] flex-col justify-between overflow-hidden rounded-[8px] bg-[rgba(255,255,255,0.1)] p-[16px]">
                  <Image src="/figma/cap-subtitle.jpg" alt="" fill sizes="320px" className="object-cover" />
                  <span className="relative w-fit rounded-[4px] bg-[rgba(0,0,0,0.7)] px-[4px] py-[2px] text-[12px] leading-[16px] font-semibold tracking-[0.24px] text-white backdrop-blur-[2px]">
                    Auto-Captioning
                  </span>
                  <p className="relative rounded-[4px] bg-[rgba(0,0,0,0.9)] p-[8px] text-center text-[12px] leading-[16px] font-semibold tracking-[0.24px] text-white">
                    &ldquo;…shifting the <span className="text-primary font-normal underline">entire company</span> towards clarity.&rdquo;
                  </p>
                </div>
              </div>
            </div>

            <div className="order-1 flex flex-col gap-[16px] lg:order-2">
              <Pill>Brand Kit Engine</Pill>
              <h3 className="font-display text-[28px] leading-[1.25] font-normal text-white md:text-[32px] md:leading-[40px]">
                Auto-apply corporate brand kits with zero manual editing
              </h3>
              <p className="text-[16px] leading-[26px] text-[#6c8988]">
                Never worry about unapproved fonts, distorted logos, or mismatched
                subtitle colors. Lock your corporate guidelines once; Mira wraps
                every piece of video footage in pixel-perfect company styling.
              </p>
              {/* Lower-thirds with names and per-department disclaimers are
                  not built; logo placement, word-highlight captions and
                  owner/admin-only kit edits are. */}
              <ul className="flex flex-col gap-[8px] pt-[8px]">
                {[
                  "Logo placement, size and opacity set once for every clip",
                  "Word-highlight captions in your brand font and colours",
                  "Only owners and admins can change the brand kit",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-[8px] text-[14px] leading-[20px] text-white">
                    <CircleCheck className="mt-[2px] size-[14px] shrink-0" /> {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Feature 3 — 2:938 */}
          <div className="grid items-center gap-[48px] lg:grid-cols-[5fr_7fr]">
            <div className="flex flex-col gap-[16px]">
              <Pill>Multi-Platform Reframing</Pill>
              <h3 className="font-display text-[28px] leading-[1.25] font-normal text-white md:text-[32px] md:leading-[40px]">
                Smart reframing for every screen your team actually uses
              </h3>
              <p className="text-[16px] leading-[26px] text-[#6c8988]">
                Mira doesn&apos;t just crop the center. Mira&apos;s computer vision
                dynamically pans and tracks who is talking, keeping the active
                speaker centered whether you export for mobile Slack feeds or
                desktop monitors.
              </p>
              <div className="grid grid-cols-3 gap-[8px] pt-[8px]">
                {[["9:16", "Slack & Mobile Push"], ["1:1", "Intranet Carousels"], ["16:9", "Portal & Email"]].map(([r, l]) => (
                  <div key={r} className="rounded-[4px] bg-[rgba(255,255,255,0.1)] p-[8px]">
                    <p className="text-[20px] leading-[28px] font-bold tracking-[-0.2px] text-white">{r}</p>
                    <p className="text-[12px] leading-[16px] font-semibold tracking-[0.24px] text-[#6c8988]">{l}</p>
                  </div>
                ))}
              </div>
            </div>

            <div aria-hidden className="flex items-center justify-center gap-[16px] overflow-hidden rounded-[12px] bg-[rgba(255,255,255,0.05)] p-[24px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]">
              {[
                { src: "/figma/cap-916.jpg", label: "9:16 Feed", cls: "h-[200px] w-[112px] md:h-[256px] md:w-[144px]" },
                { src: "/figma/cap-11.jpg", label: "1:1 Intranet", cls: "size-[150px] md:size-[192px]" },
                { src: "/figma/cap-169.jpg", label: "16:9 Desktop", cls: "h-[112px] w-[175px] md:h-[144px] md:w-[224px]" },
              ].map((c) => (
                <div key={c.label}
                     className={`relative flex shrink-0 flex-col justify-end overflow-hidden rounded-[8px] p-[8px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] ${c.cls}`}>
                  <Image src={c.src} alt="" fill sizes="224px" className="object-cover" />
                  <span className="relative w-fit rounded-[4px] bg-[rgba(0,0,0,0.8)] px-[6px] py-[2px] text-[10px] leading-[15px] text-white">{c.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 6-GRID — 2:970 ────────────────────────────────────────────────── */
const GRID = [
  { icon: { src: "/figma/icon-g-scissors.svg", w: 20, h: 20 }, t: "AI Highlight Clipping",
    d: "Mira scans speech patterns, tone, and agenda slides to detect the true high points of your recording without human prompting.",
    // "Average accuracy: 96.4% on town halls" is an unmeasured figure.
    foot: "Ranked by meaning, not keywords" },
  { icon: { src: "/figma/icon-g-crop.svg", w: 22, h: 22 }, t: "Auto Crop & Face Tracking",
    d: "Identifies each speaker's face and keeps them naturally framed in vertical and square formats without manual keyframing.",
    // Tracking is a heuristic; "multi-person speaker transition tracking"
    // overstates it. The fallback is the honest detail.
    foot: "Keeps the full frame when unsure" },
  { icon: { src: "/figma/icon-g-subtitles.svg", w: 20, h: 16 }, t: "Dynamic Subtitles",
    // "Over 99% phonetic accuracy in 48 languages" — no translation exists and
    // no accuracy figure has been measured. "Custom acronym dictionary" is not
    // built either.
    d: "Word-by-word captions generated from the transcript and burned into the picture, so employees can watch on mute anywhere.",
    foot: "Styled from your brand kit" },
  { icon: { src: "/figma/icon-g-tune.svg", w: 18, h: 18 }, t: "In-Browser Quick Adjust",
    // Editing the video by editing the transcript is not built — trim is.
    d: "Need a minor change? Re-trim a finished clip's start and end in the browser. Captions are burned in, so nothing falls out of sync.",
    foot: "Zero Premiere or Final Cut skills needed" },
  { icon: { src: "/figma/icon-g-palette.svg", w: 20, h: 20 }, t: "Locked Brand Templates",
    d: "Enforce corporate guidelines across your entire organization. Fonts, logos, and layouts are set per workspace so decentralized teams stay on-brand.",
    foot: "Only owners & admins can edit" },
];

export function ProductGrid() {
  return (
    <section className="bg-background px-[24px] py-[96px] md:px-[48px]">
      <div className="mx-auto flex max-w-[1184px] flex-col items-center gap-[64px]">
        <div className="flex max-w-[768px] flex-col items-center gap-[6.5px] pt-[5.5px] text-center">
          <p className={EYEBROW}>Engineered precision</p>
          <h2 className={H2}>How Mira Creates Videos on Autopilot</h2>
          <p className="text-muted-foreground pt-[1.5px] text-[16px] leading-[26px]">
            Mira works in the background of your workspace, making company video
            output faster, simpler, and enterprise-grade.
          </p>
        </div>
        <div className="grid w-full gap-[32px] md:grid-cols-3">
          {GRID.map((g) => (
            <article key={g.t}
                     className="flex flex-col gap-[4px] self-start rounded-[12px] bg-white p-[24px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]">
              <span className="grid size-[48px] place-items-center rounded-[8px] bg-[#e1e0ff]">
                <Image src={g.icon.src} alt="" width={g.icon.w} height={g.icon.h} style={{ width: g.icon.w, height: g.icon.h }} />
              </span>
              <h3 className="pt-[12px] text-[20px] leading-[28px] font-semibold tracking-[-0.2px]">{g.t}</h3>
              <p className="text-muted-foreground pb-[12px] text-[14px] leading-[22px]">{g.d}</p>
              <p className="bg-muted text-primary rounded-[4px] p-[8px] text-[12px] leading-[16px] font-semibold tracking-[0.24px]">
                {g.foot}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── TESTIMONIAL — 2:1083 ──────────────────────────────────────────── */
/**
 * The design names "Sarah Jenkins, VP Internal Communications, Global Logistics
 * Group" and "David Lindqvist, Head of Brand & Digital Media, Nordic Energy"
 * with portrait photos, and a "15 views → 2,400 views within 3 hours" result.
 * Invented people with faces presented as customers is a fabricated
 * testimonial, so the layout keeps the serif quote and the attribution row but
 * the attribution is role and industry, with an initials avatar. With no
 * disclaimer line under them, the quotes state the problem these buyers
 * describe rather than a result nobody has measured yet.
 */
const QUOTES = [
  { q: "Our town hall recordings sit on an intranet server and almost nobody opens them. We need 45-second highlights out the same day the all-hands ends.",
    role: "VP Internal Communications", org: "Logistics group" },
  { q: "Brand guardrails are the deal-breaker. Department leads should be able to make their own clips without our fonts, colours or logo coming out wrong.",
    role: "Head of Brand & Digital Media", org: "Energy company" },
];

export function ProductQuotes() {
  return (
    <section className="bg-background px-[24px] py-[96px] md:px-[48px]">
      <div className="mx-auto max-w-[1184px]">
        <div className="grid gap-[32px] md:grid-cols-2">
          {QUOTES.map((x) => (
            <figure key={x.role} className="flex flex-col gap-[24px] rounded-[12px] bg-white p-[40px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
              <blockquote className="font-display text-[20px] leading-[32px] italic md:text-[24px] md:leading-[36px]">
                &ldquo;{x.q}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-[16px]">
                <span className="bg-primary/10 text-primary grid size-[48px] shrink-0 place-items-center rounded-full text-[14px] font-bold">
                  {x.role.split(" ").filter((w) => /^[A-Z]/.test(w)).slice(0, 2).map((w) => w[0]).join("")}
                </span>
                <span>
                  <span className="block text-[14px] leading-[20px] font-semibold tracking-[0.14px]">{x.role}</span>
                  <span className="text-muted-foreground block text-[14px] leading-[22px]">{x.org}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── FINAL CTA — 2:1107 ────────────────────────────────────────────── */
/**
 * "Get your first 3 full recordings … free", "your existing Zoom or Teams
 * integration" and "SOC-2 certified" — the first is a commercial offer that
 * isn't decided, the other two don't exist.
 */
export function ProductCta() {
  return (
    <section className="bg-background px-[24px] py-[96px] md:px-[64px]">
      <div className="relative mx-auto max-w-[1152px] overflow-hidden rounded-[16px] bg-black p-[40px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] md:p-[96px]">
        <div aria-hidden className="bg-primary pointer-events-none absolute -right-[80px] -bottom-[80px] size-[384px] rounded-full opacity-40 blur-[60px]" />
        <div className="relative flex max-w-[672px] flex-col items-start gap-[16px]">
          <span className="flex items-center gap-[4px] rounded-full bg-[rgba(255,255,255,0.1)] px-[16px] py-[4px]">
            <Image src="/figma/icon-robot.svg" alt="" width={15} height={13} className="h-[12.667px] w-[14.667px]" />
            <span className="text-[12px] leading-[16px] font-semibold tracking-[0.24px] text-[#e1e0ff]">
              Deploy Mira in your workspace today
            </span>
          </span>
          <h2 className="font-display text-[40px] leading-[1.13] font-normal tracking-[-1.5px] text-white md:text-[60px] md:leading-[68px]">
            Put Mira to work on your next recording.
          </h2>
          <p className="text-[18px] leading-[30px] text-[#6c8988]">
            Bring a real recording to a 20-minute call and watch it come back
            clipped, captioned, and branded. Setup is an upload — no integration
            to install.
          </p>
          <div className="flex flex-wrap items-center gap-[16px] pt-[24px]">
            <a href={CTA_HREF}
               className="bg-primary rounded-full px-[40px] py-[16px] text-[14px] leading-[20px] font-semibold tracking-[0.14px] text-white drop-shadow-[0px_12px_14px_rgba(70,72,212,0.4)] transition-opacity hover:opacity-90">
              Request access with Mira ↗
            </a>
            <span className="text-[12px] leading-[16px] font-semibold tracking-[0.24px] text-[#6c8988]">
              No credit card required • Workspace-isolated data
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
