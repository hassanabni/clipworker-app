import {
  Sparkles, Palette, Users, Radio, Clock, ShieldCheck,
} from "lucide-react";

/**
 * The six-block benefit grid from the redesign.
 *
 * The design's "Secure" block is the one that needed writing rather than
 * copying: the site plan leaves it as "[your data handling policy, once
 * decided]". What is written below is only what is actually true of the build
 * today -- org-scoped row level security, private storage, and clips that
 * expire -- and it deliberately claims no certification, because there is none.
 */
const ITEMS = [
  { icon: Sparkles, title: "No video team needed",
    body: "A safety lead or a shift supervisor can do this themselves. Upload, describe the moment, get a clip." },
  { icon: Palette, title: "On-brand, every site",
    body: "One brand kit for the workspace, applied automatically — whether it is plant A or plant C." },
  { icon: Radio, title: "Reaches the floor",
    body: "Vertical, captioned, and short enough to watch on a phone between shifts, with the sound off." },
  { icon: Users, title: "Consistent across shifts",
    body: "Every shift sees the same message the same way, instead of a briefing re-run four times." },
  { icon: Clock, title: "Faster than re-briefing live",
    body: "One recording becomes several clips in minutes, not another hour of everyone's day." },
  { icon: ShieldCheck, title: "Your workspace, walled off",
    body: "Clips belong to your workspace and are isolated in the database itself. Storage is private and links expire." },
];

export function WhyGrid() {
  return (
    <section className="border-border border-t bg-white px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-display mb-10 text-center text-3xl font-normal tracking-[-1.1px]">
          Why comms teams choose clipworker
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map(({ icon: Icon, title, body }) => (
            <div key={title}>
              <span className="bg-primary/8 text-primary mb-3 grid size-10 place-items-center rounded-xl">
                <Icon className="size-5" />
              </span>
              <h3 className="mb-1.5 text-sm font-semibold">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
