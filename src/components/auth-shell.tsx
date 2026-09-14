import Link from "next/link";

/**
 * Shared field styling for the auth pages, matching the redesign's rounded-xl
 * inputs. Kept here rather than in a page file: a Next page module should only
 * export its default component and metadata, and importing a constant out of
 * one drags the whole route into the importer's module graph.
 */
export const authField =
  "w-full rounded-xl border border-border bg-white px-4 py-3 text-sm " +
  "placeholder-[#ccc] transition-all focus:border-primary/60 focus:ring-2 " +
  "focus:ring-primary/10 focus:outline-none disabled:opacity-60";

export const authLabel = "mb-1.5 block text-xs font-semibold text-[#444]";

export const authButton =
  "mt-2 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white " +
  "shadow-sm transition-colors hover:bg-[#4d43b8] disabled:opacity-70";

/**
 * The split screen every auth page sits in, ported from the redesign.
 *
 * The left panel is atmosphere and a customer quote; it is hidden below md,
 * where it would push the form off the fold on a phone. The right side is the
 * form, and it is deliberately the only thing that scrolls.
 */
export function AuthShell({ title, subtitle, altHref, altLabel, children }: {
  title: string;
  subtitle: string;
  /** The top-right escape hatch, e.g. "Create account". Optional. */
  altHref?: string;
  altLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh">
      <aside className="relative hidden w-[42%] overflow-hidden bg-[#1a1a1a] md:block">
        {/* A quiet gradient rather than a stock photo: it never looks dated, it
            costs no bytes, and there is no real product screenshot that is
            honest to show here yet. */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#5b4fcf55,transparent_55%),radial-gradient(circle_at_70%_75%,#8b5cf644,transparent_50%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        <div className="absolute top-1/2 right-8 left-8 -translate-y-1/2">
          <p className="text-sm leading-relaxed text-white/70 italic">
            &ldquo;We used to re-run the same briefing four times to cover all
            shifts. Now we record it once and it&apos;s on the floor within an
            hour.&rdquo;
          </p>
          <p className="mt-3 text-xs text-white/40">
            — Safety &amp; Training Lead, multi-site manufacturer
            <span className="ml-1 opacity-70">(illustrative)</span>
          </p>
        </div>

        <div className="absolute bottom-8 left-8 flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg border border-white/20 bg-white/15 text-sm font-bold text-white backdrop-blur-sm">
            C
          </span>
          <span className="text-sm font-semibold text-white">clipworker</span>
        </div>
      </aside>

      <div className="flex flex-1 flex-col bg-white">
        <div className="border-border flex items-center justify-between border-b px-8 py-5">
          <Link href="/" className="flex items-center gap-2">
            <span className="bg-primary grid size-7 place-items-center rounded-lg text-xs font-bold text-white">
              C
            </span>
            <span className="text-sm font-semibold tracking-tight">clipworker</span>
          </Link>
          {altHref && altLabel && (
            <Link href={altHref} className="text-muted-foreground hover:text-foreground text-sm transition-colors">
              {altLabel}
            </Link>
          )}
        </div>

        <div className="flex flex-1 items-center justify-center px-8 py-12">
          <div className="w-full max-w-sm">
            <h1 className="mb-1.5 text-2xl font-bold">{title}</h1>
            <p className="text-muted-foreground mb-8 text-sm">{subtitle}</p>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
