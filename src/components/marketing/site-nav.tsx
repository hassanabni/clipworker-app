"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CTA_HREF, CTA_LABEL } from "@/lib/cta";

/**
 * The public site header — Figma node 2:2046.
 *
 * 80px tall, 1280 max width, 48px gutter, translucent #fbf9f5 over a 12px
 * backdrop blur. Nav: Product, Use Cases, Customers, Pricing, then Login and
 * the Request access pill.
 *
 * "Product" opens the Mira card (from 2:2065 — icon, name, "AI Agent" chip and
 * the one-line description; the capability bullets are dropped so the card
 * ends with the description) on hover or click; the card links to /product. There is no
 * separate Agents menu. Use Cases is a single page, so it is a plain link.
 *
 * Two notes on things the design leaves open:
 *  - The logo slot in Figma holds a placeholder image (a thumbnail of the
 *    dropdown itself), not a mark. The existing "C" tile is kept.
 *  - "Customers" has no page in the file. It points at the homepage's
 *    testimonials section rather than a route that does not exist.
 */
export function SiteNav() {
  const [product, setProduct] = useState(false);
  const [mobile, setMobile] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setProduct(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setProduct(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const navLink =
    "text-[14px] leading-[20px] font-semibold tracking-[0.14px] text-muted-foreground transition-colors hover:text-foreground";

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-[rgba(251,249,245,0.9)] shadow-[0px_1px_8px_0px_rgba(0,0,0,0.03)] backdrop-blur-[12px]">
      <div ref={wrap}
           className="mx-auto flex h-[80px] max-w-[1280px] items-center justify-between px-[24px] md:px-[48px]">
        <div className="flex items-center gap-[24px]">
          <Link href="/" className="flex items-center gap-[8px]">
            <span className="bg-primary grid size-[32px] place-items-center rounded-[8px] text-[13px] font-bold text-white">
              C
            </span>
            <span className="text-[20px] leading-[28px] font-semibold tracking-[-0.5px]">
              clipworker
            </span>
          </Link>

          <nav className="hidden items-center gap-[20px] lg:flex">
            {/* Product — the compact Mira card */}
            <div className="relative"
                 onMouseEnter={() => setProduct(true)}
                 onMouseLeave={() => setProduct(false)}>
              <button onClick={() => setProduct((v) => !v)}
                      aria-expanded={product} aria-haspopup="true"
                      className={cn(navLink, "flex items-center gap-[4px] p-[4px]", product && "text-foreground")}>
                Product
                <ChevronDown className={cn("size-3.5 transition-transform", product && "rotate-180")} />
              </button>
              {product && (
                // pt, not mt, so the pointer can cross the gap without closing it
                <div className="absolute top-full left-0 z-50 pt-[4px]">
                  <Link href="/product" onClick={() => setProduct(false)}
                        className="flex w-[384px] items-start gap-[16px] rounded-[12px] bg-[rgba(255,255,255,0.95)] p-[16px] shadow-[0px_20px_40px_-15px_rgba(17,24,39,0.12)] backdrop-blur-[6px] transition-colors hover:bg-white">
                    <span className="grid size-[48px] shrink-0 place-items-center rounded-[8px] bg-[#6063ee] drop-shadow-[0px_0px_10px_rgba(96,99,238,0.35)]">
                      <Image src="/figma/icon-mira-aperture.svg" alt="" width={22} height={19}
                             className="h-[19px] w-[22px]" />
                    </span>
                    <span className="flex flex-col gap-[3.4px]">
                      <span className="flex items-center gap-[4px]">
                        <span className="text-[20px] leading-[28px] font-semibold tracking-[-0.2px]">
                          Mira
                        </span>
                        <span className="rounded-full bg-[#e1e0ff] px-[4px] py-[2px] text-[12px] leading-[16px] font-semibold tracking-[0.24px] text-[#07006c]">
                          AI Agent
                        </span>
                      </span>
                      <span className="text-muted-foreground text-[14px] leading-[19.25px]">
                        Your autonomous AI Video Agent. Automatically turns
                        recordings into on-brand, engaging clips for modern comms
                        teams.
                      </span>
                    </span>
                  </Link>
                </div>
              )}
            </div>

            <Link href="/use-cases" className={navLink}>Use Cases</Link>
            <Link href="/#customers" className={navLink}>Customers</Link>
            <Link href="/pricing" className={navLink}>Pricing</Link>
          </nav>
        </div>

        <div className="hidden items-center gap-[16px] md:flex">
          <Link href="/login" className={navLink}>Login</Link>
          <Link href={CTA_HREF}
                className="bg-primary rounded-full px-[16px] py-[8px] text-[14px] leading-[20px] font-semibold tracking-[0.14px] text-white drop-shadow-[0px_0px_12px_rgba(70,72,212,0.25)] transition-opacity hover:opacity-90">
            {CTA_LABEL} ↗
          </Link>
          <Link href="/company" aria-label="Company"
                className="grid size-[32px] place-items-center rounded-full bg-black transition-opacity hover:opacity-80">
            <Image src="/figma/icon-header-round.svg" alt="" width={12} height={12}
                   className="size-[12px]" />
          </Link>
        </div>

        <button className="text-muted-foreground md:hidden" aria-label="Menu"
                onClick={() => setMobile((v) => !v)}>
          {mobile ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {mobile && (
        <div className="border-border space-y-1 border-t bg-white px-6 py-4 md:hidden">
          <Link href="/product" onClick={() => setMobile(false)}
                className="text-muted-foreground block py-2 text-sm">Product · Mira</Link>
          <Link href="/use-cases" onClick={() => setMobile(false)}
                className="text-muted-foreground block py-2 text-sm">Use Cases</Link>
          <div className="border-border my-2 border-t" />
          <Link href="/company" onClick={() => setMobile(false)}
                className="text-muted-foreground block py-2 text-sm">Company</Link>
          <Link href="/pricing" onClick={() => setMobile(false)}
                className="text-muted-foreground block py-2 text-sm">Pricing</Link>
          <Link href="/login" onClick={() => setMobile(false)}
                className="text-muted-foreground block py-2 text-sm">Login</Link>
          <Link href={CTA_HREF} onClick={() => setMobile(false)}
                className="bg-primary mt-1 block w-full rounded-full px-4 py-2.5 text-center text-sm font-semibold text-white">
            {CTA_LABEL}
          </Link>
        </div>
      )}
    </header>
  );
}
