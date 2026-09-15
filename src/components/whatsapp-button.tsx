import { WHATSAPP_DISPLAY, WHATSAPP_URL } from "@/lib/contact";

/**
 * Floating WhatsApp support button, bottom-right on every page.
 *
 * A plain wa.me link: opens the WhatsApp app on a phone and WhatsApp Web on a
 * desktop, with no script or widget to load. z-40 keeps it under the sticky
 * header's menus (z-50) and under toasts.
 */
export function WhatsAppButton() {
  return (
    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
       aria-label={`Contact us on WhatsApp, ${WHATSAPP_DISPLAY}`}
       title={`WhatsApp us · ${WHATSAPP_DISPLAY}`}
       className="fixed right-[16px] bottom-[16px] z-40 grid size-[52px] place-items-center rounded-full bg-[#25d366] text-white shadow-[0px_10px_25px_-5px_rgba(37,211,102,0.5)] transition-transform hover:scale-105 focus-visible:ring-4 focus-visible:ring-[#25d366]/40 focus-visible:outline-none md:right-[24px] md:bottom-[24px]">
      <svg viewBox="0 0 32 32" aria-hidden className="size-[28px]" fill="currentColor">
        <path d="M16.004 3.2C8.94 3.2 3.2 8.94 3.2 16c0 2.26.59 4.47 1.72 6.42L3.1 28.8l6.55-1.72A12.77 12.77 0 0 0 16 28.8h.005C23.06 28.8 28.8 23.06 28.8 16S23.07 3.2 16.004 3.2Zm0 23.44h-.004c-1.9 0-3.77-.51-5.4-1.48l-.39-.23-3.89 1.02 1.04-3.79-.25-.39A10.6 10.6 0 0 1 5.36 16c0-5.87 4.78-10.64 10.65-10.64 2.84 0 5.51 1.11 7.52 3.12a10.57 10.57 0 0 1 3.11 7.53c0 5.87-4.78 10.63-10.64 10.63Zm5.83-7.97c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.72.16-.21.32-.82 1.04-1.01 1.25-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.73-.98-2.37-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.66 0 1.57 1.14 3.09 1.3 3.3.16.21 2.25 3.43 5.44 4.81.76.33 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.89-.77 2.15-1.52.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37Z" />
      </svg>
    </a>
  );
}
