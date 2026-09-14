import Link from "next/link";
import { PlayCircle, Plus } from "lucide-react";

/** First-run state for the clip library, ported from the redesign. */
export function ClipsEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="bg-muted mb-4 grid size-16 place-items-center rounded-2xl">
        <PlayCircle className="text-primary/60 size-7" />
      </div>
      <h3 className="mb-1 text-base font-semibold">No clips yet</h3>
      <p className="text-muted-foreground mb-6 max-w-xs text-sm">
        Upload a video and the AI will find your best moments automatically.
      </p>
      <Link href="/app/new"
            className="bg-primary hover:bg-primary/90 flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors">
        <Plus className="size-4" />
        Create your first clip
      </Link>
    </div>
  );
}
