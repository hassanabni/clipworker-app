import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionContainer, SectionHeading } from "./section-container";

const faqs = [
  {
    q: "What happens to the video I upload?",
    a: "It is used to make your clip and then deleted — automatically, as soon as the render finishes, and in any case within 24 hours. Finished clips stay for 30 days so you can download them. Nobody else can see either: your files are stored under your account and the database refuses requests for anyone else's.",
  },
  {
    q: "How long does a clip take?",
    a: "About a minute for a ten-minute source. Most of that is transcribing the whole video, which is what lets you search it instead of scrubbing for the moment. Longer videos take proportionally longer.",
  },
  {
    q: "Do I need to know timestamps?",
    a: "No — that is the point. Type what the clip should be about and the transcript is ranked by meaning to find it. If you would rather set exact times yourself, there is a manual option.",
  },
  {
    q: "What kind of footage works best?",
    a: "Anything with clear speech: podcasts, interviews, talking-head videos, vlogs. One or two people on screen gets face tracking; a crowded panel keeps the full frame, because framing the wrong person is worse than not cropping.",
  },
  {
    q: "Can I use my own music and b-roll?",
    a: "Yes. Add a track and it is level-matched to that clip's dialogue so it sits under the voice. Add a b-roll clip and it is placed where the words match the footage.",
  },
  {
    q: "Who owns the clips?",
    a: "You do. Download them and use them anywhere — there is no watermark.",
  },
];

export function Faq() {
  return (
    <SectionContainer id="faq">
      <SectionHeading kicker="FAQ" title="Questions, answered." />
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
