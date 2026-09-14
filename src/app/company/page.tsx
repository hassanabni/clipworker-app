import { SiteNav } from "@/components/marketing/site-nav";
import { SiteFooter } from "@/components/marketing/site-footer";
import { CompanyHero } from "@/components/marketing/company/hero";
import { CompanyStory } from "@/components/marketing/company/story";
import { CompanyValues } from "@/components/marketing/company/values";
import { CompanyLife } from "@/components/marketing/company/life";
import { CompanyTransparency } from "@/components/marketing/company/transparency";
import { CompanyRoles } from "@/components/marketing/company/roles";
import { CompanyFaq, CompanyCta } from "@/components/marketing/company/faq-cta";

export const metadata = {
  title: "Company · clipworker",
  description:
    "Why clipworker exists, how we work, where we actually are, and the roles we're hiring for.",
};

/**
 * The company page, built from Figma file NyNs6o1LFCsKZUyyg2Q0yC, node 2:1631.
 * Section order and node ids are noted on each component.
 */
export default function CompanyPage() {
  return (
    <>
      <SiteNav />
      <CompanyHero />
      <CompanyStory />
      <CompanyValues />
      <CompanyLife />
      <CompanyTransparency />
      <CompanyRoles />
      <CompanyFaq />
      <CompanyCta />
      <SiteFooter />
    </>
  );
}
