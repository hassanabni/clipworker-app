import Image from "next/image";

/**
 * Life at clipworker — Figma node 2:1795.
 *
 * The photos AND their captions are the Figma's placeholder content and are
 * meant to be replaced together: swapping an image without its caption leaves
 * "Lisbon Team Walk" sitting under a different picture.
 *
 * The mosaic is the design's exact 4-column / 3-row arrangement: a wide 2-span
 * card, a portrait spanning two rows, a square, a square, and a second wide
 * card. Rows are 220px in Figma; here they are `auto` with fixed aspect boxes
 * so the grid survives a narrower viewport, and the whole thing collapses to
 * two columns below md.
 */
const TILES = [
  { src: "/figma/mosaic-1.jpg", caption: "Lisbon Team Walk • Spring '25", area: "md:col-span-2 md:row-start-1", ratio: "aspect-[580/220]" },
  { src: "/figma/mosaic-2.jpg", caption: "Remote Deep Work", area: "md:col-start-3 md:row-span-2 md:row-start-1", ratio: "aspect-[278/464]" },
  { src: "/figma/mosaic-3.jpg", caption: "Design Jam", area: "md:col-start-4 md:row-start-1", ratio: "aspect-[278/220]" },
  { src: "/figma/mosaic-4.jpg", caption: "Launch Dinner", area: "md:col-start-1 md:row-start-2", ratio: "aspect-[278/220]" },
  { src: "/figma/mosaic-5.jpg", caption: "Heading home • Ready to ship", area: "md:col-span-2 md:col-start-1 md:row-start-3", ratio: "aspect-[580/220]" },
];

export function CompanyLife() {
  return (
    <section className="bg-muted px-[48px] py-[96px]">
      <div className="mx-auto max-w-[1184px]">
        <div className="mb-[40px] max-w-[672px]">
          <p className="text-primary mb-[6.5px] text-[12px] leading-[16px] font-semibold tracking-[1.2px] uppercase">
            Behind the screen
          </p>
          <h2 className="font-display mb-[16px] text-[34px] leading-[1.2] font-normal tracking-[-1.1px] md:text-[44px] md:leading-[52px]">
            Life inside an asynchronous, remote-first team.
          </h2>
          <p className="text-muted-foreground text-[16px] leading-[26px]">
            We work remotely and asynchronously. We value deep work blocks over
            endless meetings, written updates over reactive calls, and
            intentional time together in person to build.
          </p>
        </div>

        {/* Photo Mosaic Grid — 2:1803 */}
        <div className="grid grid-cols-2 gap-[24px] md:grid-cols-4">
          {TILES.map((t) => (
            <figure key={t.src}
                    className={`relative overflow-hidden rounded-[16px] bg-[#e4e2de] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] ${t.area}`}>
              <div className={`relative ${t.ratio} md:h-full md:min-h-[220px]`}>
                <Image src={t.src} alt="" fill sizes="(max-width: 768px) 50vw, 300px"
                       className="object-cover" />
              </div>
              <figcaption className="absolute bottom-[12px] left-[12px] rounded-[6px] bg-[rgba(251,249,245,0.8)] px-[8px] py-[4px] text-[12px] leading-[16px] font-semibold tracking-[0.24px] backdrop-blur-[2px]">
                {t.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
