import type { Faq, Quote, TitleDesc } from "@/components/marketing/kit";

/**
 * The use-case pages, as data.
 *
 * Every page in the design is the same template with different words, so they
 * live here rather than as three near-identical components. Adding the
 * industry pages the site plan argues for -- Manufacturing, Healthcare,
 * BPO, Logistics -- is an entry in this object and nothing else.
 *
 * Some copy in the design mock has been corrected rather than transcribed,
 * because it described things that are not built:
 *
 *  - "Enterprise plans support multiple workspaces" -> there are no plans, and
 *    one account belongs to one workspace. The honest answer is that a company
 *    needing two identities can be given two workspaces by us.
 *  - "Role-based access ... control who can share, and which clips are visible
 *    to which teams" -> roles exist (owner/admin/member) but per-clip
 *    visibility does not. Reworded to what the roles actually do.
 */
export type UseCase = {
  slug: string;
  nav: string;
  navDesc: string;
  title: string;
  pill: string;
  headline: string;
  sub: string;
  agentTitle: string;
  agentDesc: string;
  agentPerfect: string;
  workflowSteps: TitleDesc[];
  whyTitle: string;
  whyItems: TitleDesc[];
  contentTypesHeading: string;
  contentTypes: { name: string; desc: string }[];
  quotes: Quote[];
  faqs: Faq[];
  ctaHeadline: string;
};

/** Answers reused across pages, kept in one place so they cannot contradict. */
const SETUP_FAQ: Faq = {
  q: "How long does setup take?",
  a: "One onboarding call. We create your workspace and configure the brand kit with you — that part takes about ten minutes — and you can upload a real recording on the same call.",
};

const BRANDING_FAQ: Faq = {
  q: "Can different departments or sites have their own branding?",
  a: "One brand kit per workspace, deliberately — the whole point of the kit is that branding cannot drift between clips or sites. A company that genuinely needs two identities can be set up with two workspaces. Per-department kits inside a single workspace is a real request we would build when a customer needs it.",
};

