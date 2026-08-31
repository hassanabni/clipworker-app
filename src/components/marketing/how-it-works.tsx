import { Card } from "@/components/ui/card";
import { SectionContainer, SectionHeading } from "./section-container";

const steps = [
  {
    n: "01",
    title: "Upload the whole video",
    body: "A podcast, interview or vlog — any length. It gets transcribed end to end.",
  },
  {
    n: "02",
    title: "Describe the moment",
    body: "Type the topic in plain words. The transcript is ranked by meaning, not keywords.",
  },
  {
    n: "03",
    title: "Get a vertical clip",
    body: "Cropped to 9:16 on the speaker, captioned, with your music mixed underneath.",
  },
];

export function HowItWorks() {
  return (
    <SectionContainer id="how">
      <SectionHeading
        kicker="How it works"
        title="Three steps. About a minute."
        subtitle="No timeline, no scrubbing, nothing to learn."
      />
      <div className="grid gap-5 sm:grid-cols-3">
        {steps.map((s) => (
          <Card key={s.n} className="p-6">
            <div className="text-sm font-semibold text-brand">{s.n}</div>
            <h3 className="mt-3 text-lg font-medium">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
          </Card>
        ))}
      </div>
    </SectionContainer>
  );
}
