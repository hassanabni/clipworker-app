import Link from "next/link";
import { ArrowUpRight, Palette, Smartphone, Zap } from "lucide-react";
import { CTA_HREF } from "@/lib/cta";

/**
 * MeetMiraAgentSection — Figma node 2:79.
 *
 * Three white showcase cards, each a copy column beside a dark product mockup;
 * card 2 reverses. The mockups are built in markup rather than exported as
 * flat images so the text inside them stays real text — selectable, searchable
 * and legible at any zoom, which a PNG of a UI is not. They are decorative, so
 * each is aria-hidden.
 */
function Pill({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <span className="inline-flex w-fit items-center gap-[6px] rounded-full bg-[#eeeafd] px-[12px] py-[6px] text-[13px] font-semibold text-[#4f46e5]">
      <Icon className="size-[14px]" />
      {children}
    </span>
  );
}

function Copy({ pill, icon, title, body, perfect }: {
  pill: string; icon: React.ElementType; title: string; body: string; perfect: string;
}) {
  return (
    <div className="flex flex-col gap-[16px] p-[32px] md:p-[48px]">
      <Pill icon={icon}>{pill}</Pill>
      <h3 className="text-[28px] leading-[1.18] font-extrabold tracking-[-0.9px] text-[#030712] md:text-[32px]">
        {title}
      </h3>
      <p className="text-[16px] leading-[26px] text-[#4b5563]">{body}</p>
      <p className="text-[14px] leading-[22px] text-[#6b7280] italic">{perfect}</p>
      <Link href={CTA_HREF}
         className="inline-flex w-fit items-center gap-[5px] text-[15px] font-semibold text-[#4f46e5] hover:underline">
        See it in action <ArrowUpRight className="size-[14px]" />
      </Link>
    </div>
  );
}

/** The dark mockup shell every card's right-hand panel sits in. */
function Stage({ children }: { children: React.ReactNode }) {
  return (
    <div aria-hidden
         className="m-[24px] flex flex-col gap-[16px] rounded-[16px] bg-[#0f1117] bg-[radial-gradient(120%_100%_at_70%_10%,rgba(67,56,202,0.28)_0%,transparent_60%)] p-[20px] md:m-[32px]">
      {children}
    </div>
  );
}

const MONO = "font-mono text-[11px] text-[#a1a1aa]";
const SUB = "rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] p-[14px]";

