import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { CTA_HREF, CTA_LABEL } from "@/lib/cta";

/**
 * The shared marketing sections, ported from the redesign.
 *
 * Every page of the site is assembled from these, which is the point: the
 * design uses one template across Internal Comms, HR and Marketing and changes
 * only the words. Adding an industry page later is a data entry, not a build.
 *
 * Two things from the design are deliberately NOT here:
 *
 * - TrustBar. The mock fills it with Bosch, Siemens, BASF, TUI, REWE and OMV --
 *   those are Cofenster's customers, not ours. Putting them on our own site
 *   claims an endorsement that does not exist and uses other companies' marks
 *   to do it. The site plan in the design folder says the same thing: skip the
 *   section until there are real logos, because an empty one looks worse.
 * - "Trusted by 300+ Teams". There are no customers yet.
 */

export type Quote = { text: string; author: string; role: string };
export type Faq = { q: string; a: string };
export type TitleDesc = { title: string; desc: string };

export const GRADIENTS = {
  warm: "bg-[#1a1a1a] bg-[radial-gradient(circle_at_25%_25%,#5b4fcf,transparent_55%),radial-gradient(circle_at_75%_70%,#e4002b99,transparent_55%)]",
  cool: "bg-[#1a1a1a] bg-[radial-gradient(circle_at_30%_20%,#0b7285,transparent_55%),radial-gradient(circle_at_70%_75%,#5b4fcf,transparent_55%)]",
  forest: "bg-[#1a1a1a] bg-[radial-gradient(circle_at_25%_30%,#0b728599,transparent_55%),radial-gradient(circle_at_75%_70%,#8b5cf6,transparent_55%)]",
} as const;

export type GradientVariant = keyof typeof GRADIENTS;

export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="border-primary/15 bg-primary/8 text-primary inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold">
      {children}
    </span>
  );
}

export function DemoButton({ label = CTA_LABEL, className = "" }:
  { label?: string; className?: string }) {
  return (
    <a href={CTA_HREF}
       className={`bg-primary inline-flex w-fit items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#4d43b8] ${className}`}>
      {label} <ArrowUpRight className="size-4" />
    </a>
  );
}

/** The page hero shared by every use-case and product page. */
export function PageHero({ pill, headline, sub, centered }: {
  pill: string; headline: string; sub: string; centered?: boolean;
}) {
  return (
    <section className={`bg-background px-6 pt-32 pb-16 ${centered ? "text-center" : ""}`}>
      <div className={`max-w-3xl ${centered ? "mx-auto" : "mx-auto"}`}>
        <div className="mb-5 inline-flex"><Pill>{pill}</Pill></div>
        <h1 className="font-display mb-5 text-4xl leading-[1.08] font-normal tracking-[-1.1px] md:text-5xl">
          {headline}
        </h1>
        <p className="text-muted-foreground mb-8 max-w-xl text-base leading-relaxed md:text-lg">
          {sub}
        </p>
        <DemoButton />
      </div>
    </section>
  );
}

export function FeatureCard({ pill, headline, desc, perfect, cta, gradient, flip }: {
  pill: string; headline: string; desc: string; perfect: string;
  cta: string; gradient: GradientVariant; flip?: boolean;
}) {
  return (
    <div className={`border-border grid overflow-hidden rounded-2xl border bg-white ${
      flip ? "md:grid-cols-[38%_62%]" : "md:grid-cols-[62%_38%]"}`}>
      <div className={`flex flex-col gap-5 p-8 md:p-10 ${flip ? "md:order-2" : ""}`}>
        <Pill>{pill}</Pill>
        <div>
          <h3 className="mb-3 text-2xl leading-tight font-bold md:text-[1.6rem]">{headline}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
          <p className="mt-3 text-sm leading-relaxed text-[#aaa] italic">{perfect}</p>
        </div>
        <a href={CTA_HREF}
           className="border-border text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5 flex w-fit items-center gap-2 self-start rounded-full border bg-[#fafaf8] px-4 py-2 text-sm font-medium transition-all">
          {cta} <ArrowRight className="size-3.5" />
        </a>
      </div>
      <div className={`min-h-[260px] md:min-h-0 ${flip ? "md:order-1" : ""} ${GRADIENTS[gradient]}`} />
    </div>
  );
}

