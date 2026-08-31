import Link from "next/link";
import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { plans } from "@/lib/pricing-plans";
import { SectionContainer, SectionHeading } from "./section-container";

export function PricingTeaser() {
  return (
    <SectionContainer>
      <SectionHeading
        kicker="Pricing"
        title="Start free. Upgrade when you need the volume."
      />

      <div className="mx-auto grid max-w-2xl gap-5 sm:grid-cols-2">
        <Card className="p-2">
          <CardHeader>
            <CardTitle className="text-base font-medium">{plans.free.name}</CardTitle>
            <div className="text-3xl font-semibold">{plans.free.price}</div>
            <CardDescription>{plans.free.tagline}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {plans.free.features.slice(0, 3).map((f) => (
                <li key={f} className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  {f}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-brand/40 p-2">
          <CardHeader>
            <CardTitle className="text-base font-medium">{plans.pro.name}</CardTitle>
            <div className="text-3xl font-semibold">
              {plans.pro.price}
              <span className="text-base font-normal text-muted-foreground">{plans.pro.period}</span>
            </div>
            <CardDescription>{plans.pro.tagline}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {plans.pro.features.slice(0, 3).map((f) => (
                <li key={f} className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                  {f}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <Button variant="link" asChild>
          <Link href="/pricing">See full pricing →</Link>
        </Button>
      </div>
    </SectionContainer>
  );
}
