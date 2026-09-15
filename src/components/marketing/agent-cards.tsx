import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CTA_HREF } from "@/lib/cta";

/**
 * "Built for Internal & Corporate Comms" — the alternating feature cards from
 * the redesign.
 *
 * The design has THREE of these, one per agent, following Cofenster's shape:
 * a recap agent, an internal-messaging agent, and a text-to-video agent. Two of
 * those describe products that do not exist -- the pivot brief parks Ella and
 * Theo explicitly -- so this ships the one that is real, split into the three
 * jobs it actually does. Same layout, same rhythm, nothing promised that a
 * customer cannot have on the day they sign.
 */
const CARDS = [
  {
    pill: "Recap & engagement",
    headline: "Turn the long recording into the clip people watch",
    desc: "A town hall, a safety briefing, a training session — the whole thing gets transcribed and searched, and the moments worth keeping come out as short, captioned clips.",
    perfect: "Perfect for: town hall recaps, Q&A summaries, and cross-team knowledge sharing.",
    tint: "from-[#5b4fcf] to-[#8b5cf6]",
  },
  {
    pill: "On-brand, automatically",
    headline: "Your brand kit, applied to every clip without anyone deciding",
    desc: "Logo, caption font, colours and placement are set once for the workspace. Every clip inherits them. There is no per-video styling step to forget, and no way for one site's clips to drift from another's.",
    perfect: "Perfect for: multi-site consistency, and teams with no video department.",
    tint: "from-[#0b7285] to-[#5b4fcf]",
    flip: true,
  },
  {
    pill: "Reframe & captions",
    headline: "Cut for the screen it will actually be watched on",
    desc: "Vertical for phones on the floor, wide for the screen in the break room, square for the feed. The speaker is tracked and kept in frame, and captions are burned in so it works with the sound off.",
    perfect: "Perfect for: frontline and shift workers who never open email.",
    tint: "from-[#e4002b] to-[#8b5cf6]",
  },
];

export function AgentCards() {
  return (
    <section id="how" className="border-border border-t bg-white px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <p className="text-primary mb-2 text-xs font-semibold tracking-widest uppercase">
            Meet your AI video agent
          </p>
          <h2 className="font-display mb-3 text-3xl font-normal tracking-[-1.1px] md:text-4xl">
            Built for internal &amp; corporate comms
          </h2>
          <p className="text-muted-foreground max-w-xl text-sm">
            Designed to turn your internal messages into impactful, on-brand
            videos — faster, easier, at scale.
          </p>
        </div>

        <div className="space-y-4">
          {CARDS.map(({ pill, headline, desc, perfect, tint, flip }) => (
            <div key={pill}
                 className={`border-border grid items-center gap-6 overflow-hidden rounded-2xl border p-6 sm:grid-cols-2 sm:p-8 ${
                   flip ? "sm:[&>*:first-child]:order-2" : ""}`}>
              <div>
                <span className="bg-primary/8 text-primary mb-3 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold">
                  {pill}
                </span>
                <h3 className="mb-2 text-xl font-bold">{headline}</h3>
                <p className="text-muted-foreground mb-3 text-sm leading-relaxed">{desc}</p>
                <p className="text-muted-foreground mb-4 text-sm italic">{perfect}</p>
                <Link href={CTA_HREF}
                   className="text-primary inline-flex items-center gap-1 text-sm font-medium hover:text-[#4d43b8]">
                  See it in action <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
              <div className={`aspect-[4/3] rounded-xl bg-gradient-to-br ${tint}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