export const USE_CASES: Record<string, UseCase> = {
  "internal-comms": {
    slug: "internal-comms",
    nav: "Internal Comms",
    navDesc: "Town halls, leadership updates, cross-site briefings",
    title: "Internal Comms",
    pill: "clipworker for Internal Comms",
    headline: "Your AI Video Agent, Built for Internal Comms Teams",
    sub: "Turn town halls, leadership updates, and briefings into clips your whole company actually watches.",
    agentTitle: "Your recap and reach agent",
    agentDesc: "clipworker turns long recordings into short, clear clips that reach people who don't sit at a desk or check email regularly — plant floor, warehouse, hospital shift, wherever they are.",
    agentPerfect: "Perfect for: town hall recaps, leadership updates, cross-team and cross-site briefings.",
    workflowSteps: [
      { title: "Reaches everyone — not just desk-based staff", desc: "Clips share as a direct link. No app, no login, no intranet required — people watch on any device, anywhere." },
      { title: "Consistent across departments and sites", desc: "One message, same clip, everywhere. No variation depending on who delivered it live." },
      { title: "Cuts repeat live briefings", desc: "One recording replaces explaining it over and over. Upload once, share everywhere, done." },
      { title: "Keeps every team aligned", desc: "No drift in what was actually communicated. Every person hears the same version of the update." },
    ],
    whyTitle: "Why comms teams choose clipworker",
    whyItems: [
      { title: "Reaches employees email can't", desc: "Frontline and deskless workers get the same update as office staff." },
      { title: "On-brand across every update", desc: "One brand kit, applied automatically to every clip from your workspace." },
      { title: "No video team needed", desc: "A comms lead can run this alone — no agency, no editor, no production team." },
      { title: "Consistent leadership messaging", desc: "Every employee sees the same version of the message, regardless of where they are." },
      { title: "Faster than repeating briefings live", desc: "Record once, clip, share. No repeat sessions, no re-explaining." },
      { title: "Simple enough to run solo", desc: "Upload a recording, review the clips, share. That's the whole process." },
    ],
    contentTypesHeading: "Every type of comms recording, handled.",
    contentTypes: [
      { name: "Town hall recaps", desc: "Turn a full all-hands into three to five highlight clips people actually watch after the fact." },
      { name: "Leadership updates", desc: "Exec messages clipped and shared consistently — no version drift between sites." },
      { name: "Cross-team briefings", desc: "Updates that need to reach several departments, delivered the same way to each." },
      { name: "Company-wide announcements", desc: "Restructures, policy changes, new initiatives — clipped and shareable the same day." },
      { name: "Culture and engagement clips", desc: "Team moments and behind-the-scenes content, packaged and on-brand." },
      { name: "Urgent comms", desc: "Time-sensitive updates that can't wait for the next all-hands — out within the hour." },
    ],
    quotes: [
      { text: "We used to have a recording sit in a shared drive after every town hall. Now it's three or four clips our team actually watches the same week.", author: "Internal comms lead", role: "Mid-size manufacturer" },
      { text: "The consistency across our sites has been the thing. Every location gets the same message without us managing it by hand.", author: "Comms manager", role: "Industrial group" },
      { text: "I don't have to check anyone's export before it goes out. The branding is just right, every time.", author: "HR and comms lead", role: "Logistics company" },
    ],
    faqs: [
      { q: "How fast can a clip go out after a live session ends?", a: "About a minute of processing for a ten-minute recording, and proportionally longer for a long one — most of that is transcribing the whole thing, which is what lets you search it by meaning. Same-day distribution is comfortable; same-hour usually is too." },
      BRANDING_FAQ,
      { q: "Does this work for global or multi-language teams?", a: "Not yet. Captions are generated in the recording's own language, and there is no translation or dubbing — that is explicitly not built, and we would rather say so than let you find out later." },
      SETUP_FAQ,
    ],
    ctaHeadline: "Your updates shouldn't stop at the people who happened to be online.",
  },

  hr: {
    slug: "hr",
    nav: "HR",
    navDesc: "Onboarding, compliance training, policy updates",
    title: "HR",
    pill: "clipworker for HR",
    headline: "Your AI Video Agent, Built for HR Teams",
    sub: "Turn onboarding, training, and policy sessions into clips your people actually complete.",
    agentTitle: "Your onboarding and training agent",
    agentDesc: "clipworker breaks long onboarding and training recordings into short, specific clips people can complete in a few minutes, rather than a block of time they rarely have — between patients, between shifts, or between calls.",
    agentPerfect: "Perfect for: onboarding modules, compliance training recaps, policy update briefings.",
    workflowSteps: [
      { title: "Fits real schedules", desc: "A short clip fits where a live session doesn't. People watch between tasks, not in a dedicated hour they don't have." },
      { title: "Consistent across departments and locations", desc: "Every team sees the same training, explained the same way — no variation from trainer to trainer." },
      { title: "Cuts repeat live sessions", desc: "One recording replaces retraining live each time someone new joins or a policy changes." },
      { title: "Keeps every new hire aligned from day one", desc: "New starters get the same structured onboarding regardless of who is available to walk them through it." },
    ],
    whyTitle: "Why HR teams choose clipworker",
    whyItems: [
      { title: "Fits around real schedules", desc: "Short clips fit where live sessions don't — between patients, shifts, or calls." },
      { title: "Consistent training delivery", desc: "Every team and every location gets the same training, explained the same way." },
      { title: "No video team or agency needed", desc: "HR and L&D can produce clips themselves — no production skills required." },
      { title: "On-brand across every module", desc: "Brand kit applied automatically to every clip from your workspace." },
      { title: "Faster than repeating sessions live", desc: "Record once, clip, share — no repeat session every time someone new joins." },
      { title: "Roles for who can change what", desc: "Owners and admins invite people and set the brand kit; members make clips and see the shared library." },
    ],
    contentTypesHeading: "Every type of HR recording, handled.",
    contentTypes: [
      { name: "Onboarding modules", desc: "Break a full onboarding day into topic-specific clips new hires can revisit any time." },
      { name: "Compliance training recaps", desc: "Turn a recorded compliance session into short reference clips — minutes, not hours." },
      { name: "Policy update briefings", desc: "New policy? Record the briefing once, clip it, share it to everyone who needs it." },
      { name: "New-hire welcome content", desc: "Welcome messages, team intros and first-week guides — consistent for every starter." },
      { name: "Manager and leadership training", desc: "Management development content packaged into clips that fit a busy schedule." },
      { name: "Exit and offboarding recaps", desc: "Knowledge-transfer sessions turned into referenceable clips before someone leaves." },
    ],
    quotes: [
      { text: "Onboarding used to mean a new hire sat through the same 40-minute recording. Now it's five short clips, and it's the same every time no matter who uploads it.", author: "L&D manager", role: "Healthcare network" },
      { text: "We were re-running the same compliance briefing across three departments. Now we record it once and it reaches everyone the same day.", author: "Head of clinical education", role: "Regional healthcare network" },
      { text: "New starters get consistent onboarding clips, not whoever happens to be free for a tour.", author: "HR manager", role: "Hospital trust" },
    ],
    faqs: [
      { q: "Can training completion be tracked for audit purposes?", a: "Not by us — there is no per-viewer analytics, and we would rather not imply otherwise for a regulated use case. Clips download as ordinary MP4s or share as links, so completion tracking stays wherever it already lives for you, usually the LMS." },
      { q: "Does this integrate with our existing LMS?", a: "There is no direct integration. Clips export as downloadable files or shareable links, which embed in any LMS, SharePoint page or intranet that accepts video." },
      { q: "Is this compliant with training regulations in our sector?", a: "We hold no certification — not ISO 27001, and no formal GDPR attestation. For a regulated environment you should confirm your own requirements before relying on this, and we are happy to walk through exactly how the data is handled." },
      SETUP_FAQ,
    ],
    ctaHeadline: "Training shouldn't compete with your people's actual jobs for their time.",
  },

  marketing: {
    slug: "marketing",
    nav: "Marketing",
    navDesc: "Webinar repurposing, interviews, event clips",
    title: "Marketing",
    pill: "clipworker for Marketing",
    headline: "Your AI Video Agent, Built for Marketing Teams",
    sub: "Repurpose webinars, interviews, and event recordings into short clips in minutes.",
    agentTitle: "Your repurposing agent",
    agentDesc: "clipworker turns long-form content — webinars, interviews, event recordings — into short clips ready for social and campaigns. More output without more headcount.",
    agentPerfect: "Perfect for: webinar repurposing, interview highlights, event recap clips.",
    workflowSteps: [
      { title: "More output, same team size", desc: "Get more clips from every piece of long-form content without adding headcount or hours." },
      { title: "Fast repurposing", desc: "Webinars and interviews become platform-ready clips in minutes, not a multi-day edit queue." },
      { title: "Brand consistency, automatically", desc: "Every clip carries your logo and caption style — set once, applied to everything after." },
      { title: "Faster production timelines", desc: "Upload, review, publish. Same-week content stops being a stretch." },
    ],
    whyTitle: "Why marketing teams choose clipworker",
    whyItems: [
      { title: "More output without more headcount", desc: "Every webinar or interview becomes several clips without adding to your team." },
      { title: "Fast repurposing", desc: "Long-form content becomes short clips in minutes rather than days." },
      { title: "Brand consistency across every clip", desc: "Logo, caption style and colours set once and applied automatically." },
      { title: "Full control, no outsourcing", desc: "No agency, no freelancer, no back-and-forth. Marketing runs it end to end." },
      { title: "Four aspect ratios out of the box", desc: "Vertical, wide, portrait and square from one upload — each cut for where it's posted." },
      { title: "Simple enough for anyone on the team", desc: "No video editing skills needed to produce a clip." },
    ],
    contentTypesHeading: "Every type of marketing recording, handled.",
    contentTypes: [
      { name: "Webinar highlights", desc: "Turn a 60-minute webinar into several clips ready for LinkedIn, email and follow-up." },
      { name: "Interview clips", desc: "Pull the best moments from a customer or expert interview for social and campaign use." },
      { name: "Event recap content", desc: "Turn event recordings into shareable clips before the event week is over." },
      { name: "Product update clips", desc: "Clip the product walkthrough and push it to every channel the same day." },
      { name: "Customer testimonial clips", desc: "Turn a recorded customer conversation into branded clips ready to share." },
      { name: "Social campaign content", desc: "Batch several vertical and square clips from one recording for a week of content." },
    ],
    quotes: [
      { text: "We used to let webinars gather dust after one live airing. Now we get a week of content out of every one.", author: "Content marketing manager", role: "B2B SaaS company" },
      { text: "The turnaround is the thing. We used to wait days for an edit. Now clips are ready before I've finished my coffee.", author: "Marketing manager", role: "Technology company" },
      { text: "Every clip comes out on-brand without me checking it. That's the biggest time saver by far.", author: "Brand lead", role: "Scale-up" },
    ],
    faqs: [
      { q: "Can this turn a 60-minute webinar into several platform-ready clips?", a: "Yes. Ask for up to five reels from one upload and the moments are ranked and cut separately, each as its own clip you can keep or discard. You pick the aspect ratio per clip." },
      BRANDING_FAQ,
      { q: "Can I add music or b-roll?", a: "Yes. A music track is level-matched to sit under the dialogue, and a b-roll clip is placed where the words match the footage." },
      SETUP_FAQ,
    ],
    ctaHeadline: "Stop letting webinars gather dust after one live airing.",
  },
};

export const USE_CASE_LIST = Object.values(USE_CASES);
