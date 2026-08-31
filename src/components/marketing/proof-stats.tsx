const stats = [
  { n: "~60s", l: "upload to finished clip" },
  { n: "0", l: "timestamps to find" },
  { n: "9:16", l: "cropped and captioned" },
];

export function ProofStats() {
  return (
    <div className="border-y border-border/60 bg-card/30">
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 px-6 py-10 text-center sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.l}>
            <div className="text-3xl font-semibold bg-gradient-to-r from-brand to-brand-2 bg-clip-text text-transparent">
              {s.n}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
