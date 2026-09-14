import { redirect } from "next/navigation";
import { currentUser } from "@/lib/supabase/server";
import { SiteNav } from "@/components/marketing/site-nav";
import { SiteFooter } from "@/components/marketing/site-footer";
import { HomeHero } from "@/components/marketing/home/hero";
import { MeetMira } from "@/components/marketing/home/meet-mira";
import { HomeDepartments } from "@/components/marketing/home/departments";
import { HomeTestimonials } from "@/components/marketing/home/testimonials";
import { HomeCta } from "@/components/marketing/home/cta";

/**
 * Homepage — Figma frame 8:2105, section order as designed:
 * hero -> (trusted-by) -> Meet Mira -> departments -> testimonials -> CTA.
 *
 * The TrustedByLogos band (2:3) is deliberately absent. It reads "Trusted by
 * 300+ top brands" over Siemens, OMV, TUI, Beiersdorf, Montblanc, Vorwerk,
 * REWE and Accenture — none of them customers, and all of them other
 * companies' marks. It goes back in the day there are real logos to put in it.
 */
export default async function Home() {
  const user = await currentUser();
  if (user) redirect("/app");

  return (
    <>
      <SiteNav />
      <HomeHero />
      <MeetMira />
      <HomeDepartments />
      <HomeTestimonials />
      <HomeCta />
      <SiteFooter />
    </>
  );
}
