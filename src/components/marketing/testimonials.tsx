import { Card } from "@/components/ui/card";
import { SectionContainer, SectionHeading } from "./section-container";

// Illustrative quotes, not attributed to real people -- role/context only,
// no invented names or photos. Replace with real feedback once it exists.
const quotes = [
  {
    quote:
      "I used to spend an hour syncing captions by hand for every episode. Now it's done before I've finished my coffee.",
    who: "Podcast creator, clips for TikTok",
  },
  {
    quote:
      "I don't scrub for timestamps anymore. I just type what the clip should be about and it finds it.",
    who: "YouTube creator, clips for Shorts",
  },
  {
    quote:
      "The crop actually follows whoever's talking instead of just centering the frame. That alone saved me from re-editing every panel episode.",
    who: "Interview host, clips for Reels",
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
