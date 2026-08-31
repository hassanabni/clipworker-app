import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";
import { SectionContainer, SectionHeading } from "./section-container";

export function ProductDemo() {
  return (
    <SectionContainer>
      <SectionHeading
        kicker="The result"
        title="What comes back looks like this."
        subtitle="A vertical clip that's already reframed, captioned, and scored ready by the same pass that made it."
      />

      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl">
        <div className="flex items-center gap-2 border-b border-border/60 bg-muted/40 px-4 py-3">
          <span className="size-2.5 rounded-full bg-destructive/60" />
          <span className="size-2.5 rounded-full bg-yellow-500/50" />
          <span className="size-2.5 rounded-full bg-green-500/50" />
          <span className="ml-3 truncate rounded-md bg-background/60 px-3 py-1 text-xs text-muted-foreground">
            clipworker.xyz/app
          </span>
        </div>

        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
          <div className="flex aspect-[9/16] w-full max-w-[180px] shrink-0 items-center justify-center rounded-xl border border-dashed border-border bg-background/60 sm:mx-0 mx-auto">
            <div className="flex size-10 items-center justify-center rounded-full bg-brand/15 text-brand">
              <Play className="size-4" fill="currentColor" />
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-brand/30 bg-brand/10 text-brand">
                Auto-reframed 9:16
              </Badge>
              <Badge variant="outline" className="border-brand/30 bg-brand/10 text-brand">
                Captions burned in
              </Badge>
              <Badge variant="outline" className="border-brand/30 bg-brand/10 text-brand">
                Music mixed under dialogue
              </Badge>
            </div>
            <div className="rounded-lg border border-border/60 bg-background/60 p-4 text-sm text-muted-foreground">
              <span className="text-foreground">Moment found:</span> &ldquo;...and that&rsquo;s the
              exact mistake that cost us the client&mdash;&rdquo; ranked #1 of 34 candidate windows for
              the query &ldquo;the mistake that cost us the client.&rdquo;
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
