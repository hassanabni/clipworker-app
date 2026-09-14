"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CTA_HREF, CTA_LABEL } from "@/lib/cta";
import { USE_CASE_LIST } from "@/lib/use-cases";

/**
 * The public site header — Figma node 2:2046.
 *
 * 80px tall, 1280 max width, 48px gutter, translucent #fbf9f5 over a 12px
 * backdrop blur. Nav order and styling are the design's: Product, Agents,
 * Use Cases, Customers, Pricing, then Login and the Request access pill.
 *
 * "Agents" opens the Mira card (2:2065) — the panel the design calls out as
 * "when clicking on product this should appear". It hangs off Agents rather
 * than Product because that is the trigger the Figma wires it to.
 *
 * Two notes on things the design leaves open:
 *  - The logo slot in Figma holds a placeholder image (a thumbnail of the
 *    dropdown itself), not a mark. The existing "C" tile is kept.
 *  - "Customers" has no page in the file. It points at the homepage's
 *    testimonials section rather than a route that does not exist.
 */
const MIRA_POINTS = [
  "Auto-clip long recordings & town halls",
  "Instant brand kit & custom captions",
  "Multi-platform 9:16, 1:1, & 16:9 framing",
];

export function SiteNav() {
  const [agents, setAgents] = useState(false);
  const [cases, setCases] = useState(false);
  const [mobile, setMobile] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (wrap.current && !wrap.current.contains(e.target as Node)) {
        setAgents(false);
        setCases(false);
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") { setAgents(false); setCases(false); }
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
            <Link href="/product" className={navLink}>Product</Link>

            {/* Agents — the Mira card, 2:2065 */}
            <div className="relative">
              <button onClick={() => { setAgents((v) => !v); setCases(false); }}
                      aria-expanded={agents}
                      className="flex items-center gap-[4px] p-[4px] text-[16px] leading-[24px] transition-colors hover:text-primary">
                Agents
                <ChevronDown className={cn("size-3.5 transition-transform", agents && "rotate-180")} />
              </button>
              {agents && (
                <div className="absolute top-full left-0 z-50 mt-[4px] w-[384px] rounded-[12px] bg-[rgba(255,255,255,0.95)] p-[16px] shadow-[0px_20px_40px_-15px_rgba(17,24,39,0.08)] backdrop-blur-[6px]">
                  <Link href="/product" onClick={() => setAgents(false)}
                        className="flex items-start gap-[16px]">
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
                      <span className="flex flex-col gap-[3.5px] pt-[4.6px]">
                        {MIRA_POINTS.map((p) => (
                          <span key={p} className="flex items-center gap-[6px]">
                            <Image src="/figma/icon-check-sm.svg" alt="" width={12} height={12}
                                   className="size-[11.667px] shrink-0" />
                            <span className="text-muted-foreground text-[12px] leading-[16px] font-semibold tracking-[0.24px]">
                              {p}
                            </span>
                          </span>
                        ))}
                      </span>
                    </span>
                  </Link>
                </div>
              )}
            </div>

            {/* Use Cases keeps its own menu — the pages exist and the design's
                flat link would otherwise hide three of them. */}
            <div className="relative">
              <button onClick={() => { setCases((v) => !v); setAgents(false); }}
                      aria-expanded={cases}
                      className={cn(navLink, "flex items-center gap-[4px] p-[4px]")}>
                Use Cases
                <ChevronDown className={cn("size-3.5 transition-transform", cases && "rotate-180")} />
              </button>
              {cases && (
                <div className="border-border absolute top-full left-0 z-50 mt-[4px] min-w-[240px] rounded-[12px] border bg-white py-[8px] shadow-[0px_20px_40px_-15px_rgba(17,24,39,0.08)]">
                  {USE_CASE_LIST.map((u) => (
                    <Link key={u.slug} href={`/use-cases/${u.slug}`} onClick={() => setCases(false)}
                          className="group block px-[16px] py-[10px] transition-colors hover:bg-[#f5f3ef]">
                      <span className="group-hover:text-primary block text-[14px] font-semibold transition-colors">
                        {u.nav}
                      </span>
                      <span className="mt-0.5 block text-[12px] leading-snug text-[#aaa]">
                        {u.navDesc}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/#customers" className={navLink}>Customers</Link>
            <Link href="/pricing" className={navLink}>Pricing</Link>
          </nav>
        </div>

        <div className="hidden items-center gap-[16px] md:flex">
          <Link href="/login" className={navLink}>Login</Link>
          <a href={CTA_HREF}
             className="bg-primary rounded-full px-[16px] py-[8px] text-[14px] leading-[20px] font-semibold tracking-[0.14px] text-white drop-shadow-[0px_0px_12px_rgba(70,72,212,0.25)] transition-opacity hover:opacity-90">
            {CTA_LABEL} ↗
          </a>
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
          <p className="pt-2 pb-1 text-[10px] font-bold tracking-wider text-[#bbb] uppercase">
            Use Cases
          </p>
          {USE_CASE_LIST.map((u) => (
            <Link key={u.slug} href={`/use-cases/${u.slug}`} onClick={() => setMobile(false)}
                  className="text-muted-foreground block py-2 text-sm">{u.nav}</Link>
          ))}
          <div className="border-border my-2 border-t" />
          <Link href="/company" onClick={() => setMobile(false)}
                className="text-muted-foreground block py-2 text-sm">Company</Link>
          <Link href="/pricing" onClick={() => setMobile(false)}
                className="text-muted-foreground block py-2 text-sm">Pricing</Link>
          <Link href="/login" onClick={() => setMobile(false)}
                className="text-muted-foreground block py-2 text-sm">Login</Link>
          <a href={CTA_HREF}
             className="bg-primary mt-1 block w-full rounded-full px-4 py-2.5 text-center text-sm font-semibold text-white">
            {CTA_LABEL}
          </a>
        </div>
      )}
    </header>
  );
}
