import Link from "next/link";
import Image from "next/image";
import { CTA_HREF } from "@/lib/cta";

/** CallToActionBanner — Figma node 2:558. */
export function HomeCta() {
  return (
    <section className="bg-[#fbfbf9] px-[24px] py-[64px] md:px-[120px] lg:px-[216px]">
      <div className="relative w-full overflow-hidden rounded-[24px] border border-[rgba(229,231,235,0.9)] bg-white px-[24px] py-[65px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] md:px-[136px]">
        <div aria-hidden
             className="pointer-events-none absolute -top-[96px] -right-[96px] size-[240px] rounded-full bg-[#f5f3ff] blur-[32px]" />
        <div className="relative mx-auto flex max-w-[576px] flex-col items-center gap-[20px] text-center">
          <h2 className="text-[28px] leading-[1.12] font-extrabold tracking-[-0.9px] text-[#030712] text-balance md:text-[36px] md:leading-[40px]">
            Join the video production revolution with Mira
          </h2>
          <p className="text-[16px] leading-[24px] text-[#4b5563] text-balance">
            Start delivering clear, consistent internal communications from the
            recordings you are already making today.
          </p>
          <Link href={CTA_HREF}
             className="mt-[12px] flex items-center gap-[8px] rounded-full bg-[#4f46e5] px-[32px] py-[14px] text-[14px] leading-[20px] font-medium text-white shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] transition-opacity hover:opacity-90">
            Request access
            <Image src="/figma/icon-arrow-ur-14.svg" alt="" width={14} height={14}
                   className="size-[14px]" />
          </Link>
          <p className="text-[12px] leading-[16px] text-[#9ca3af]">
            No credit card. 20 minutes. Bring a real recording.
          </p>
        </div>
      </div>
    </section>
  );
}
