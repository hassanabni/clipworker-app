import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionContainer, SectionHeading } from "./section-container";

const rows = [
  { label: "Finding the moment", diy: "Scrub the whole video", cw: "Type what it's about" },
  { label: "Reframing to 9:16", diy: "Manually crop every scene", cw: "Tracks the speaker automatically" },
  { label: "Captions", diy: "Type and time them by hand", cw: "Burned in, word by word" },
  { label: "B-roll and music", diy: "Cut and level-match yourself", cw: "Placed and mixed for you" },
  { label: "Time per clip", diy: "30–60 minutes", cw: "About a minute" },
  { label: "Software needed", diy: "An editing timeline", cw: "None" },
];

export function ComparisonTable() {
  return (
    <SectionContainer>
      <SectionHeading
        title="Editing it yourself takes an evening. This takes a minute."
        subtitle="The same clip, two ways."
      />

      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-border/60">
        <div className="grid grid-cols-[1.2fr_1fr_1fr] bg-muted/40 text-sm font-medium">
          <div className="px-4 py-3" />
          <div className="px-4 py-3 text-muted-foreground">Doing it yourself</div>
          <div className="px-4 py-3 text-brand">clipworker</div>
        </div>
        {rows.map((r, i) => (
          <div
            key={r.label}
            className={cn(
              "grid grid-cols-[1.2fr_1fr_1fr] items-center text-sm",
              i !== rows.length - 1 && "border-b border-border/60"
            )}
          >
            <div className="px-4 py-3 font-medium">{r.label}</div>
            <div className="flex items-center gap-2 px-4 py-3 text-muted-foreground">
              <X className="size-4 shrink-0 text-muted-foreground/60" />
              {r.diy}
            </div>
            <div className="flex items-center gap-2 px-4 py-3 text-foreground">
              <Check className="size-4 shrink-0 text-brand" />
              {r.cw}
            </div>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
