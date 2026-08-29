import { redirect } from "next/navigation";
import { createClient, currentUser } from "@/lib/supabase/server";
import { DashSidebar } from "@/components/dash-sidebar";
import { Toaster } from "@/components/ui/sonner";

// The guard lives here, not in each page: every route under /app is behind it,
// so a page added later cannot forget to check.
export default async function DashLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const db = await createClient();
  const { data: quota } = await db.rpc("my_clip_quota").single();

  return (
    <div className="flex min-h-svh">
      <DashSidebar
        email={user.email ?? ""}
        used={(quota as any)?.used ?? 0}
        allowed={(quota as any)?.allowed ?? 3}
      />
      <div className="min-w-0 flex-1">{children}</div>
      <Toaster />
    </div>
  );
}