export function MeetMira() {
  return (
    <section id="mira" className="bg-white px-[24px] py-[96px] md:px-[64px]">
      <div className="mx-auto max-w-[1152px]">
        <div className="mb-[40px]">
          <p className="mb-[8px] text-[12px] leading-[16px] font-semibold tracking-[1.2px] text-[#4f46e5] uppercase">
            Meet your AI video agent
          </p>
          <h2 className="text-[32px] leading-[1.15] font-extrabold tracking-[-1.2px] text-[#030712] md:text-[40px]">
            Built for internal &amp; corporate comms
          </h2>
        </div>

        <div className="flex flex-col gap-[32px]">
          {/* Card 1 — 2:88 */}
          <article className="grid items-center overflow-hidden rounded-[24px] border border-[rgba(229,231,235,0.9)] bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)] lg:grid-cols-2">
            <Copy icon={Zap} pill="Recap & engagement"
                  title="Turn the long recording into the clip people watch"
                  body="A town hall, a safety briefing, a training session — the whole thing gets transcribed and searched, and the moments worth keeping come out as short, captioned clips."
                  perfect="Perfect for: town hall recaps, Q&A summaries, and cross-team knowledge sharing." />
            <Stage>
              <div className="flex flex-wrap items-center justify-between gap-[8px]">
                <span className="flex items-center gap-[8px] text-[12px] font-medium text-white">
                  <span className="size-[8px] rounded-full bg-[#34d399]" />
                  AI Moment Detector: 4 Key Clips Identified
                </span>
                <span className={`${MONO} shrink-0 rounded-[6px] bg-[rgba(255,255,255,0.06)] px-[8px] py-[4px] whitespace-nowrap`}>
                  45:20 Recording → 02:40 Clips
                </span>
              </div>

              <div className="grid gap-[12px] sm:grid-cols-[160px_1fr]">
                <div className={`${SUB} flex flex-col justify-between gap-[28px]`}>
                  <div className="flex items-start justify-between">
                    <span className="rounded-[4px] bg-[#4f46e5] px-[6px] py-[2px] font-mono text-[10px] text-white">
                      9:16 vertical
                    </span>
                    <span className="size-[6px] rounded-full bg-[#34d399]" />
                  </div>
                  <span className="mx-auto grid size-[28px] place-items-center rounded-full bg-[#4f46e5] text-[11px] text-white">▶</span>
                  <div>
                    <p className={MONO}>Clip #1 • 00:42</p>
                    <p className="text-[13px] font-semibold text-white">David — VP Ops</p>
                  </div>
                </div>

                <div className="flex flex-col gap-[12px]">
                  <div className={SUB}>
                    <div className="mb-[8px] flex items-center justify-between">
                      <span className="rounded-[4px] bg-[#4f46e5] px-[8px] py-[3px] font-mono text-[10px] tracking-wide text-white uppercase">
                        Top highlight
                      </span>
                      <span className="text-[12px] text-[#34d399]">✓ 98% relevance</span>
                    </div>
                    <p className="text-[13px] leading-[20px] text-white">
                      &ldquo;Shift handovers just got 10x faster with auto-generated
                      video updates across plant shifts.&rdquo;
                    </p>
                    <p className={`${MONO} mt-[8px]`}>Timestamp: 14:12 – 14:54 • Captions synced</p>
                  </div>
                  <div className={SUB}>
                    <div className="mb-[10px] flex items-center justify-between">
                      <span className={MONO}>Recording Waveform</span>
                      <span className={MONO}>Auto-Trim Active</span>
                    </div>
                    <div className="flex h-[26px] items-end gap-[3px]">
                      {[5,9,14,20,12,24,18,26,15,8,6,11,7,4,9,5].map((h, i) => (
                        <span key={i}
                              className={`w-[4px] rounded-full ${i > 3 && i < 10 ? "bg-[#6366f1]" : "bg-[rgba(255,255,255,0.25)]"}`}
                              style={{ height: h }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-[8px] border-t border-[rgba(255,255,255,0.07)] pt-[12px]">
                <span className={MONO}>Export: 1080x1920 MP4</span>
                <span className={`${MONO} flex items-center gap-[6px]`}>
                  <span className="size-[6px] rounded-full bg-[#34d399]" />
                  Ready for Slack &amp; Teams
                </span>
              </div>
            </Stage>
          </article>

          {/* Card 2 — 2:187, reversed */}
          <article className="grid items-center overflow-hidden rounded-[24px] border border-[rgba(229,231,235,0.9)] bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)] lg:grid-cols-2">
            <Stage>
              <div className="flex flex-wrap items-center justify-between gap-[8px]">
                <span className="flex items-center gap-[10px]">
                  <span className="rounded-[6px] bg-[#4f46e5] px-[8px] py-[4px] font-mono text-[11px] text-white">
                    Brand Guard: Enforced
                  </span>
                  <span className="text-[13px] text-[#a1a1aa]">Workspace Default</span>
                </span>
                <span className={MONO}>100% Clip Coverage</span>
              </div>

              <div className="grid gap-[12px] sm:grid-cols-2">
                <div className={SUB}>
                  <p className={`${MONO} mb-[10px] tracking-wide uppercase`}>Typography &amp; subtitles</p>
                  <div className="mb-[10px] flex items-center justify-between rounded-[8px] border border-[rgba(255,255,255,0.08)] px-[10px] py-[8px]">
                    <span className="text-[13px] text-white">Inter / SemiBold</span>
                    <span className={MONO}>Auto 28px</span>
                  </div>
                  <div className="rounded-[8px] bg-black px-[10px] py-[10px] text-center">
                    <p className="text-[13px] font-semibold text-white">
                      &ldquo;Consistent on every site.&rdquo;
                    </p>
                    <p className={`${MONO} mt-[4px]`}>Burned-in • High Contrast</p>
                  </div>
                </div>

                <div className="flex flex-col gap-[12px]">
                  <div className={SUB}>
                    <p className={`${MONO} mb-[10px] tracking-wide uppercase`}>Corporate palette</p>
                    <div className="flex flex-wrap gap-[8px]">
                      {[["#4F46E5", "#4F46E5"], ["#0F172A", "#0F172A"]].map(([label, hex]) => (
                        <span key={label}
                              className="flex items-center gap-[8px] rounded-full border border-[rgba(255,255,255,0.1)] px-[10px] py-[5px]">
                          <span className="size-[14px] rounded-full border border-white/20"
                                style={{ background: hex }} />
                          <span className="font-mono text-[11px] text-white">{label}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className={SUB}>
                    <p className={`${MONO} mb-[10px] tracking-wide uppercase`}>Watermark placement</p>
                    <div className="flex items-center justify-between rounded-[8px] border border-[rgba(255,255,255,0.08)] px-[10px] py-[8px]">
                      <span className="text-[13px] text-white">Bottom Right</span>
                      <span className="font-mono text-[11px] text-[#34d399]">Opacity 90%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-[8px] rounded-[10px] bg-black px-[14px] py-[12px]">
                <span className="flex items-center gap-[8px] text-[13px] text-white">
                  <span className="size-[8px] rounded-full bg-[#34d399]" />
                  Auto-Brand Injection: Active
                </span>
                <span className={MONO}>No manual editing needed</span>
              </div>
            </Stage>
            <Copy icon={Palette} pill="On-brand, automatically"
                  title="Your brand kit, applied to every clip without anyone deciding"
                  body="Logo, caption font, colours and placement are set once for the workspace. Every clip inherits them. There is no per-video styling step to forget, and no way for one site's clips to drift from another's."
                  perfect="Perfect for: multi-site consistency, and teams with no dedicated video department." />
          </article>

          {/* Card 3 — 2:260 */}
          <article className="grid items-center overflow-hidden rounded-[24px] border border-[rgba(229,231,235,0.9)] bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)] lg:grid-cols-2">
            <Copy icon={Smartphone} pill="Reframe & captions"
                  title="Cut for the screen it will actually be watched on"
                  body="Vertical for phones on the floor, wide for the screen in the break room, square for the feed. The speaker is tracked and kept in frame, and captions are burned in so it works with the sound off."
                  perfect="Perfect for: frontline and shift workers who never open company email." />
            <Stage>
              <div className="flex flex-wrap items-center justify-between gap-[8px]">
                <span className="flex items-center gap-[8px] text-[12px] font-medium text-white">
                  <span className="size-[8px] rounded-full bg-[#6366f1]" />
                  Dynamic Multi-Ratio AI Reframing
                </span>
                <span className={`${MONO} shrink-0 rounded-[6px] bg-[rgba(255,255,255,0.06)] px-[8px] py-[4px] whitespace-nowrap`}>
                  Speaker auto-centered
                </span>
              </div>

              <div className="flex items-end gap-[10px]">
                <div className={`${SUB} flex h-[190px] w-[38%] flex-col justify-between`}>
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[11px] text-white">9:16</span>
                    <span className="size-[6px] rounded-full bg-[#34d399]" />
                  </div>
                  <div className="text-center">
                    <span className="mx-auto block size-[26px] rounded-full border border-dashed border-[#818cf8] bg-[#4f46e5]" />
                    <p className={`${MONO} mt-[6px]`}>Smart Face Crop</p>
                  </div>
                  <span className="rounded-[6px] bg-black py-[5px] text-center text-[11px] text-white">
                    Mobile App
                  </span>
                </div>
                <div className={`${SUB} flex h-[150px] w-[31%] flex-col justify-between`}>
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[11px] text-white">1:1</span>
                    <span className={MONO}>Teams</span>
                  </div>
                  <div className="text-center">
                    <span className="mx-auto grid size-[26px] place-items-center rounded-[6px] bg-[rgba(255,255,255,0.1)] text-[12px] text-white">#</span>
                    <p className={`${MONO} mt-[6px]`}>In-Feed Player</p>
                  </div>
                  <span className="rounded-[6px] bg-black py-[5px] text-center text-[11px] text-white">
                    Social / Intranet
                  </span>
                </div>
                <div className={`${SUB} flex h-[118px] w-[31%] flex-col justify-between`}>
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[11px] text-white">16:9</span>
                    <span className={MONO}>Cinema</span>
                  </div>
                  <div className="text-center">
                    <span className="mx-auto block h-[5px] w-[52px] rounded-full bg-[#6366f1]" />
                    <p className={`${MONO} mt-[6px]`}>Breakroom TV</p>
                  </div>
                  <span className="rounded-[6px] bg-black py-[5px] text-center text-[11px] text-white">
                    Web Portal
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-[8px] border-t border-[rgba(255,255,255,0.07)] pt-[12px]">
                <span className={MONO}>One render, 3 native cuts automatically generated</span>
                <span className={MONO}>0 extra editing time</span>
              </div>
            </Stage>
          </article>
        </div>
      </div>
    </section>
  );
}
