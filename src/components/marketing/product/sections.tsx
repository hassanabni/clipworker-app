import Image from "next/image";
import { Check, Quote } from "lucide-react";
import { CTA_HREF } from "@/lib/cta";
import { Pill, CtaBand } from "@/components/marketing/kit";

/**
 * Product page body — Figma nodes 2:780, 2:845, 2:970, 2:1034, 2:1083, 2:1107.
 *
 * Copy is the design's, with four claims corrected because they describe
 * things that are not built. Each is noted where it appears.
 */

/* ── CHALLENGE — 2:780 ─────────────────────────────────────────────── */
const CHALLENGES = [
  {
    title: "Multichannel Challenge",
    body: "Every distribution channel expects its own layout: 9:16 for Slack and Teams on mobile, 1:1 for intranet feeds, and 16:9 for SharePoint embeds. Producing each by hand multiplies the work.",
  },
  {
    title: "Velocity Pressure",
    body: "Strategic announcements lose relevance within 24 hours. Waiting days for an external agency or an overstretched internal creative completely kills the moment.",
  },
  {
    title: "Engagement Hurdle",
    body: "Employees skip 60-minute unedited town hall recordings. Short, captioned, high-energy micro-briefings are the format that actually gets finished.",
  },
];

export function ProductChallenge() {
  return (
    <section className="bg-muted px-[24px] py-[96px] md:px-[48px]">
      <div className="mx-auto max-w-[1184px]">
        <h2 className="font-display mb-[40px] max-w-[820px] text-[32px] leading-[1.18] font-normal tracking-[-1.1px] md:text-[42px]">
          Video demands are rising, yet your resources stay the same.
        </h2>
        <div className="grid gap-[24px] md:grid-cols-3">
          {CHALLENGES.map((c) => (
            <article key={c.title}
                     className="border-border rounded-[16px] border bg-white p-[28px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
              <h3 className="mb-[10px] text-[18px] font-semibold tracking-[-0.2px]">{c.title}</h3>
              <p className="text-muted-foreground text-[15px] leading-[25px]">{c.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CORE CAPABILITIES — 2:845 (dark) ──────────────────────────────── */
function Caps({ items }: { items: string[] }) {
  return (
    <ul className="mt-[20px] space-y-[10px]">
      {items.map((i) => (
        <li key={i} className="flex items-start gap-[10px] text-[14px] leading-[22px] text-[#c9cbd4]">
          <Check className="mt-[3px] size-[14px] shrink-0 text-[#818cf8]" />
          {i}
        </li>
      ))}
    </ul>
  );
}

export function ProductCapabilities() {
  return (
    <section id="capabilities" className="bg-[#0b0d14] px-[24px] py-[96px] md:px-[48px]">
      <div className="mx-auto max-w-[1184px]">
        <div className="mb-[56px] max-w-[760px]">
          <p className="mb-[10px] text-[12px] font-semibold tracking-[1.2px] text-[#818cf8] uppercase">
            Core capabilities
          </p>
          <h2 className="font-display text-[32px] leading-[1.18] font-normal tracking-[-1.1px] text-white md:text-[42px]">
            Mira is your digital comms specialist.
          </h2>
        </div>

        <div className="flex flex-col gap-[64px]">
          {/* Feature 1 — 2:853 */}
          <div className="grid items-center gap-[32px] lg:grid-cols-2">
            <div>
              <span className="bg-primary/20 text-[#c7c6ff] inline-flex rounded-full px-[10px] py-[4px] text-[12px] font-semibold">
                Interviews &amp; Town Halls
              </span>
              <h3 className="font-display mt-[16px] text-[26px] leading-[1.2] font-normal tracking-[-0.8px] text-white md:text-[32px]">
                Transforming long recordings into punchy, high-retention clips
              </h3>
              <p className="mt-[14px] text-[15px] leading-[25px] text-[#9ca3af]">
                Whether it&apos;s an hour-long executive interview or an all-hands
                recording, Mira reads the full transcript, isolates
                high-conviction insights, and trims natural pauses automatically.
              </p>
              <Caps items={[
                "Auto-detects applause, keynote conclusions, and strategic pivots",
                "Removes stutters, long filler words, and awkward transitions",
                "Generates executive summary quote cards in one tap",
              ]} />
            </div>

            <div aria-hidden className="rounded-[12px] bg-[rgba(255,255,255,0.05)] p-[24px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]">
              <div className="relative flex h-[320px] flex-col justify-end overflow-hidden rounded-[8px] p-[16px] md:h-[384px]">
                <Image src="/figma/cap-1.jpg" alt="" fill sizes="(max-width:1024px) 100vw, 560px"
                       className="object-cover" />
                <div className="absolute top-[16px] left-[16px] max-w-[320px] rounded-[8px] bg-[rgba(0,0,0,0.9)] p-[16px] backdrop-blur-[6px]">
                  <span className="mb-[4px] flex items-center gap-[4px]">
                    <Image src="/figma/icon-quote-sm.svg" alt="" width={13} height={13}
                           className="size-[12.833px]" />
                    <span className="text-[12px] font-semibold tracking-[0.24px] text-[#e1e0ff]">
                      Key Quotable Isolated
                    </span>
                  </span>
                  <p className="text-[14px] leading-[22px] text-white">
                    &ldquo;Our employees don&apos;t want longer memos; they want
                    authentic 60-second answers directly from leadership.&rdquo;
                  </p>
                </div>
                <div className="relative flex items-center justify-between gap-[8px] rounded-[8px] bg-[rgba(0,0,0,0.8)] p-[8px] backdrop-blur-[6px]">
                  <span className="flex items-center gap-[8px]">
                    <span className="size-[12px] rounded-full bg-[#34d399]" />
                    <span className="text-[12px] font-semibold tracking-[0.24px] text-white">
                      Extracted Clip #2: &lsquo;Authentic Answers&rsquo;
                    </span>
                  </span>
                  <span className="text-[12px] font-semibold tracking-[0.24px] text-[#e1e0ff]">
                    0:52 • 98% Match
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 — 2:893, reversed */}
          <div className="grid items-center gap-[32px] lg:grid-cols-2">
            <div aria-hidden className="order-2 grid gap-[16px] rounded-[12px] bg-[rgba(255,255,255,0.05)] p-[24px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] sm:grid-cols-2 lg:order-1">
              <div className="rounded-[8px] bg-[rgba(255,255,255,0.04)] p-[16px]">
                <p className="mb-[8px] text-[11px] tracking-[0.6px] text-[#9ca3af] uppercase">
                  Enforced typography
                </p>
                <p className="font-display text-[24px] text-white">Newsreader</p>
                <p className="mt-[4px] text-[13px] text-[#818cf8]">Plus Jakarta Sans (Body)</p>
                <p className="mt-[24px] mb-[8px] text-[11px] tracking-[0.6px] text-[#9ca3af] uppercase">
                  Brand color palette
                </p>
                <span className="flex gap-[8px]">
                  {["#4648d4", "#01201f", "#ffffff"].map((c) => (
                    <span key={c} className="size-[20px] rounded-full border border-white/20"
                          style={{ background: c }} />
                  ))}
                </span>
              </div>
              <div className="relative flex min-h-[190px] flex-col justify-end overflow-hidden rounded-[8px] p-[12px]">
                <Image src="/figma/cap-169.jpg" alt="" fill sizes="280px" className="object-cover" />
                <span className="absolute top-[12px] left-[12px] rounded-[4px] bg-[rgba(0,0,0,0.75)] px-[6px] py-[2px] text-[11px] text-white">
                  Auto-Captioning
                </span>
                <p className="relative rounded-[4px] bg-[rgba(0,0,0,0.8)] px-[8px] py-[6px] text-center text-[12px] font-semibold text-white">
                  &ldquo;…shifting the{" "}
                  <span className="bg-primary rounded-[3px] px-[3px]">entire company</span>{" "}
                  towards clarity.&rdquo;
                </p>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <span className="bg-primary/20 text-[#c7c6ff] inline-flex rounded-full px-[10px] py-[4px] text-[12px] font-semibold">
                Brand Kit Engine
              </span>
              <h3 className="font-display mt-[16px] text-[26px] leading-[1.2] font-normal tracking-[-0.8px] text-white md:text-[32px]">
                Auto-apply corporate brand kits with zero manual editing
              </h3>
              <p className="mt-[14px] text-[15px] leading-[25px] text-[#9ca3af]">
                Never worry about unapproved fonts, distorted logos, or mismatched
                subtitle colours. Lock your corporate guidelines once; Mira wraps
                every piece of footage in pixel-perfect company styling.
              </p>
              <Caps items={[
                "Automated lower-thirds with real speaker names & job titles",
                "Word-by-word captions synced to vocal cadence",
                "Department-level watermarking and legal disclaimers",
              ]} />
            </div>
          </div>

          {/* Feature 3 — 2:938 */}
          <div className="grid items-center gap-[32px] lg:grid-cols-2">
            <div>
              <span className="bg-primary/20 text-[#c7c6ff] inline-flex rounded-full px-[10px] py-[4px] text-[12px] font-semibold">
                Adaptive Framing
              </span>
              <h3 className="font-display mt-[16px] text-[26px] leading-[1.2] font-normal tracking-[-0.8px] text-white md:text-[32px]">
                Smart reframing for every screen your team actually uses
              </h3>
              <p className="mt-[14px] text-[15px] leading-[25px] text-[#9ca3af]">
                Mira doesn&apos;t just crop the centre. It tracks who is talking and
                keeps the active speaker framed, whether the clip ends up vertical
                on a phone, square in a feed, or wide on a break-room screen.
              </p>
              <Caps items={[
                "Active-speaker tracking with a full-frame fallback",
                "Four native ratios from a single upload",
                "Captions burned into the picture, so it plays on mute",
              ]} />
            </div>

            <div aria-hidden className="flex items-center justify-center gap-[16px] overflow-hidden rounded-[12px] bg-[rgba(255,255,255,0.05)] p-[24px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]">
              {[
                { src: "/figma/cap-916.jpg", label: "9:16 Feed", cls: "h-[200px] w-[112px] md:h-[256px] md:w-[144px]" },
                { src: "/figma/cap-11.jpg", label: "1:1 Intranet", cls: "size-[150px] md:size-[192px]" },
                { src: "/figma/cap-169.jpg", label: "16:9 Desktop", cls: "h-[112px] w-[175px] md:h-[144px] md:w-[224px]" },
              ].map((c) => (
                <div key={c.label}
                     className={`relative flex shrink-0 flex-col justify-end overflow-hidden rounded-[8px] p-[8px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.2)] ${c.cls}`}>
                  <Image src={c.src} alt="" fill sizes="224px" className="object-cover" />
                  <span className="relative w-fit rounded-[4px] bg-[rgba(0,0,0,0.8)] px-[6px] py-[2px] text-[10px] leading-[15px] text-white">
                    {c.label}
                  </span>
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
  { t: "AI Highlight Clipping",
    d: "Mira scans speech patterns, tone and agenda slides to detect the true high points of your recording without human prompting." },
  { t: "Auto Crop & Face Tracking",
    d: "Identifies each speaker's face and keeps them naturally framed in vertical and square formats without manual keyframing." },
  // The design says "over 99% phonetic accuracy in 48 languages". There is no
  // translation and no measured accuracy figure, so this states what is true:
  // captions in the recording's own language, burned in.
  { t: "Burned-in Subtitles",
    d: "Captions are generated from the transcript and burned into the picture, in the recording's own language, so clips play on mute anywhere." },
  // "Edit the video by editing the transcript" is not built — the only manual
  // edit after generation is trim. Reworded to that.
  { t: "Trim After the Fact",
    d: "Need a shorter cut? Re-trim a finished clip's start and end. Captions are already in the pixels, so nothing falls out of sync." },
  { t: "Locked Brand Templates",
    d: "Enforce corporate guidelines across the organisation. Fonts, logos and placement are set per workspace so teams stay on-brand." },
  { t: "Batch Reels",
    d: "Ask for up to five reels from one upload. Mira ranks and de-duplicates the moments, then cuts each as its own clip." },
];

export function ProductGrid() {
  return (
    <section className="px-[24px] py-[96px] md:px-[48px]">
      <div className="mx-auto max-w-[1184px]">
        <div className="mb-[40px]">
          <p className="text-primary mb-[10px] text-[12px] font-semibold tracking-[1.2px] uppercase">
            Under the hood
          </p>
          <h2 className="font-display text-[32px] leading-[1.18] font-normal tracking-[-1.1px] md:text-[42px]">
            How Mira works on autopilot.
          </h2>
        </div>
        <div className="grid gap-[24px] md:grid-cols-3">
          {GRID.map((g) => (
            <article key={g.t} className="border-border rounded-[16px] border bg-white p-[24px]">
              <h3 className="mb-[8px] text-[16px] font-semibold tracking-[-0.2px]">{g.t}</h3>
              <p className="text-muted-foreground text-[14px] leading-[23px]">{g.d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── USE CASE SPOTLIGHT — 2:1034 ───────────────────────────────────── */
export function ProductSpotlight() {
  return (
    <section className="bg-muted px-[24px] py-[96px] md:px-[48px]">
      <div className="mx-auto max-w-[1184px]">
        <h2 className="font-display mb-[32px] text-[32px] leading-[1.18] font-normal tracking-[-1.1px] md:text-[42px]">
          Where Mira delivers.
        </h2>
        <div className="border-border grid gap-[32px] rounded-[16px] border bg-white p-[32px] lg:grid-cols-[1.3fr_1fr] md:p-[48px]">
          <div>
            <Pill>Executive communications</Pill>
            <h3 className="mt-[16px] text-[22px] leading-[1.25] font-semibold tracking-[-0.4px] md:text-[26px]">
              Give C-suite updates the polish of a broadcast studio
            </h3>
            <p className="text-muted-foreground mt-[14px] text-[15px] leading-[25px]">
              A CEO or department lead records a rough five-minute webcam thought.
              Mira clips out the pauses, centres the frame, burns in corporate
              lower-thirds, and hands back something ready to send.
            </p>
            <a href={CTA_HREF}
               className="text-primary mt-[20px] inline-flex text-[15px] font-semibold hover:underline">
              See it on your own recording →
            </a>
          </div>
          {/* The design shows 88% completion / 4.9 rating / 1-click approval as
              measured results. There are no customers to measure, so these read
              as what the product does rather than as outcomes it has produced. */}
          <div className="bg-muted flex flex-col justify-center gap-[16px] rounded-[12px] p-[24px]">
            {[
              ["Four ratios", "from one upload"],
              ["Under a minute", "for a 10-minute source"],
              ["One brand kit", "applied automatically"],
            ].map(([big, small]) => (
              <div key={big}>
                <p className="font-display text-[26px] leading-[1.1]">{big}</p>
                <p className="text-muted-foreground text-[13px]">{small}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── TESTIMONIAL — 2:1083 ──────────────────────────────────────────── */
export function ProductQuotes() {
  return (
    <section className="px-[24px] py-[96px] md:px-[48px]">
      <div className="mx-auto grid max-w-[1184px] gap-[24px] md:grid-cols-2">
        {[
          "Before Mira, town hall recordings sat on an intranet server and almost nobody opened them. Short highlight reels get watched the same day.",
          "The brand guardrails are the part that sold us. Decentralised department leads generate their own clips, and the fonts, colours and logo are right every time.",
        ].map((q) => (
          <figure key={q} className="border-border rounded-[16px] border bg-white p-[28px]">
            <Quote className="text-primary/30 mb-[12px] size-[22px]" />
            <blockquote className="text-[17px] leading-[27px]">&ldquo;{q}&rdquo;</blockquote>
          </figure>
        ))}
      </div>
      <p className="text-muted-foreground mx-auto mt-[16px] max-w-[1184px] text-center text-[12px]">
        Illustrative — not real customers, and not attributed to anyone.
      </p>
    </section>
  );
}

/* ── FINAL CTA — 2:1107 ────────────────────────────────────────────── */
export function ProductCta() {
  return (
    <CtaBand
      headline="Put Mira to work on your next recording."
      sub="Bring a real recording to a 20-minute call and watch it come back clipped, captioned and branded. Setup takes minutes — you upload a file, no integration required."
    />
  );
}
