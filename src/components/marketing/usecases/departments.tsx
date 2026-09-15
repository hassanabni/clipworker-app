"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * Use Cases — the department bar (Figma 2:1506) and the department view
 * (2:1267), once per department.
 *
 * The Figma draws the bar as tabs over a single active panel. All three
 * departments are laid out on the page instead, one after another, and the bar
 * jumps to each and highlights whichever one is on screen. Section ids match
 * the old /use-cases/<slug> routes, which redirect to these anchors.
 *
 * Only the Internal Comms panel exists in the file, so HR and Marketing are
 * built on the same layout with copy drawn from the old HR and Marketing pages.
 *
 * Copy corrections, all in one direction:
 *  - 87% completion and 4.2 min distribution are shown as measured customer
 *    outcomes. There are no customers yet, so the stat tiles state what the
 *    product does instead.
 *  - "SOC-2 Type II, ISO 27001" is claimed on the isolation card. Neither is
 *    held; workspace isolation in the database is.
 *  - "Delivers … directly to intranet channels and Slack" / "Auto-synced to
 *    Slack" imply an integration. There isn't one — clips are downloaded or
 *    shared as links.
 */

type Dept = {
  id: string;
  tab: string;
  tabIcon: { src: string; w: number; h: number };
  pill: string;
  title: string;
  body: string;
  stats: [string, string, boolean][];
  file: string;
  image: string;
  highlight: string;
  tray: string;
  pillars: { icon: { src: string; w: number; h: number }; title: string; body: string }[];
};

const DEPTS: Dept[] = [
  {
    id: "internal-comms",
    tab: "Internal & Comms",
    tabIcon: { src: "/figma/icon-tab-comms.svg", w: 15, h: 15 },
    pill: "Mira for Internal & Executive Comms",
    title: "Turn 60-Minute Town Halls into High-Impact Leadership Updates",
    body: "Deskbound and frontline teams rarely watch hour-long video meetings. Mira ingests town hall recordings, pinpoints key strategy milestones, and delivers 45-second executive summaries ready to post to your intranet in minutes.",
    stats: [
      ["45 sec", "Executive summary cut from a 60-minute recording", true],
      ["~1 min", "Processing time for a 10-minute source", false],
    ],
    file: "TownHall_Q3_AllHands.mp4",
    image: "/figma/uc-townhall.jpg",
    highlight: "08:14 – 08:59 • “FY26 Core Vision”",
    tray: "Identified 3 executive segments • Captions applied • Brand kit matched",
    pillars: [
      { icon: { src: "/figma/icon-uc-digest.svg", w: 21, h: 20 }, title: "Town Hall & All-Hands Digest",
        body: "Mira identifies key leadership quotes, trims speech pauses, and highlights tactical takeaways. No waiting 48 hours for agency turnarounds." },
      { icon: { src: "/figma/icon-uc-phone.svg", w: 15, h: 22 }, title: "Deskless & Frontline Delivery",
        body: "Intelligently reframes speakers into 9:16 vertical video with high-contrast burnt-in captions, so plant and retail workers can watch sound-off on mobile." },
      { icon: { src: "/figma/icon-uc-shield.svg", w: 16, h: 20 }, title: "Walled Data Isolation",
        body: "Confidential communications stay quarantined in your workspace, enforced in the database itself, and your footage is never used to train public models." },
    ],
  },
  {
    id: "hr",
    tab: "HR & Culture",
    tabIcon: { src: "/figma/icon-tab-hr.svg", w: 18, h: 9 },
    pill: "Mira for HR & People Teams",
    title: "Turn Onboarding Days into Clips New Hires Actually Finish",
    body: "Hour-long onboarding and compliance sessions compete with real jobs for attention. Mira breaks them into short, topic-specific clips people can complete between shifts, calls or patients, the same way at every site.",
    stats: [
      ["5 clips", "From one recorded onboarding session, cut by topic", true],
      ["1 kit", "Brand applied to every module automatically", false],
    ],
    file: "Onboarding_Week1_Welcome.mp4",
    image: "/figma/cap-1.jpg",
    highlight: "14:02 – 14:48 • “Your first week”",
    tray: "Split into 5 modules • Captions applied • Brand kit matched",
    pillars: [
      { icon: { src: "/figma/icon-uc-digest.svg", w: 21, h: 20 }, title: "Onboarding Modules",
        body: "Break a full onboarding day into topic-specific clips new hires can revisit, instead of a single recording nobody rewatches." },
      { icon: { src: "/figma/icon-uc-phone.svg", w: 15, h: 22 }, title: "Compliance Recaps",
        body: "Short, captioned reference clips from recorded compliance sessions, watchable on a phone in the few minutes people actually have." },
      { icon: { src: "/figma/icon-uc-shield.svg", w: 16, h: 20 }, title: "Consistent at Every Site",
        body: "Every location sees the same training, explained the same way — no variation from trainer to trainer." },
    ],
  },
  {
    id: "marketing",
    tab: "Video Marketing",
    tabIcon: { src: "/figma/icon-tab-mkt.svg", w: 15, h: 12 },
    pill: "Mira for Marketing Teams",
    title: "Turn One Webinar into a Week of On-Brand Clips",
    body: "Webinars and interviews usually air once and disappear. Mira ranks the strongest moments, cuts up to five separate reels from a single upload, and frames each for the channel it will run on.",
    stats: [
      ["5 reels", "Cut separately from a single upload", true],
      ["4 ratios", "9:16, 4:5, 1:1 and 16:9 per clip", false],
    ],
    file: "Webinar_Product_Launch.mp4",
    image: "/figma/spot-exec.jpg",
    highlight: "22:10 – 22:52 • “Why we built it”",
    tray: "Ranked 5 distinct moments • Captions applied • Brand kit matched",
    pillars: [
      { icon: { src: "/figma/icon-uc-digest.svg", w: 21, h: 20 }, title: "Webinar Highlights",
        body: "Pull the strongest moments out of a 60-minute webinar as separate clips ready for LinkedIn, email and follow-up sequences." },
      { icon: { src: "/figma/icon-uc-phone.svg", w: 15, h: 22 }, title: "Multi-Format Output",
        body: "Vertical for social, square for the feed, wide for embeds — chosen per clip, with the speaker tracked in frame." },
      { icon: { src: "/figma/icon-uc-shield.svg", w: 16, h: 20 }, title: "On-Brand Without Review",
        body: "Logo, caption font and colours come from the workspace kit, so every clip matches without anyone checking it." },
    ],
  },
];

