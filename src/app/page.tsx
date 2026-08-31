import { redirect } from "next/navigation";
import { currentUser } from "@/lib/supabase/server";
import { SiteNav } from "@/components/marketing/site-nav";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Hero } from "@/components/marketing/hero";
import { ProofStats } from "@/components/marketing/proof-stats";
import { BeforeAfter } from "@/components/marketing/before-after";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { ProductDemo } from "@/components/marketing/product-demo";
import { FeatureRows } from "@/components/marketing/feature-rows";
import { Testimonials } from "@/components/marketing/testimonials";
import { ComparisonTable } from "@/components/marketing/comparison-table";
import { PricingTeaser } from "@/components/marketing/pricing-teaser";
import { Faq } from "@/components/marketing/faq";
import { CtaBand } from "@/components/marketing/cta-band";

export default async function Home() {
  const user = await currentUser();
  if (user) redirect("/app");

  return (
    <>
      <SiteNav />
      <Hero />
      <ProofStats />
      <BeforeAfter />
      <HowItWorks />
      <ProductDemo />
      <FeatureRows />
      <Testimonials />
      <ComparisonTable />
      <PricingTeaser />
      <Faq />
      <CtaBand />
      <SiteFooter />
    </>
  );
}
