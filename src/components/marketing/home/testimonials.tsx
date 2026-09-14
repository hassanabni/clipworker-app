import { Star } from "lucide-react";
import { HOME_QUOTES } from "@/lib/home-content";

/**
 * TestimonialsSection — Figma node 2:457.
 *
 * The card design is the Figma's: five stars, a stat chip, a bold headline
 * quote, a supporting quote, then an attribution row with an avatar.
 *
 * The CONTENT is not. The mock names three real people at three real companies
 * — Mimi Carlotta Rietzel at TUI, Franziska Dahl at Montblanc, Simone Teufel at
 * Accenture — with those companies' wordmarks beside them. Those are
 * Cofenster's published customer quotes, carried over with the research. Naming
 * identifiable people as customers of a product they have never used is not a
 * placeholder, so this ships the illustrative quotes instead, unattributed, and
 * says so under the grid. Swap them the day a real customer agrees to be named.
 */
const STATS = ["14 Locations", "4x Output", "Zero Expertise Req."];

const SUPPORTING = [
  "The ability to turn monthly briefings into punchy clips not only doubled engagement, it meant site workers actually saw leadership updates.",
  "By quickly extracting key takeaways with Mira, updates reach factory personnel within an hour of the town hall finishing.",
  "No video editing expertise is required in the department. Mira handles framing, brand font inheritance and audio levelling.",
];

export function HomeTestimonials() {
  return (
    <section id="customers" className="bg-[#fbfbf9] px-[24px] py-[96px] md:px-[64px]">
      <div className="mx-auto max-w-[1152px]">
        <div className="mb-[48px] text-center">
          <h2 className="text-[30px] leading-[1.15] font-extrabold tracking-[-1.1px] text-[#030712] md:text-[38px]">
            What this replaces
          </h2>
          <p className="mt-[12px] text-[16px] leading-[24px] text-[#4b5563]">
            How communications leaders would scale output with clipworker.
          </p>
        </div>

        <div className="grid gap-[24px] md:grid-cols-3">
          {HOME_QUOTES.map((q, i) => (
            <figure key={q.text}
                    className="flex flex-col rounded-[16px] border border-[rgba(229,231,235,0.9)] bg-white p-[24px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)]">
              <div className="mb-[16px] flex items-center justify-between gap-[8px]">
                <span className="flex gap-[2px]">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="size-[14px] fill-[#fbbf24] text-[#fbbf24]" />
                  ))}
                </span>
                <span className="rounded-full bg-[#eef2ff] px-[10px] py-[3px] font-mono text-[11px] text-[#4338ca]">
                  {STATS[i]}
                </span>
              </div>

              <blockquote className="mb-[12px] text-[17px] leading-[25px] font-bold tracking-[-0.3px] text-[#030712]">
                &ldquo;{q.text}&rdquo;
              </blockquote>
              <p className="mb-[20px] text-[14px] leading-[22px] text-[#4b5563]">
                &ldquo;{SUPPORTING[i]}&rdquo;
              </p>

              <figcaption className="mt-auto flex items-center gap-[12px] border-t border-[rgba(229,231,235,0.9)] pt-[16px]">
                <span className="grid size-[36px] shrink-0 place-items-center rounded-full bg-[#eef2ff] text-[12px] font-bold text-[#4338ca]">
                  {q.author.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()}
                </span>
                <span>
                  <span className="block text-[14px] font-bold text-[#030712]">{q.author}</span>
                  <span className="block text-[13px] text-[#6b7280]">{q.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-[24px] text-center text-[12px] text-[#9ca3af]">
          Illustrative quotes describing the workflow clipworker replaces — role
          and industry only, not real customers and not attributed to anyone.
        </p>
      </div>
    </section>
  );
}
