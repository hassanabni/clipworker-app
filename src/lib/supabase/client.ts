import { createBrowserClient } from "@supabase/ssr";

// Browser client. Uses the PUBLISHABLE key, which is safe to ship -- it can
// only ever do what Row Level Security allows for the signed-in user.
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
