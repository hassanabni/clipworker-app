import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { PricingTest } from "./pricing-test";

// Sandbox-only smoke test -- unreachable in production so it's never live on
// the real domain. Vercel sets x-vercel-ip-country in production; it won't be
// present in local dev, which is fine -- PricingTest omits the address param
// entirely in that case and lets Paddle detect location from the visitor's IP.
export default async function PaddleTestPage() {
  if (process.env.NODE_ENV === "production") notFound();
  const h = await headers();
  const country = h.get("x-vercel-ip-country") ?? undefined;
  return <PricingTest country={country} />;
}
