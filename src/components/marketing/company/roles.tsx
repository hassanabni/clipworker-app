import { CONTACT_EMAIL } from "@/lib/contact";

/**
 * Join the team — Figma node 2:1878.
 *
 * Layout is the design's: the banner box with its blurred orb, then the job
 * list of white 16px-radius rows, then the speculative-application note.
 *
 * The design lists four engineering/design roles. There is one: the sales hire.
 * A careers page that advertises roles nobody is hiring for is the fastest way
 * to lose a candidate's trust, so the list carries the one real opening and the
 * note below invites everyone else — which is what the design's own
 * speculative-application line is for.
 */
const ROLES = [
  {
    title: "Founding Account Executive",
    tag: "Sales",
    blurb:
      "Run discovery calls and live demos with comms, HR and operations leads, and turn early access conversations into our first paying partners. You'll own the pipeline end to end and shape how we sell.",
    where: "Remote",
  },
];

export function CompanyRoles() {
  const applyHref =
    `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Application — Founding Account Executive")}`;

  return (
    <section id="roles" className="bg-muted px-[48px] py-[96px]">
      <div className="mx-auto max-w-[1184px]">
        {/* Banner Box — 2:1880 */}
        <div className="relative overflow-hidden rounded-[16px] bg-white p-[40px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] md:p-[64px]">
          <div aria-hidden
               className="pointer-events-none absolute top-[30px] -right-[120px] size-[384px] rounded-full bg-[rgba(225,224,255,0.55)] blur-[60px]" />
          <div className="relative max-w-[672px]">
            <span className="bg-muted inline-flex rounded-full px-[8px] py-[4px] text-[12px] leading-[16px] font-semibold tracking-[0.24px]">
              We&apos;re hiring • Founding team
            </span>
            <h2 className="font-display mt-[24px] text-[34px] leading-[1.16] font-normal tracking-[-1.1px] md:text-[44px] md:leading-[52px]">
              Join the team. 100% remote, real ownership, high velocity.
            </h2>
            <p className="text-muted-foreground mt-[16px] text-[16px] leading-[26px]">
              We&apos;re searching for autonomous problem solvers who are
              energized by high ambiguity, low politics, and shipping software
              that reshapes how companies communicate on video.
            </p>
          </div>
        </div>

        {/* Job list — 2:1889 */}
        <div className="mt-[24px] flex flex-col gap-[8px]">
          {ROLES.map((r) => (
            <a key={r.title} href={applyHref}
               className="group flex flex-col items-start justify-between gap-[16px] rounded-[16px] bg-white p-[24px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-md md:flex-row md:items-center">
              <div className="flex flex-col gap-[4px]">
                <div className="flex flex-wrap items-center gap-[8px]">
                  <h3 className="text-[20px] leading-[28px] font-semibold tracking-[-0.2px]">
                    {r.title}
                  </h3>
                  <span className="rounded-[4px] bg-[#e1e0ff] px-[4px] py-[2px] text-[12px] leading-[16px] font-semibold tracking-[0.24px] text-[#07006c]">
                    {r.tag}
                  </span>
                </div>
                <p className="text-muted-foreground text-[14px] leading-[22px]">{r.blurb}</p>
              </div>
              <div className="flex shrink-0 items-center gap-[16px]">
                <span className="text-muted-foreground text-[12px] leading-[16px] font-semibold tracking-[0.24px]">
                  {r.where}
                </span>
                <span className="text-primary text-[14px] leading-[20px] font-semibold tracking-[0.14px]">
                  Apply now ↗
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* Speculative Application Note — 2:1946 */}
        <p className="text-muted-foreground mt-[24px] text-center text-[14px] leading-[22px]">
          Don&apos;t see your role? We read every speculative application — tell
          us what you&apos;d own at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </div>
    </section>
  );
}
