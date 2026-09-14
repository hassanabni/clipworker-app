import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/contact";
import { USE_CASE_LIST } from "@/lib/use-cases";

/**
 * The public site footer, ported from the redesign.
 *
 * The design's Legal column lists Privacy, Terms and Security. The first two
 * are real pages; there is no security page and no certification to put on one,
 * so that link is a contact address instead of a link to nothing.
 */
export function SiteFooter() {
  return (
    <footer className="border-border border-t bg-white px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="mb-3 flex items-center gap-2">
              <span className="bg-primary grid size-6 place-items-center rounded-md text-[10px] font-bold text-white">
                C
              </span>
              <span className="text-sm font-semibold">clipworker</span>
            </Link>
            <p className="text-xs leading-relaxed text-[#aaa]">
              AI video agent for internal comms teams.
            </p>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold tracking-wider uppercase">Use Cases</p>
            {USE_CASE_LIST.map((u) => (
              <Link key={u.slug} href={`/use-cases/${u.slug}`}
                    className="text-muted-foreground block py-1 text-xs transition-colors hover:text-[#555]">
                {u.nav}
              </Link>
            ))}
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold tracking-wider uppercase">Company</p>
            <Link href="/product" className="text-muted-foreground block py-1 text-xs hover:text-[#555]">
              Product
            </Link>
            <Link href="/company" className="text-muted-foreground block py-1 text-xs hover:text-[#555]">
              About
            </Link>
            <Link href="/pricing" className="text-muted-foreground block py-1 text-xs hover:text-[#555]">
              Pricing
            </Link>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold tracking-wider uppercase">Legal</p>
            <Link href="/privacy" className="text-muted-foreground block py-1 text-xs hover:text-[#555]">
              Privacy
            </Link>
            <Link href="/terms" className="text-muted-foreground block py-1 text-xs hover:text-[#555]">
              Terms
            </Link>
            <Link href="/refunds" className="text-muted-foreground block py-1 text-xs hover:text-[#555]">
              Refunds
            </Link>
            <a href={`mailto:${CONTACT_EMAIL}`}
               className="text-muted-foreground block py-1 text-xs hover:text-[#555]">
              Security questions
            </a>
          </div>
        </div>

        <div className="border-border border-t pt-6">
          <p className="text-xs text-[#bbb]">
            © {new Date().getFullYear()} clipworker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
