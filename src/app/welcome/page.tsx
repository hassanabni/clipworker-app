import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";

// Success redirect target for the Paddle sandbox test checkout
// (src/app/paddle-test). Not part of the real signup/upgrade flow --
// unreachable in production along with it.
export default function WelcomePage() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold">Checkout complete</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        This confirms the Paddle checkout redirect works end to end. It&rsquo;s a
        sandbox test purchase and grants no real Pro access.
      </p>
      <Button asChild><Link href="/app">Go to the app</Link></Button>
    </main>
  );
}
