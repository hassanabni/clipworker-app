import { SiteNav } from "@/components/marketing/site-nav";
import { SiteFooter } from "@/components/marketing/site-footer";

/**
 * Legal pages sit inside the same public shell as the rest of the site.
 * pt-28 clears the fixed nav -- without it the first heading sits under it.
 */
export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-2xl px-6 pt-28 pb-16">
        <article className="prose-sm space-y-5 text-sm leading-relaxed [&_h2]:mt-8 [&_h2]:text-base [&_h2]:font-medium [&_li]:ml-4 [&_li]:list-disc [&_ul]:space-y-1.5">
          {children}
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
