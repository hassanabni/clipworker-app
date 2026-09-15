import { redirect } from "next/navigation";

/**
 * The three per-department pages were folded into /use-cases, where Internal
 * Comms, HR and Marketing sit on one page. Old links land on the matching
 * section instead of a 404.
 */
export default async function UseCaseRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/use-cases#${encodeURIComponent(slug)}`);
}
