import type { Faq, Quote, TitleDesc } from "@/components/marketing/kit";

/**
 * Copy for the home page, kept beside the use-case copy rather than inline in
 * the component, so the whole site's wording can be read in two files.
 */

export const HOME_WHY: TitleDesc[] = [
  { title: "No video team needed",
    desc: "A safety lead or a shift supervisor can do this themselves. Upload, describe the moment, get a clip." },
  { title: "On-brand, every site",
    desc: "One brand kit for the workspace, applied automatically — whether it is plant A or plant C." },
  { title: "Reaches the floor",
    desc: "Vertical, captioned and short enough to watch on a phone between shifts, with the sound off." },
  { title: "Consistent across shifts",
    desc: "Every shift sees the same message the same way, instead of a briefing re-run four times." },
  { title: "Faster than re-briefing live",
    desc: "One recording becomes several clips in minutes, not another hour of everyone's day." },
  { title: "Your workspace, walled off",
    desc: "Clips belong to your workspace and that isolation is enforced in the database itself. Storage is private and links expire." },
];

export const HOME_QUOTES: Quote[] = [
  { text: "We used to re-run the same briefing four times to cover all shifts. Now we record it once and it's on the floor within an hour.",
    author: "Safety and training lead", role: "Multi-site manufacturer" },
  { text: "Our people don't check email. A ninety-second captioned clip on the break room screen actually gets watched.",
    author: "Internal comms manager", role: "Logistics" },
  { text: "Every site used to make its own version of the same update. Now they all come out looking like us.",
    author: "L&D manager", role: "Healthcare network" },
];

export const HOME_FAQS: Faq[] = [
  { q: "Is our data secure?",
    a: "Clips belong to your workspace, and that isolation is enforced in the database rather than in application code — a request for another workspace's clips returns nothing even if our own API had a bug. Source uploads are deleted as soon as the render finishes and in any case within a day; finished clips expire after 30 days. We hold no security certification: ISO 27001 and formal GDPR attestation are honest future work, not something we claim today." },
  { q: "Can we run a pilot before committing?",
    a: "That is how we would prefer to start. Send one real recording — a briefing, a town hall, a training session — and we will set up your workspace and brand kit with you, then show you the clips it produces from your own footage rather than a demo reel." },
  { q: "Does this work with Teams, Slack, or Drive?",
    a: "Not as an integration yet. You upload a file and download finished MP4s, which you can post wherever your people already look. Which integration gets built first will be decided by the first customers who need it, not guessed at." },
  { q: "Can different departments have their own branding?",
    a: "One brand kit per workspace, deliberately — the point of the kit is that branding cannot drift between clips or sites. A company that genuinely needs two identities can be set up with two workspaces." },
  { q: "How long does a clip take?",
    a: "About a minute for a ten-minute source. Most of that is transcribing the whole recording, which is what lets you search it by meaning instead of scrubbing for the moment." },
  { q: "Do we need someone who can edit video?",
    a: "No. Upload the recording and describe the moment you want, or leave it blank and pick from the moments it suggests. The only manual edit after a clip is made is trimming it — branding is applied automatically." },
];
