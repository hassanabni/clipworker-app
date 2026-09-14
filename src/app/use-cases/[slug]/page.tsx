import { notFound } from "next/navigation";
import { USE_CASES, USE_CASE_LIST } from "@/lib/use-cases";
import { SiteNav } from "@/components/marketing/site-nav";
import { SiteFooter } from "@/components/marketing/site-footer";
import {
  PageHero, FeatureCard, WorkflowSection, WhyGrid, ContentTypesGrid,
  QuoteGrid, FaqSection, CtaBand,
} from "@/components/marketing/kit";

/**
 * One template, three (so far) sets of words -- which is how the design does
 * it too. Statically generated, so adding an industry page costs a data entry
 * in lib/use-cases and nothing else.
 */
export function generateStaticParams() {
  return USE_CASE_LIST.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const u = USE_CASES[slug];
  return u ? { title: `${u.title} · clipworker`, description: u.sub } : {};
}

export default async function UseCasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const u = USE_CASES[slug];
  if (!u) notFound();

  return (
    <>
      <SiteNav />
      <PageHero pill={u.pill} headline={u.headline} sub={u.sub} />

      <section className="border-border border-t bg-white px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <p className="text-primary mb-2 text-xs font-semibold tracking-widest uppercase">
              Meet your AI video agent
            </p>
            <h2 className="text-3xl font-bold">Built for your use case.</h2>
          </div>
          <FeatureCard pill={u.pill} headline={u.agentTitle} desc={u.agentDesc}
                       perfect={u.agentPerfect} cta="See it in action" gradient="warm" />
        </div>
      </section>

      <WorkflowSection steps={u.workflowSteps} />
      <WhyGrid title={u.whyTitle} items={u.whyItems} onWhite />
      <ContentTypesGrid heading={u.contentTypesHeading} types={u.contentTypes} />
      <QuoteGrid title="What this replaces" quotes={u.quotes} />
      <FaqSection faqs={u.faqs} />
      <CtaBand headline={u.ctaHeadline}
               sub="See it on a real recording. Book a 20-minute walkthrough." />
      <SiteFooter />
    </>
  );
}
