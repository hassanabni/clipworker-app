import Link from "next/link";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/" className="mb-10 flex items-center gap-2 font-semibold">
        <img src="/logo.png" alt="" width={24} height={24} className="rounded-md" />
        Clip Worker
      </Link>
      <article className="prose-sm space-y-5 text-sm leading-relaxed [&_h2]:mt-8 [&_h2]:text-base [&_h2]:font-medium [&_li]:ml-4 [&_li]:list-disc [&_ul]:space-y-1.5">
        {children}
      </article>
      <footer className="mt-14 flex gap-5 border-t pt-6 text-xs text-muted-foreground">
        <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
        <Link href="/terms" className="hover:text-foreground">Terms</Link>
        <Link href="/refunds" className="hover:text-foreground">Refunds</Link>
      </footer>
    </main>
  );
}
