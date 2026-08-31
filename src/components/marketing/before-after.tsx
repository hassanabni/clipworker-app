import { Play } from "lucide-react";
import { SectionContainer, SectionHeading } from "./section-container";

// Placeholders until real before/after renders are supplied.
// Swap each box's contents for a <video> element pointing at the real file
// (keep the aspect-ratio wrapper so the layout doesn't shift).
function VideoPlaceholder({ label, aspect }: { label: string; aspect: string }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`flex w-full ${aspect} items-center justify-center rounded-2xl border border-dashed border-border bg-card/40`}
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <div className="flex size-12 items-center justify-center rounded-full bg-brand/15 text-brand">
            <Play className="size-5" fill="currentColor" />
          </div>
          <span className="text-sm">Video coming soon</span>
        </div>
      </div>
      <div className="mt-4 text-sm font-medium text-muted-foreground">{label}</div>
    </div>
  );
}

export function BeforeAfter() {
  return (
    <SectionContainer>
      <SectionHeading
        kicker="See it in action"
        title="The same footage, before and after."
        subtitle="Raw upload on the left. What you get back on the right — reframed, captioned, ready to post."
      />
      <div className="mx-auto grid max-w-3xl grid-cols-1 items-end gap-8 sm:grid-cols-[1.4fr_1fr]">
        <VideoPlaceholder label="Before — raw upload" aspect="aspect-video" />
        <VideoPlaceholder label="After — finished clip" aspect="aspect-[9/16] max-w-[220px] mx-auto" />
      </div>
    </SectionContainer>
  );
}
