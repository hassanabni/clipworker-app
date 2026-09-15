import { notFound } from "next/navigation";
import { BrandKitForm } from "@/components/brand-kit-form";
import { CaptionPreview } from "@/components/caption-preview";
import { TrimPanel } from "@/components/trim-panel";
import { ClipForm } from "@/components/clip-form";
import { TeamPanel } from "@/components/team-panel";
import { DEFAULT_KIT, type BrandKit } from "@/lib/brand";
import { CANVASES } from "@/lib/limits";

/**
 * A harness for looking at the B2B pivot UI without a database.
 *
 * The real pages resolve an org and a brand_kits row, neither of which exists
 * until the org migrations are applied. This mounts the same components with
 * mock props so the design can be reviewed first.
 *
 * Dev only, same gate as /paddle-test. Delete this route once the migrations
 * are live and the real pages work.
 */
export const metadata = { title: "UI preview (dev)" };

const MOCK: BrandKit = {
  ...DEFAULT_KIT,
  org_id: "00000000-0000-0000-0000-000000000000",
  logo_url: "storage://brands/demo/logo.png",
  caption_highlight: "#FED732",
  locked: false,
  version: 1,
};

export default function DevPreview() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="mx-auto w-full max-w-6xl space-y-12 px-6 py-10">
      <header className="space-y-2">
        <p className="text-brand font-mono text-xs tracking-wide uppercase">
          Dev preview
        </p>
        <h1 className="text-2xl font-semibold">B2B pivot UI</h1>
        <p className="text-muted-foreground max-w-2xl text-sm">
          The same components the real pages use, mounted with mock data. Saving
          and trimming both hit APIs that need the org migrations applied, so
          those buttons will error — everything visual is real.
        </p>
      </header>

      <Section
        title="Caption preview, all four ratios"
        note="Drawn from the same geometry rule the renderer uses. Note the 16:9 frame: bigger relative text, sitting near the bottom edge rather than a quarter of the way up, and filling the line instead of stacking four words down the middle.">
        <div className="flex flex-wrap items-end gap-6">
          {CANVASES.map((c) => (
            <div key={c} className="space-y-2">
              <CaptionPreview kit={MOCK} canvas={c} />
              <p className="text-muted-foreground text-center font-mono text-xs">{c}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="New clip"
        note="The upload form as it appears on /app/new. Submitting needs a signed-in workspace.">
        <ClipForm used={0} allowed={100} />
      </Section>

      <Section
        title="Team"
        note="As an owner: your own row cannot be removed, everyone else's can.">
        <div className="max-w-3xl">
          <TeamPanel myRole="owner" myUserId="u1" initialPeople={[
            { user_id: "u1", email: "owner@company.com", role: "owner", joined: true, created_at: "2026-09-01T00:00:00Z" },
            { user_id: "u2", email: "comms.lead@company.com", role: "admin", joined: true, created_at: "2026-09-05T00:00:00Z" },
            { user_id: null, email: "new.hire@company.com", role: "member", joined: false, created_at: "2026-09-12T00:00:00Z" },
          ]} />
        </div>
      </Section>

      <Section
        title="Brand kit"
        note="The one-time setup. Colours, font, logo placement, and the default ratio; the preview on the right tracks every change.">
        <BrandKitForm kit={MOCK} />
      </Section>


      <Section
        title="Trim"
        note="Cut-inward only, by design — the trim re-cuts the finished clip because the original upload is deleted once a render succeeds. Drag a handle and it seeks; the selection loops while you adjust it.">
        <TrimPanel jobId="00000000-0000-0000-0000-000000000001"
                   canvas="9:16" playUrl="/dev-sample.mp4" />
      </Section>
    </main>
  );
}

function Section({ title, note, children }:
  { title: string; note: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 border-t pt-8">
      <div className="space-y-1">
        <h2 className="text-lg font-medium">{title}</h2>
        <p className="text-muted-foreground max-w-3xl text-sm">{note}</p>
      </div>
      {children}
    </section>
  );
}
