import { SiteNav } from "@/components/marketing/site-nav";
import { SiteFooter } from "@/components/marketing/site-footer";
import { ProductHero } from "@/components/marketing/product/hero";
import {
  ProductChallenge, ProductCapabilities, ProductGrid,
  ProductSpotlight, ProductQuotes, ProductCta,
} from "@/components/marketing/product/sections";

export const metadata = {
  title: "Mira · clipworker",
  description:
    "Mira turns hour-long town halls, briefings and interviews into short, on-brand, captioned clips — on autopilot.",
};

/** Product page — Figma frame 8:2106 (Main 2:658). */
export default function ProductPage() {
  return (
    <>
      <SiteNav />
      <ProductHero />
      <ProductChallenge />
      <ProductCapabilities />
      <ProductGrid />
      <ProductSpotlight />
      <ProductQuotes />
      <ProductCta />
      <SiteFooter />
    </>
  );
}