export function WorkflowSection({ steps }: { steps: TitleDesc[] }) {
  return (
    <section className="border-border bg-background border-t px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <p className="text-primary mb-2 text-xs font-semibold tracking-widest uppercase">
            How it works
          </p>
          <h2 className="font-display text-3xl font-normal tracking-[-1.1px]">From recording to ready-to-share.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {steps.map((s, i) => (
            <div key={s.title} className="border-border flex gap-4 rounded-2xl border bg-white p-6">
              <span className="bg-primary mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg text-xs font-bold text-white">
                {i + 1}
              </span>
              <div>
                <h3 className="mb-1.5 text-sm font-semibold">{s.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyGrid({ title, items, onWhite }: {
  title: string; items: TitleDesc[]; onWhite?: boolean;
}) {
  return (
    <section className={`border-border border-t px-6 py-24 ${onWhite ? "bg-white" : "bg-background"}`}>
      <div className="mx-auto max-w-5xl">
        <h2 className="font-display mb-12 text-center text-3xl font-normal tracking-[-1.1px] md:text-4xl">{title}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {items.map((item) => (
            <div key={item.title}
                 className={`border-border rounded-2xl border p-6 ${onWhite ? "bg-[#fafaf8]" : "bg-white"}`}>
              <h3 className="mb-2 text-sm font-semibold">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ContentTypesGrid({ heading, types }: {
  heading: string; types: { name: string; desc: string }[];
}) {
  return (
    <section className="border-border border-t bg-white px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <p className="text-primary mb-3 text-xs font-semibold tracking-widest uppercase">
            What you can clip
          </p>
          <h2 className="font-display text-3xl font-normal tracking-[-1.1px]">{heading}</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {types.map((t) => (
            <div key={t.name}
                 className="border-border hover:border-primary/25 rounded-xl border bg-[#fafaf8] p-5 transition-all hover:shadow-sm">
              <span className="bg-primary mb-3 grid size-6 place-items-center rounded-md">
                <Check className="size-3.5 text-white" />
              </span>
              <h3 className="mb-1.5 text-sm font-semibold">{t.name}</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Quotes are illustrative and the page says so, in the design's own words.
 * No invented names, no faces, no company logos -- the role and the industry
 * are as specific as this is allowed to get until a real customer agrees to be
 * quoted.
 */
export function QuoteGrid({ title, quotes }: { title: string; quotes: Quote[] }) {
  return (
    <section className="border-border border-t bg-white px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-display mb-12 text-center text-3xl font-normal tracking-[-1.1px] md:text-4xl">{title}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {quotes.map((q) => (
            <figure key={q.text}
                    className="border-border flex flex-col justify-between gap-6 rounded-2xl border bg-[#fafaf8] p-6">
              <blockquote className="text-sm leading-relaxed text-[#444]">
                &ldquo;{q.text}&rdquo;
              </blockquote>
              <figcaption>
                <p className="text-sm font-semibold">{q.author}</p>
                <p className="mt-0.5 text-xs text-[#aaa]">{q.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-5 text-center text-xs text-[#bbb]">
          Illustrative quotes, written to describe the workflow this replaces —
          not real customers, and not attributed to anyone.
        </p>
      </div>
    </section>
  );
}

export function FaqSection({ faqs }: { faqs: Faq[] }) {
  return (
    <section className="border-border bg-background border-t px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-display mb-8 text-2xl font-normal tracking-[-1.1px]">Frequently asked questions</h2>
        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((f) => (
            <AccordionItem key={f.q} value={f.q}
                           className="border-border rounded-xl border bg-white px-4">
              <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export function CtaBand({ headline, sub }: { headline: string; sub?: string }) {
  return (
    <section className="border-border bg-background border-t px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <div className="border-border rounded-3xl border bg-white p-10 shadow-sm md:p-14">
          <h2 className="font-display mb-4 text-3xl leading-tight font-normal tracking-[-1.1px] md:text-4xl">{headline}</h2>
          {sub && <p className="text-muted-foreground mb-8 text-sm leading-relaxed">{sub}</p>}
          <DemoButton />
          <p className="mt-3 text-xs text-[#bbb]">
            No credit card. 20 minutes. Bring a real recording.
          </p>
        </div>
      </div>
    </section>
  );
}
