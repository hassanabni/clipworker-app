import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionContainer, SectionHeading } from "./section-container";

const faqs = [
  {
    q: "Is our data secure?",
    a: "Clips belong to your workspace, and that isolation is enforced in the database itself rather than in application code — a request for another workspace's clips returns nothing, even if our own API had a bug. Source uploads are deleted as soon as the render finishes and in any case within a day; finished clips expire after 30 days. We hold no security certification: ISO 27001 and formal GDPR attestation are honest future work, not something we claim today.",
  },
  {
    q: "Can we run a pilot before committing?",
    a: "That is how we would prefer to start. Send one real recording — a briefing, a town hall, a training session — and we will set up your workspace and brand kit with you, then show you the clips it produces from your own footage rather than a demo reel.",
  },
  {
    q: "Does this work with Teams, Slack, or Drive?",
    a: "Not as an integration yet. You upload a file and download finished MP4s, which you can post wherever your people already look. Direct integrations are on the list, and which one gets built first will be decided by the first customers who need it, not guessed at.",
  },
  {
    q: "Can different departments have their own branding?",
    a: "One brand kit per workspace today — that is deliberate, because the whole point of the kit is that branding cannot drift between clips or between sites. A company that genuinely needs two identities can have two workspaces. Per-department kits inside one workspace is a real request we would build once a customer needs it.",
  },
  {
    q: "How long does a clip take?",
    a: "About a minute for a ten-minute source. Most of that is transcribing the whole recording, which is what lets you search it by meaning instead of scrubbing for the moment. Longer recordings take proportionally longer.",
  },
  {
    q: "Do we need someone who can edit video?",
    a: "No. Upload the recording and describe the moment you want, or leave it blank and pick from the moments it suggests. The only manual edit after a clip is made is trimming it — branding is applied automatically and is not adjustable per video.",
  },
];

export function Faq() {
  return (
    <SectionContainer id="faq">
      <SectionHeading kicker="FAQ" title="Frequently asked questions" />
      <div className="mx-auto max-w-2xl">
        <Accordion type="single" collapsible>
          {faqs.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </SectionContainer>
  );
}
