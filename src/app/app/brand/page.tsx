import { createClient } from "@/lib/supabase/server";
import { presignGet } from "@/lib/r2";
import { BrandKitForm } from "@/components/brand-kit-form";
import { DEFAULT_KIT, type BrandKit } from "@/lib/brand";

export const metadata = { title: "Brand kit · clipworker" };

export default async function BrandPage() {
  const db = await createClient();
  const [{ data }, { data: role }] = await Promise.all([
    db.from("brand_kits").select("*").maybeSingle(),
    db.rpc("my_org_role"),
  ]);
  const kit = data as BrandKit | null;
  // Mirrors the RLS policy in sql/kit_admins.sql. Checked here only so a member
  // is not offered a Save button that the database will refuse -- the policy is
  // what actually enforces it.
  const canEdit = role === "owner" || role === "admin";

  // R2 objects are private, so the browser needs a signed URL to show the mark
  // it is being asked to position.
  let logoSrc: string | null = null;
  if (kit?.logo_url?.startsWith("storage://")) {
    try {
      logoSrc = await presignGet(kit.logo_url.replace("storage://", ""));
    } catch {
      logoSrc = null;   // a missing logo must not take the whole page down
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Brand kit</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Set your logo and caption style once. Every clip picks them up
          automatically — there is nothing to restyle per video.
          {!canEdit && " Only an owner or admin can change it."}
        </p>
      </header>

      <BrandKitForm kit={kit ?? ({ ...DEFAULT_KIT } as BrandKit)} logoSrc={logoSrc}
                    canEdit={canEdit} />
    </main>
  );
}
