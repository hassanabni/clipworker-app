import Link from "next/link";
import {
  Megaphone, UsersRound, Video, SlidersHorizontal, ShieldCheck,
  Smartphone, RefreshCw, Clock, Lock,
} from "lucide-react";
import { USE_CASE_LIST } from "@/lib/use-cases";
import { HOME_WHY } from "@/lib/home-content";

/**
 * InteractiveDepartmentSection — Figma node 2:335.
 *
 * Three role cards over the six-card "why" grid. The role cards read from
 * USE_CASE_LIST so the nav, the footer and this section cannot disagree about
 * which use-case pages exist, and the stat chip on each is the design's.
 */
const ROLE_META: Record<string, { icon: React.ElementType; stat: string; statTone: string; foot: string }> = {
  "internal-comms": {
    icon: Megaphone, stat: "4x faster turnaround",
    statTone: "border-[#a7f3d0] bg-[#ecfdf5] text-[#047857]", foot: "Leadership video",
  },
  hr: {
    icon: UsersRound, stat: "100% policy reach",
    statTone: "border-[#c7d2fe] bg-[#eef2ff] text-[#4338ca]", foot: "Bite-sized modules",
  },
  marketing: {
    icon: Video, stat: "5x repurposed assets",
    statTone: "border-[#f5d0fe] bg-[#fdf4ff] text-[#a21caf]", foot: "Social ready",
  },
};

const WHY_ICONS = [SlidersHorizontal, ShieldCheck, Smartphone, RefreshCw, Clock, Lock];

export function HomeDepartments() {
  return (
    <section className="bg-muted px-[24px] py-[96px] md:px-[64px]">
      <div className="mx-auto max-w-[1152px]">
        <div className="mb-[48px] text-center">
          <p className="mb-[8px] text-[12px] leading-[16px] font-semibold tracking-[1.2px] text-[#4f46e5] uppercase">
            clipworker for your team
          </p>
          <h2 className="text-[30px] leading-[1.15] font-extrabold tracking-[-1.1px] text-[#030712] md:text-[38px]">
            Built for the team doing the communicating.
          </h2>
          <p className="mt-[12px] text-[16px] leading-[24px] text-[#4b5563]">
            Comms, HR and Marketing each have different needs. The same agent
            handles all of them.
          </p>
        </div>

        <div className="mb-[80px] grid gap-[24px] md:grid-cols-3">
          {USE_CASE_LIST.map((u) => {
            const m = ROLE_META[u.slug];
            if (!m) return null;
            const Icon = m.icon;
            return (
              <article key={u.slug}
                       className="flex flex-col rounded-[16px] border border-[rgba(229,231,235,0.9)] bg-white p-[24px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-md">
                <div className="mb-[16px] flex items-start justify-between gap-[8px]">
                  <span className="grid size-[38px] place-items-center rounded-[10px] bg-[#eef2ff] text-[#4f46e5]">
                    <Icon className="size-[18px]" />
                  </span>
                  <span className={`rounded-full border px-[10px] py-[4px] text-[12px] font-semibold ${m.statTone}`}>
                    {m.stat}
                  </span>
                </div>
                <h3 className="mb-[8px] text-[19px] font-bold tracking-[-0.4px] text-[#030712]">
                  {u.nav === "Internal Comms" ? "Internal Comms" : u.nav === "HR" ? "HR & Training" : "Marketing"}
                </h3>
                <p className="mb-[20px] text-[14px] leading-[22px] text-[#4b5563]">{u.navDesc}.</p>
                <div className="mt-auto flex items-center justify-between border-t border-[rgba(229,231,235,0.9)] pt-[14px]">
                  <Link href={`/use-cases/${u.slug}`}
                        className="text-[14px] font-semibold text-[#4f46e5] hover:underline">
                    Learn more →
                  </Link>
                  <span className="font-mono text-[12px] text-[#9ca3af]">{m.foot}</span>
                </div>
              </article>
            );
          })}
        </div>

        <h2 className="mb-[32px] text-center text-[28px] leading-[1.2] font-extrabold tracking-[-1px] text-[#030712] md:text-[34px]">
          Why comms teams choose clipworker
        </h2>
        <div className="grid gap-[24px] md:grid-cols-3">
          {HOME_WHY.map((w, i) => {
            const Icon = WHY_ICONS[i] ?? SlidersHorizontal;
            return (
              <div key={w.title}
                   className="rounded-[16px] border border-[rgba(229,231,235,0.9)] bg-white p-[24px]">
                <span className="mb-[14px] grid size-[34px] place-items-center rounded-[9px] bg-[#eef2ff] text-[#4f46e5]">
                  <Icon className="size-[16px]" />
                </span>
                <h3 className="mb-[6px] text-[15px] font-bold text-[#030712]">{w.title}</h3>
                <p className="text-[14px] leading-[22px] text-[#4b5563]">{w.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
