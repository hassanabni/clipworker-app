import { createClient } from "@/lib/supabase/server";
import { currentUser } from "@/lib/supabase/server";
import { getOrg } from "@/lib/org";
import { TeamPanel, type Person } from "@/components/team-panel";

export const metadata = { title: "Team · clipworker" };

export default async function TeamPage() {
  // The layout already refuses to render anything under /app without an org, so
  // this cannot be null in practice -- it is read for the name, not as a guard.
  const [org, user, db] = await Promise.all([getOrg(), currentUser(), createClient()]);

  // Fetched here rather than in an effect, the same way /app/brand does it: the
  // page arrives with the team already on it instead of flashing a spinner, and
  // there is no client-side round trip on first paint.
  const [{ data: people }, { data: role }] = await Promise.all([
    db.rpc("team_list"),
    db.rpc("my_org_role"),
  ]);

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Team</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Everyone in {org?.name ?? "this workspace"} shares one brand kit and
          one clip library.
        </p>
      </header>

      <TeamPanel
        initialPeople={(people ?? []) as Person[]}
        myRole={(role as string) ?? "member"}
        myUserId={user?.id ?? ""}
      />
    </main>
  );
}
