import { cn } from "@/lib/utils";

export function SectionContainer({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("mx-auto w-full max-w-6xl px-6 py-20 sm:py-28", className)}>
      {children}
    </section>
  );
}

export function SectionHeading({
  kicker,
  title,
  subtitle,
  className,
}: {
  kicker?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto mb-14 max-w-2xl text-center", className)}>
      {kicker && (
        <div className="mb-3 text-xs font-semibold tracking-widest text-brand uppercase">
          {kicker}
        </div>
      )}
      <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base text-muted-foreground text-balance">{subtitle}</p>
      )}
    </div>
  );
}
