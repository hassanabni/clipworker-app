import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionContainer, SectionHeading } from "./section-container";

const rows = [
  {
    title: "Captions people actually read",
    body: "Word-by-word karaoke highlighting, sized and placed for a phone screen, timed off the transcript rather than guessed.",
    bullets: [
      "Cards break on punctuation, never mid-word",
      "Never two captions stacked on screen at once",
      "Swearing is your call, not ours",
    ],
  },
  {
    title: "B-roll that matches the line",
    body: "Your cutaway lands on the moment it illustrates — the car shot on the sentence about the car, not three seconds in because that was the default.",
    bullets: [
      "Placed where the words match the footage",
      "Clips with their own burned-in captions are skipped",
      "Letterboxing and HDR handled automatically",
    ],
  },
  {
    title: "Framing that follows the talker",
    body: "The crop tracks whoever is speaking, not whoever is closest to the camera. On a busy panel it shows the whole room rather than confidently picking wrong.",
    bullets: [
      "Smooth pans, no jitter on a still speaker",
      "Snaps at cuts instead of sliding across the room",
      "Falls back to full frame when it cannot be sure",
    ],
  },
];

// Real screenshots are on the list -- placeholder art for now so the dark
// theme doesn't clash with stills shot against the old light UI.
function ArtPlaceholder() {
  return (
    <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 text-sm text-muted-foreground">
      Screenshot coming soon
    </div>
  );
}

export function FeatureRows() {
  return (
    <SectionContainer id="features">
      <SectionHeading
        kicker="The details"
        title="Built the way an editor would do it."
        subtitle="The small decisions that separate a clip people watch from one they scroll past."
      />

      <div className="flex flex-col gap-16">
        {rows.map((row, i) => (
          <div
            key={row.title}
            className={cn(
              "grid items-center gap-10 sm:grid-cols-2",
              i % 2 === 1 && "sm:[&>*:first-child]:order-2"
            )}
          >
            <div>
              <h3 className="text-xl font-medium">{row.title}</h3>
              <p className="mt-3 text-muted-foreground">{row.body}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {row.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <ArtPlaceholder />
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