export function DepartmentSections() {
  const [active, setActive] = useState(DEPTS[0].id);

  // Highlight whichever department is in the upper part of the viewport.
  useEffect(() => {
    const els = DEPTS.map((d) => document.getElementById(d.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver((entries) => {
      const hit = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (hit) setActive(hit.target.id);
    }, { rootMargin: "-180px 0px -55% 0px" });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* Department bar — 2:1506 */}
      <div className="sticky top-[80px] z-40 bg-[rgba(251,249,245,0.95)] py-[16px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] backdrop-blur-[6px]">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-[12px] px-[24px] md:px-[48px]">
          <nav aria-label="Departments"
               className="flex max-w-full items-center gap-[4px] overflow-auto rounded-full bg-[#eae8e4] p-[4px]">
            {DEPTS.map((t) => {
              const on = t.id === active;
              return (
                <a key={t.id} href={`#${t.id}`} aria-current={on ? "true" : undefined}
                   onClick={() => setActive(t.id)}
                   className={`flex shrink-0 items-center gap-[4px] rounded-full px-[16px] py-[4px] text-[14px] leading-[20px] font-semibold tracking-[0.14px] transition-colors ${
                     on ? "bg-white text-foreground drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
                        : "text-muted-foreground hover:text-foreground"}`}>
                  <Image src={t.tabIcon.src} alt="" width={t.tabIcon.w} height={t.tabIcon.h}
                         style={{ width: t.tabIcon.w, height: t.tabIcon.h }} />
                  {t.tab}
                </a>
              );
            })}
          </nav>
          <span className="text-muted-foreground hidden items-center gap-[4px] text-[12px] leading-[16px] font-semibold tracking-[0.24px] md:flex">
            <span className="bg-primary size-[6px] rounded-full" />
            Mira powers all 3 departments with unified brand presets
          </span>
        </div>
      </div>

      {DEPTS.map((d, i) => (
        <DepartmentView key={d.id} d={d} first={i === 0} />
      ))}
    </>
  );
}

/* Department view — 2:1267 */
function DepartmentView({ d, first }: { d: Dept; first: boolean }) {
  return (
    <section id={d.id}
             className={`bg-background scroll-mt-[152px] py-[64px] ${first ? "" : "border-border border-t"}`}>
      <div className="mx-auto flex max-w-[1280px] flex-col gap-[64px] px-[24px] md:px-[48px]">
        <div className="grid items-center gap-[32px] lg:grid-cols-2">
          <div className="flex flex-col items-start gap-[16px]">
            <span className="flex items-center gap-[4px] rounded-full bg-[#e1e0ff] px-[4px] py-[2px] text-[12px] leading-[16px] font-semibold tracking-[0.24px] text-[#07006c]">
              <Image src="/figma/icon-uc-megaphone.svg" alt="" width={13} height={11}
                     className="h-[11.083px] w-[12.833px]" />
              {d.pill}
            </span>
            <h2 className="font-display pt-[3px] text-[34px] leading-[1.22] font-normal tracking-[-0.66px] md:text-[44px] md:leading-[55px]">
              {d.title}
            </h2>
            <p className="text-muted-foreground text-[16px] leading-[26px]">{d.body}</p>
            <div className="grid w-full gap-[16px] pt-[8px] sm:grid-cols-2">
              {d.stats.map(([big, small, brand]) => (
                <div key={big} className="bg-muted rounded-[12px] px-[16px] pt-[16px] pb-[17px]">
                  <p className={`font-display text-[32px] leading-[40px] ${brand ? "text-primary" : ""}`}>
                    {big}
                  </p>
                  <p className="text-muted-foreground text-[14px] leading-[22px]">{small}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SaaS Preview — 2:1290 */}
          <div aria-hidden
               className="flex flex-col gap-[16px] overflow-hidden rounded-[16px] bg-[#141b2b] p-[24px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]">
            <div className="flex items-center justify-between gap-[8px] rounded-[8px] bg-[rgba(228,226,222,0.1)] px-[8px] pt-[6px] pb-[8px]">
              <span className="flex min-w-0 items-center gap-[4px]">
                <span className="size-[10px] shrink-0 rounded-full bg-[#ba1a1a]" />
                <span className="size-[10px] shrink-0 rounded-full bg-[#575e70]" />
                <span className="bg-primary size-[10px] shrink-0 rounded-full" />
                <span className="truncate pl-[4px] font-mono text-[12px] leading-[16px] font-bold tracking-[0.24px] text-[#c6c6cd]">
                  Mira · {d.file}
                </span>
              </span>
              <span className="shrink-0 rounded-[4px] bg-[rgba(70,72,212,0.3)] px-[8px] py-[2px] text-[12px] leading-[16px] font-semibold tracking-[0.24px] text-[#e1e0ff]">
                Autonomous Processing
              </span>
            </div>

            <div className="relative flex aspect-[16/10] flex-col justify-end overflow-hidden rounded-[12px] bg-[#01201f] p-[16px]">
              <Image src={d.image} alt="" fill sizes="(max-width:1024px) 100vw, 560px"
                     className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141b2b] via-transparent to-transparent" />
              <div className="relative">
                <div className="flex flex-wrap items-center gap-[4px] pb-[8px]">
                  <span className="bg-primary rounded-[4px] px-[8px] py-[2px] text-[12px] leading-[16px] font-semibold tracking-[0.24px] text-white">
                    Highlight 1 of 3
                  </span>
                  <span className="text-[14px] leading-[22px] text-white">{d.highlight}</span>
                </div>
                <div className="h-[4px] overflow-hidden rounded-full bg-[rgba(228,226,222,0.2)]">
                  <span className="block h-full w-[66.67%] bg-[#e1e0ff]" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-[8px] rounded-[12px] bg-[rgba(228,226,222,0.1)] p-[8px]">
              <span className="flex min-w-0 items-center gap-[8px]">
                <span className="grid h-[32px] w-[26.77px] shrink-0 place-items-center rounded-full bg-[#6063ee]">
                  <Image src="/figma/icon-uc-cut.svg" alt="" width={15} height={13}
                         className="h-[12.667px] w-[14.667px]" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[12px] leading-[16px] font-semibold tracking-[0.24px] text-white">
                    Mira Auto-Cut Complete
                  </span>
                  <span className="block text-[12px] leading-[16px] text-[#c6c6cd]">{d.tray}</span>
                </span>
              </span>
              <span className="shrink-0 rounded-[4px] bg-[rgba(228,226,222,0.2)] px-[8px] py-[4px] text-[12px] leading-[16px] font-semibold tracking-[0.24px] text-white">
                Ready to share
              </span>
            </div>
          </div>
        </div>

        {/* Feature Grid: 3 Pillars — 2:1323 */}
        <div className="grid gap-[32px] pt-[16px] md:grid-cols-3">
          {d.pillars.map((p) => (
            <article key={p.title}
                     className="flex flex-col gap-[4px] rounded-[16px] bg-white p-[24px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
              <span className="grid size-[40px] place-items-center rounded-[8px] bg-[#eae8e4]">
                <Image src={p.icon.src} alt="" width={p.icon.w} height={p.icon.h}
                       style={{ width: p.icon.w, height: p.icon.h }} />
              </span>
              <h3 className="pt-[12px] text-[20px] leading-[28px] font-semibold tracking-[-0.2px]">
                {p.title}
              </h3>
              <p className="text-muted-foreground text-[14px] leading-[22px]">{p.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
