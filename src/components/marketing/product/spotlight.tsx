"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Interactive use-case switcher — Figma node 2:1034.
 *
 * The Figma draws three tabs with "Executive Briefings" active and only that
 * panel populated; Town Halls and HR & Safety are built on the same layout.
 *
 * The design's stat tiles — 88% completion rate, 4.9/5 comms rating — are
 * presented as measured results. With no customers there is nothing to
 * measure, so the tiles state product facts. "10x ROI" in the heading goes the
 * same way.
 */
const PANELS = [
  {
    id: "townhall",
    tab: "Town Halls & All-Hands",
    pill: "All-Hands Recaps",
    title: "Turn an Hour-Long All-Hands into Clips People Finish",
    body: "Upload the full recording. Mira ranks the moments that matter, cuts up to five of them as separate reels, captions them, and applies your brand kit — ready to post the same day.",
    stats: [["5 reels", "From one upload"], ["~1 min", "Per 10 min of source"], ["4 ratios", "Per clip"]],
    image: "/figma/mira-stage.jpg",
    badge: "All-Hands Recording · Q3",
    lower: "Highlight: “FY26 core vision”",
  },
  {
    id: "exec",
    tab: "Executive Briefings",
    pill: "Executive Presence",
    title: "Give C-Suite Updates the Polish of a Broadcast Studio",
    body: "CEOs and department leads can record a rough 5-minute webcam thought. Mira clips out pauses, centers the frame, burns in captions, and delivers a polished video ready for leadership dissemination.",
    stats: [["9:16", "Auto-framed"], ["Burned-in", "Captions"], ["1 kit", "Brand applied"]],
    image: "/figma/spot-exec.jpg",
    badge: "Leadership Briefing #12",
    lower: "Speaker: CEO · Leadership update",
  },
  {
    id: "hr",
    tab: "HR & Safety",
    pill: "Training & Compliance",
    title: "Make Safety and Policy Briefings Reach Every Shift",
    body: "Record the briefing once. Mira cuts short, captioned clips that play sound-off on a phone, so every shift gets the same message the same way instead of a session re-run four times.",
    stats: [["Sound-off", "Captions burned in"], ["Every shift", "Same message"], ["Trim", "After the fact"]],
    image: "/figma/cap-1.jpg",
    badge: "Safety Briefing · Plant B",
    lower: "Highlight: “Lockout procedure”",
  },
];

export function ProductSpotlight() {
  const [active, setActive] = useState("exec");
  const p = PANELS.find((x) => x.id === active) ?? PANELS[1];

  return (
    <section className="bg-muted px-[24px] py-[96px] md:px-[48px]">
      <div className="mx-auto flex max-w-[1184px] flex-col gap-[64px]">
        <div className="flex flex-col items-start justify-between gap-[20px] md:flex-row md:items-end">
          <div className="flex flex-col gap-[6.5px] pt-[5.5px]">
            <p className="text-primary text-[12px] leading-[16px] font-semibold tracking-[1.2px] uppercase">
              Real-world comms
            </p>
            <h2 className="font-display text-[34px] leading-[1.18] font-normal tracking-[-0.66px] md:text-[44px] md:leading-[52px]">
              Where Mira Delivers
            </h2>
          </div>
          <div role="tablist" className="flex max-w-full overflow-auto rounded-full bg-[#e4e2de] p-[4px]">
            {PANELS.map((t) => {
              const on = t.id === active;
              return (
                <button key={t.id} role="tab" aria-selected={on} onClick={() => setActive(t.id)}
                        className={`shrink-0 rounded-full px-[16px] py-[6px] text-[12px] leading-[16px] font-semibold tracking-[0.24px] transition-colors ${
                          on ? "bg-background text-foreground drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
                             : "text-muted-foreground hover:text-foreground"}`}>
                  {t.tab}
                </button>
              );
            })}
          </div>
        </div>

        <div role="tabpanel"
             className="grid items-center gap-[32px] rounded-[12px] bg-white p-[24px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] md:p-[40px] lg:grid-cols-2">
          <div className="flex flex-col items-start gap-[15px] pt-[2px]">
            <span className="rounded-full bg-[#e1e0ff] px-[8px] py-[3.5px] text-[12px] leading-[16px] font-semibold tracking-[0.24px] text-[#07006c]">
              {p.pill}
            </span>
            <h3 className="font-display text-[28px] leading-[1.25] font-normal md:text-[32px] md:leading-[40px]">{p.title}</h3>
            <p className="text-muted-foreground text-[16px] leading-[26px]">{p.body}</p>
            <div className="grid w-full grid-cols-3 gap-[8px] pt-[5px]">
              {p.stats.map(([big, small]) => (
                <div key={small} className="rounded-[4px] bg-[#efeeea] p-[8px]">
                  <p className="text-primary text-[18px] leading-[28px] font-bold tracking-[-0.2px] md:text-[20px]">{big}</p>
                  <p className="text-muted-foreground text-[12px] leading-[16px] font-semibold tracking-[0.24px]">{small}</p>
                </div>
              ))}
            </div>
          </div>

          <div aria-hidden
               className="relative flex h-[320px] flex-col justify-between overflow-hidden rounded-[12px] p-[16px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]">
            <Image src={p.image} alt="" fill sizes="(max-width:1024px) 100vw, 540px" className="object-cover" />
            <span className="relative w-fit rounded-[4px] bg-[rgba(0,0,0,0.8)] px-[8px] py-[4px] text-[12px] leading-[16px] font-semibold tracking-[0.24px] text-white backdrop-blur-[6px]">
              {p.badge}
            </span>
            <div className="relative flex items-center justify-between rounded-[8px] bg-[rgba(255,255,255,0.9)] p-[8px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1)] backdrop-blur-[6px]">
              <span className="text-[12px] leading-[16px] font-semibold tracking-[0.24px]">{p.lower}</span>
              <Image src="/figma/icon-verified.svg" alt="" width={18} height={18} className="h-[17.5px] w-[18.333px]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
