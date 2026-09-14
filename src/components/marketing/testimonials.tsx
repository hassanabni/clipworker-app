import { Card } from "@/components/ui/card";
import { SectionContainer, SectionHeading } from "./section-container";

// Illustrative quotes, NOT attributed to real people -- role and industry only,
// no invented names, faces or company logos, and the section says so on the page.
// The redesign's version of this section is headed "Real Results from Real Comms
// Teams" over a carousel of photographed customers; there are no customers yet,
// so that heading would be a straightforward lie. Replace all of this the day a
// real one says something quotable.
const quotes = [
  {
    quote:
      "We used to re-run the same briefing four times to cover all shifts. Now we record it once and it's on the floor within an hour.",
    who: "Safety & training lead, multi-site manufacturer",
  },
  {
    quote:
      "Our people don't check email. A ninety-second captioned clip on the break room screen actually gets watched.",
    who: "Internal comms manager, logistics",
  },
  {
    quote:
      "Every site used to make its own version of the same update. Now they all come out looking like us.",
    who: "L&D manager, healthcare network",
  },
];

export function Testimonials() {
  return (
    <SectionContainer>
      <SectionHeading
        kicker="Early feedback"
        title="What it's like to use."
        subtitle="Illustrative feedback from the kind of workflow this replaces — not verified reviews."
      />
      <div className="grid gap-5 sm:grid-cols-3">
        {quotes.map((q) => (
          <Card key={q.who} className="p-6">
            <p className="text-sm text-foreground">&ldquo;{q.quote}&rdquo;</p>
            <p className="mt-4 text-xs text-muted-foreground">— {q.who}</p>
          </Card>
        ))}
      </div>
    </SectionContainer>
  );
}
