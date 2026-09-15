import Image from "next/image";

/**
 * Agent quick identifier sub-bar — Figma node 2:660.
 *
 * The design's right-hand line reads "Syncs with Zoom, Microsoft Teams &
 * Webex". There are no integrations — you upload a file — so it says that.
 */
export function ProductSubbar() {
  return (
    <div className="mt-[80px] bg-[rgba(245,243,239,0.7)] px-[24px] py-[8px] backdrop-blur-[6px] md:px-[48px]">
      <div className="mx-auto flex max-w-[1184px] flex-wrap items-center justify-between gap-[8px]">
        <div className="flex items-center gap-[8px]">
          <span className="grid size-[32px] place-items-center rounded-[8px] bg-[#6063ee] drop-shadow-[0px_0px_7px_rgba(96,99,238,0.4)]">
            <Image src="/figma/icon-aperture-16.svg" alt="" width={16} height={16} className="size-[16px]" />
          </span>
          <span className="flex items-center gap-[4px]">
            <span className="text-[14px] leading-[20px] font-semibold tracking-[0.14px]">Mira</span>
            <span className="text-muted-foreground hidden text-[14px] leading-[22px] sm:inline">
              • Autonomous Comms Video Agent
            </span>
          </span>
          <span className="flex items-center gap-[6px] rounded-full bg-white px-[4px] py-[2px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
            <span className="size-[8px] rounded-full bg-[#10b981]" />
            <span className="text-muted-foreground text-[12px] leading-[16px] font-semibold tracking-[0.24px]">
              Ready on autopilot
            </span>
          </span>
        </div>
        <div className="flex items-center gap-[16px]">
          <span className="text-muted-foreground hidden text-[12px] leading-[16px] font-semibold tracking-[0.24px] md:inline">
            Upload a recording, download finished MP4s
          </span>
          <a href="#capabilities" className="text-primary flex items-center gap-[4px] text-[12px] leading-[16px] font-semibold tracking-[0.24px]">
            Explore pipeline
            <Image src="/figma/icon-arrow-9.svg" alt="" width={9} height={9} className="size-[9.333px]" />
          </a>
        </div>
      </div>
    </div>
  );
}
