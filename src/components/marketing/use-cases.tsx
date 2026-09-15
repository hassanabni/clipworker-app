import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { USE_CASE_LIST } from "@/lib/use-cases";

/**
 * "Built for the team doing the communicating." — the use-case links on the
 * home page, ported from the redesign.
 *
 * Reads the same list the nav and footer read, so there is exactly one place
 * that decides which use-case pages exist. The site plan in the design folder
 * argues these should eventually be INDUSTRIES (Manufacturing, Healthcare,
 * BPO, Logistics) rather than job functions, on the grounds that a plant
 * manager identifies as a manufacturer rather than as "an HR team". That change
 * is now an entry in lib/use-cases.ts and nothing else.
 */
export function UseCases() {
  return (
    <section className="border-border bg-background border-t px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <p className="text-primary mb-2 text-xs font-semibold tracking-widest uppercase">
            Mira Use Cases
          </p>
          <h2 className="font-display mb-2 text-3xl font-normal tracking-[-1.1px]">
            Built for the team doing the communicating.
          </h2>
          <p className="text-muted-foreground text-sm">
            Comms, HR and Marketing each have different needs. The same agent
            handles all of them.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {USE_CASE_LIST.map((u) => (
            <Link key={u.slug} href={`/use-cases#${u.slug}`}
                  className="border-border group hover:border-primary/30 rounded-2xl border bg-white p-6 transition-all hover:shadow-sm">
              <div className="group-hover:text-primary mb-2 text-base font-semibold transition-colors">
                {u.nav}
              </div>
              <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                {u.navDesc}
              </p>
              <span className="text-primary inline-flex items-center gap-1.5 text-sm font-medium">
                Learn more
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
