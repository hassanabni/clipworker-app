import { redirect } from "next/navigation";
import { createClient, currentUser } from "@/lib/supabase/server";
import { getOrg } from "@/lib/org";
import { DashSidebar } from "@/components/dash-sidebar";
import { DashHeader } from "@/components/dash-header";
import { Toaster } from "@/components/ui/sonner";
import { CONTACT_EMAIL } from "@/lib/contact";

// The guard lives here, not in each page: every route under /app is behind it,
// so a page added later cannot forget to check.
export default async function DashLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  // Resolved once here and passed down, rather than looked up per page. Without
  // a workspace nothing under /app can work -- every clip is filed against one --
  // so this is a stop, not a warning. The alternative is letting the user reach
  // the upload form and hit a raw database constraint on submit.
  const org = await getOrg();
  if (!org) {
    return (
      <main className="flex min-h-svh items-center justify-center px-6">
        <div className="max-w-md space-y-3 text-center">
          <h1 className="text-xl font-semibold">No workspace yet</h1>
          <p className="text-muted-foreground text-sm">
            Your account isn&apos;t attached to a workspace, so there&apos;s nowhere to
            put your clips. Email{" "}
            <a className="text-brand underline" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>{" "}
            and we&apos;ll sort it out.
          </p>
        </div>
      </main>
    );
  }

  const db = await createClient();
  const { data: quota } = await db.rpc("my_clip_quota").single();

  return (
    // h-svh + an independently scrolling main column, so the dark rail stays put
    // and only the page content moves -- the shell in the redesign is fixed.
    <div className="flex h-svh">
      <DashSidebar
        email={user.email ?? ""}
        orgName={org.name}
        used={(quota as any)?.used ?? 0}
        allowed={(quota as any)?.allowed ?? 3}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashHeader />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
      <Toaster />
    </div>
  );
}
