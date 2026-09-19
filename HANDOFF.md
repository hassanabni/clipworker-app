# clipworker-app — handoff

Read this first. It is the state of the project, why things are the way they
are, and what has already been tried and rejected. Written so a fresh session
can continue without the user re-explaining anything.

**This is the frontend repo.** For the worker/backend (Python, transcription,
AI clip selection, rendering), read `~/Downloads/clip-worker/HANDOFF.md` —
same Supabase project, same RLS, same quota triggers, same R2 bucket, shared
between both repos. Read both; start with whichever repo you're about to
touch.

github.com/hassanabni/clipworker-app (private), branches `main` and
`staging`.

## CURRENT STATUS (updated 2026-09-17) — read this block first

Kept current after every change — a user requirement, see `CLAUDE.md`. Older
sections below are history and may be out of date where they conflict with
this block.

| | |
|---|---|
| Git | Clean and pushed. Branch `clip-worker-beta-v1`, latest `3271ba2`, and `origin/staging` is the same commit. History: `3271ba2` (worker-vs-app note) ← `8f90662` (commit HANDOFF.md) ← `3b50ff3` (upload/render survive leaving the page) ← `4abcfa9` (Singapore functions, lighter middleware) ← `170015f` (marketing site, request-access form, dashboard fixes). **Nothing of this is on `main`.** |
| Rendering is a WORKER concern, not an app one | The framing and face-tracking work (clip-worker `8dd6108`, `e8d6a4d`, `f2f3dea`) lives in the container on the laptop and applies to clips filed from localhost, staging or production alike — the app only files the job. Testing new framing needs the worker running, not an app deploy. |
| Deployed | **Staging only**: `staging.clipworker.xyz` serves `3271ba2` (deployed 2026-09-17, Vercel build succeeded, functions in `sin1`; verified by curl: pages return 200, `/use-cases/hr` redirects to `#hr`, new form and WhatsApp link are present). **Production (`main`) is older and untouched**; the user checks staging before a production release. Do not push `main` unless asked. |
| Vercel env | 2026-09-15: added `RESEND_API_KEY`, `RESEND_FROM`, `REQUEST_ACCESS_TO`, `SUPABASE_SERVICE_ROLE_KEY` for **Preview → `staging` branch only**. **Production has none of these yet**, so add them there before the production deploy or the live form cannot save or email. Staging form verified end to end on 2026-09-15: the API returned `{"ok":true}`, the row was stored with `emailed = true`, and the test row was deleted. Staging shares the production database, so staging form submissions land in the real `demo_requests` table. |
| Auth | Email + password only (Google removed). Public signup closed (`registration_open = false`); accounts come from invites (`/app/team`). |
| Agent name | **Mira** (earlier drafts said Milo/Henna) |
| Env (`.env.local`) | `RESEND_API_KEY`, `RESEND_FROM=clipworker <noreply@ablyst.com>`, `REQUEST_ACCESS_TO=support@ablyst.com` — **must also be added in Vercel before deploying**, or the live form stores requests without emailing them. ablyst.com is verified in Resend (Tokyo); click tracking not needed. |
| Verification | Dashboard pages cannot be screenshotted signed-in by the assistant (no password entry), so UI checks use `/dev/preview`, which now mounts ClipForm, TeamPanel, BrandKitForm, CaptionPreview and TrimPanel with mock data. |
| This file | **Committed since `8f90662`** — it used to be gitignored and laptop-only. `CLAUDE.md` tells every session to read it first and update it after each change. |

### Session log — 2026-09-14 / 15

**Marketing site** (multi-page, from the approved Figma file
`NyNs6o1LFCsKZUyyg2Q0yC`): home 8:2105, product 8:2106, use cases 8:2107,
company 8:2108. Built with shadcn + Tailwind; assets in `public/figma/`
(placeholders the user will replace). False claims in the Figma copy were
removed or softened on purpose — customer logos, named testimonials,
SOC-2/ISO/GDPR, Zoom/Teams integrations, invented metrics. Each one is noted in
a comment beside the component.

- **Header** (`site-nav.tsx`): "Product" opens the Mira card (icon, name,
  "AI Agent" chip, one-line description, no bullets) on hover or click and links
  to /product. No Agents menu. "Use Cases" is a plain link.
- **Use cases**: one page (`/use-cases`). Internal Comms, HR and Marketing are
  stacked sections with a sticky bar that jumps between them
  (`usecases/departments.tsx`). `/use-cases/[slug]` now redirects to
  `/use-cases#<slug>`. Labels read "Mira Use Cases".
- **Product page**: the sub-bar under the header was removed, and so was the 🎬
  emoji. Quotes are phrased as buyer problems, not results.
- The "Illustrative quotes —" disclaimer lines are gone from product and use
  cases. The homepage still has a differently worded one.
- **Request access**: every "Request access" / "Get a demo" button goes to
  `/request-access` (`CTA_HREF` in `lib/cta.ts`). The form collects first name,
  last name and email (required), phone, country and "tell us more". The route
  `app/api/request-access/route.ts`:
  - inserts into `public.demo_requests` with the service-role key (table in
    `clip-worker/sql/demo_requests.sql`, applied; RLS on, no policies);
  - emails the team through Resend, with reply-to set to the visitor;
  - uses a honeypot field for bots;
  - reports success if either the insert or the email worked.

  Tested end to end on 2026-09-15: the email arrived, and the test rows were
  deleted. `demo_requests` is currently empty.
- **WhatsApp button** (`components/whatsapp-button.tsx`, in the root layout,
  so it is on every page): `wa.me/601161424553`. The number lives in
  `lib/contact.ts`.

**Staging felt laggy (1–2s per click), 2026-09-15.** Measured from the laptop
(Malaysia):
- Vercel served from `sin1` (Singapore), but the project's function region was
  **`iad1` (Washington DC)**, while Supabase is `ap-southeast-1` (Singapore).
  Every server render or auth call went Malaysia → US → Singapore DB → US →
  Malaysia. A click's RSC request for `/product` took ~0.86s; `/` took
  0.6–0.8s.
- Separately, the middleware ran `supabase.auth.getUser()` on EVERY request,
  prefetches and cached static pages included: ~0.31s for a CDN-cached page vs
  ~0.14s for a path it skips.
- The "Request access" / "Get a demo" buttons were plain `<a>` tags, so each
  click was a full page reload.

Fixes:
- `vercel.json` sets `"regions": ["sin1"]`.
- `middleware.ts` now matches only `/`, `/app/*`, `/api/*`, `/login`,
  `/auth/reset`, `/auth/update-password` and `/pricing`.
- All 14 CTA anchors plus one `/product` link were converted to `next/link`.

Verified locally: pages 200, signed-out `/app` still redirects to `/login`, and
CTA clicks navigate client-side.

Deployed to staging as `4abcfa9` and re-measured (warm runs):
- `x-vercel-id` is now `sin1::sin1::…` for server-rendered routes.
- A click's RSC request dropped from ~0.86s to ~0.07s.
- Cached marketing pages dropped from ~0.31–0.40s to ~0.07–0.18s.
- Signed-out `/app` returns 307 to `/login` in ~0.28s.
- `/` is still 0.4–1.0s: it is dynamic (it checks the session to redirect
  signed-in users) and the first hit after a deploy is a cold start.
- **Production still runs in `iad1`** until `vercel.json` reaches `main`.

**The clip in flight now outlives the page (2026-09-17).** Reported: upload a
video, glance at Team, come back to New clip -- the form was blank, the upload
was gone, and the render still running was invisible, which invites starting the
same clip twice.

- `components/clip-job-provider.tsx` holds the upload (XHR), the job polling,
  the batch-reel polling and the "cancel what's stuck" action. It is mounted in
  `app/app/layout.tsx` around the whole shell, so moving between New clip, Team,
  Clips and Brand keeps the upload running and the progress on screen.
- On mount it also asks `/api/jobs` whether a job is `queued`/`processing` and
  adopts it, so a full reload (or a new session) still shows the render in
  progress. An upload cannot be resumed this way -- the browser drops it when
  the page goes -- but a render can be followed.
- `components/clip-job-bar.tsx` shows "Uploading … %" / "Making your clip…"
  under the header on every dashboard page, with a link back to /app/new.
- `clip-form.tsx` keeps only the form fields; job state comes from the provider.
  Added "Start another clip" (calls `reset()`) once a job is done or failed.
- Backend was already safe: `enforce_job_rate` allows one active job per user
  (three per org, batch siblings exempt), so a second render was refused with
  `job_already_running`. This was a UI problem, not a queue problem.
- Verified: typecheck, lint, `/dev/preview` renders the form inside the provider
  (that page wraps it itself), `/app` still redirects to /login when signed out.
  Cross-page persistence needs a signed-in session, so it is for the user to
  confirm on staging.

**Dashboard fixes** (2026-09-15):
- `clip-form.tsx`: the Video/Settings/Moments/B-roll step strip was removed;
  "Output settings" no longer shows a pre-filled tick. The aspect-ratio tiles
  are the design's device icons (phone / monitor / portrait / square, ported
  from `~/Downloads/Untitled (1)/src/App.tsx`).
- `brand-kit-form.tsx` position controls:
  - Logo: Top left, Top centre, Top right, Bottom left, Bottom centre, Bottom
    right, Manual. Captions: Top, Middle, Bottom, Manual (`LOGO_PRESETS` /
    `CAPTION_PRESETS` in `lib/brand.ts`).
  - A preset snaps; the item moves freely only in Manual, and dragging it in
    the preview switches to Manual automatically.
- `caption-preview.tsx`: the selected logo or caption gets a white frame with 4
  corner handles; any corner resizes it.
- Caption fonts are now Montserrat, Poppins, Inter, Roboto and Bebas Neue:
  - `CAPTION_FONTS` in `lib/brand.ts`; browser copies in `lib/caption-fonts.ts`
    via next/font, shown in their own face in the picker;
  - the database CHECK is updated and applied (`clip-worker/sql/caption_fonts.sql`);
  - the worker image installs them — see clip-worker's handoff.
  - Known gap: Poppins renders smaller in the final video than the preview shows.
- `team-panel.tsx`: the invite row sits on one grid (email, role and button
  share top, bottom and 36px height, measured). The people list uses fixed
  columns, and your own row shows a greyed delete icon ("You can't remove
  yourself") instead of a gap.

## What is live right now (as of 2026-08-31)

`clipworker.xyz`, `www.clipworker.xyz`, and `staging.clipworker.xyz` all
point at this app's Vercel project now — moved off the old `clip-worker`
repo's stale `web/` deployment this session. Verified via curl and a real
screenshot after the cutover, not just "the deploy succeeded."

Everything in this doc is **committed and pushed to `origin/main`, live in
production** unless a section says otherwise.

## THE B2B PIVOT ("Milo") — IN PROGRESS as of 2026-09-08

Pivoting from B2C creator clipping to B2B internal comms/training. See
`clip-worker/HANDOFF.md`'s pivot section for the full picture and the SQL
apply order — the migrations live in that repo.

**The org migrations are applied (2026-09-08), so the dashboard works against
a real workspace.** Every existing account got its own org; `rajputhde@gmail.com`
keeps its 4 clips. The worker image is NOT rebuilt, so renders still run the old
code -- 4 canvases and the brand kit will not take effect until it is.

The Brand Kit **lock was removed**: kits stay editable, `/app/brand` always
renders the editor, and there is no locked view. `brand_kits.locked` still
exists in the schema, unenforced.

There is also a dev-only `/dev/preview` route that mounts the new UI with mock
data (gated the same way as `/paddle-test`). Delete it once the real pages have
been reviewed; its sample video is gitignored.

New in this repo:
- `src/lib/org.ts` — `getOrg()`. Resolved once in `app/app/layout.tsx`, which
  now shows a blocking "no workspace" screen rather than letting a user reach
  the upload form and hit a raw NOT NULL violation on submit.
- `src/app/app/brand/` + `brand-kit-form.tsx` — the Brand Kit, reachable from
  the sidebar next to New clip and Clips. Always editable (the lock was
  removed); saving applies to every clip made from then on, and clips already
  rendered keep the styling they were made with.
- `src/lib/brand.ts` — shared vocabulary plus a **port of the worker's
  `caption_geometry()`**. `GEOMETRY_FIXTURES` there is the same table asserted
  in `clip-worker/tests/test_captions_style.py`. If the two drift, the preview
  lies about what the renderer will produce, so keep both green.
- `src/app/app/clips/[id]/` + `trim-panel.tsx` — first dynamic route. Trim is
  cut-inward only, and that is inherent: it re-cuts the finished mp4 because
  the original upload is deleted the moment a render succeeds.
- Aspect ratio is a **per-job** control seeded from the kit, deliberately not
  locked with the rest of the brand — where a clip gets posted is a
  distribution choice, not brand identity.

Storage prefixes moved from `uploads/${user.id}/` to `uploads/${org.id}/`, and
logos go to a new `brands/` prefix. **`brands/` must be excluded from the R2
1-day lifecycle rule** or every clip fails on a missing logo from day two.
`api/jobs/route.ts` accepts both the old and new prefix for one release —
`renderPick` re-submits a previous suggest job's path through that validator,
so a hard cutover would make every pre-deploy shortlist un-renderable.

Also fixed: job creation was an INSERT followed by an UPDATE that RLS should
have blocked (and that raced the worker's 3s poll). The id is now generated in
the route and it is a single INSERT — which is what lets `jobs` keep no UPDATE
policy at all, so a member cannot rewrite `request_json` on a queued row.

## Immediate next steps

1. **Paddle account was declined.** Generic Acceptable Use Policy rejection,
   no specifics given. Replied to Paddle asking for the actual reason;
   **awaiting their response as of 2026-08-31.** See "Billing (Paddle)"
   below for the full story, what's built, and the Stripe fallback.
2. **Dashboard settings that need doing by hand, not code**, now that the
   domain moved — without these, sign-in and uploads will look broken on
   the live domain even though every page loads fine:
   - Supabase → Authentication → URL Configuration → add
     `https://clipworker.xyz/**` (and `www.`) to Redirect URLs.
   - Google Cloud Console → OAuth client → add `https://clipworker.xyz` as
     an authorized JavaScript origin and `https://clipworker.xyz/auth/callback`
     as an authorized redirect URI.
   - Cloudflare R2 → bucket CORS → allow the `https://clipworker.xyz` origin.
3. **Paddle sandbox "Approved domains" setting** needs `localhost` added
   (Paddle Dashboard → Checkout → Checkout settings, sandbox environment) —
   without it the checkout overlay fails with a generic "Something went
   wrong" the moment it opens. This blocks testing the actual checkout flow
   and, downstream, subscription-lifecycle testing (upgrade/cancel), since
   those need a real completed checkout to have a real subscription to act
   on. Confirmed this is the root cause via the browser console: a CSP
   `frame-ancestors` violation naming `localhost`, not a code bug.

## Design system

- **Dark-only, no light/dark toggle.** `next-themes` is installed but not
  wired to anything real — the whole site forces `dark` via a static class
  on `<html>` in `layout.tsx`. Deliberate: nothing needed to preserve, and
  it means `/pricing` and `/app` re-theme for free since they already use
  semantic shadcn classes rather than hardcoded colors.
- **Brand color**: magenta → pink-violet gradient, tokens `--brand` /
  `--brand-2` (registered in `@theme inline` as `--color-brand-2` etc., so
  `from-brand`/`to-brand-2`/`text-brand`/`bg-brand/10` all work as Tailwind
  utilities). Used sparingly — primary CTAs, active states, glows — never
  as a page-wide wash. `Button` has a `gradient` variant for this.
- **Font is Poppins, everywhere.** Fixed a real pre-existing bug while
  changing this: `globals.css` had `--font-sans: var(--font-sans)` — a
  circular self-reference that silently resolved to nothing, so the ENTIRE
  SITE had been rendering in the browser's default serif (Times) the whole
  time, unnoticed. Now `--font-sans` and `--font-mono` both point at
  `--font-poppins`, set via `next/font/google` in `layout.tsx`.
- **`.bg-dot-grid`** utility class in `globals.css` — a radial-gradient dot
  pattern, used on the login page background. Reusable elsewhere if needed.
- **Site-wide `cursor: pointer`** on all non-disabled buttons and
  `[role=button]` elements, added as a single base-layer rule in
  `globals.css` rather than per-component — Tailwind/browser defaults don't
  give buttons a pointer cursor the way links get one natively.

## Landing page (`src/app/page.tsx` + `src/components/marketing/`)

Full build this session: hero, proof stats, before/after (placeholder video
boxes — real videos not supplied yet, swap point commented in
`before-after.tsx`), how-it-works, product demo (mock browser window),
feature rows (captions/b-roll/framing, placeholder art — real screenshots
would clash with the new dark theme), testimonials, comparison table,
pricing teaser (pulls from `src/lib/pricing-plans.ts`, the same source
`/pricing` uses — edit once, both stay in sync), FAQ, closing CTA.

**Testimonials are fabricated, deliberately, with constraints.** Illustrative
quotes attributed by role only ("— Podcast creator, clips for TikTok"), NO
invented names, NO fake avatar photos, and a small honest subtitle noting
they're illustrative, not verified reviews. This was an explicit user
decision after being walked through the tradeoff — the old `web/` app's
HANDOFF entry said "no testimonials, inventing quotes is fabricated social
proof," and this new decision knowingly overrides that for THIS app. If
real testimonials ever exist, swap these out; if the user's stance on this
changes back, this section is the one to gut.

**A `/paddle-test` page exists but is gated `notFound()` in production**
(`process.env.NODE_ENV === "production"`) — sandbox-only Paddle checkout
smoke test, see Billing section. Same for `/welcome` (its success-redirect
target). Neither is reachable on the real domain; both work in local dev.

## Dashboard, login, pricing

- **Login is Google OAuth + magic link only.** Password auth was dropped
  entirely this session (previously supported password signup/signin) —
  matches a design reference the user provided. `/auth/reset` (password
  reset) was deleted as a result — it had nothing left linking to it.
  **This makes email deliverability more critical than before**: if a magic
  link lands in spam, that's a user who cannot sign in at all, not a
  fallback path. See clip-worker/HANDOFF.md's Brevo item.
- **Dashboard** (`/app`, `dash-sidebar.tsx`, `clip-form.tsx`, `my-clips.tsx`)
  re-themed to match the landing page's brand instead of generic shadcn
  defaults — gradient CTA, gradient avatar, brand-tinted active nav/icons,
  gradient progress bars. The clip-length/framing selects are a CSS Grid
  (`grid-cols-2`) with `w-full` triggers, not fixed pixel widths — this
  guarantees equal column width at any container size, which fixed-width
  classes didn't (a real bug found and fixed this session: the settings row
  was overflowing and wrapping the Captions toggle onto its own line, flush
  left, looking broken).
- **`/pricing` cards are equal height regardless of feature-list length**
  (`flex flex-col` + `mt-auto` on the CTA button) — previously Free (5
  features) and Pro (4 features) caused the Pro button to sit noticeably
  higher than Free's, since CSS grid stretched both cards to the taller
  one's height but nothing distributed the extra space.
- Real pricing stays **Free ($0, 3 clips) / Pro ($15/mo, 100 clips)** — this
  has NOT changed despite the Paddle test fixtures using different
  (fictional, sandbox-only) tier names. See Billing section for why those
  don't correspond to anything real.

## Billing (Paddle)

**Swapped from Stripe to Paddle this session.** Same architecture as before:
`src/lib/paddle/{server,client}.ts`, `src/app/api/paddle/{checkout,portal,
webhook}/route.ts`, `src/components/upgrade-button.tsx`. Checkout runs
client-side as a Paddle.js overlay (no server-redirect session URL the way
Stripe had) — `getPaddle()` in `paddle/client.ts` lazily initializes and
caches Paddle.js once.

**Deliberately did NOT touch the database schema.** `subscriptions` table
columns are still literally named `stripe_customer_id` / `stripe_subscription_id`
— they now hold Paddle ids. Not a bug, a scoping decision to keep the swap
to five-ish files. `is_pro()` works completely unchanged: Paddle's
subscription status vocabulary (`active`/`canceled`/`past_due`/`paused`/
`trialing`) happens to match Stripe's exactly.

**Webhook** (`api/paddle/webhook/route.ts`) verifies signatures against the
raw body (`paddle().webhooks.unmarshal`), handles `subscription.*` +
`customer.*` + `transaction.completed`, and is **order-safe**: it compares
Paddle's own `updatedAt` on the incoming subscription against what's
already stored and ignores stale/out-of-order deliveries rather than
blindly overwriting newer state with older data.

### The Paddle application saga

1. First application declined — generic AUP rejection, no specifics.
2. Replied to Paddle (via the actual application email thread) asking for
   the specific policy category flagged. **Awaiting response as of
   2026-08-31.**
3. In the meantime: **user explicitly declined building a "paste a YouTube
   link, we fetch the video" feature** (which Opus Clip has) after being
   walked through the risk — YouTube ToS violation, weakened DMCA safe-harbor
   position, and critically, this is plausibly close to the exact thing
   that got Paddle to decline. Do not build this without it being
   deliberately re-raised, and even then, revisit the risk conversation.
4. **Stripe is the proven fallback.** It was fully built, working, and only
   removed from the codebase when swapping to Paddle (still in git history
   at commit `1a09910` and earlier on clip-worker... check clipworker-app's
   own git log for the pre-Paddle commit). Rebuilding it is the same scope
   as the Paddle swap was. Stripe isn't a Merchant of Record for a standard
   integration, so it doesn't carry the same content-liability underwriting
   bar Paddle just invoked.

### MCP servers — not available, used the SDK directly instead

The Paddle Claude Code plugin (`paddle-sandbox`/`paddle-live`/`paddle-docs`
MCP servers) is **not usable in this environment** — `/plugin` itself
isn't available here. Everything that would have used those MCP tools was
instead done with `@paddle/paddle-node-sdk` directly against the real
sandbox API key, which turned out to cover the same ground:
- Creating sandbox products/prices: `paddle.products.create()` /
  `paddle.prices.create()` (see `scripts/create-paddle-sandbox-products.mjs`,
  `scripts/add-paddle-yearly-prices.mjs`).
- Creating a notification (webhook) destination and reading back its
  signing secret: `paddle.notificationSettings.create()` (see
  `scripts/create-paddle-notification-destination.mjs`).
- Firing real signed test events without a completed checkout:
  `paddle.simulations.create()` + `paddle.simulationRuns.create()` +
  `paddle.simulationRunEvents.list()` (see
  `scripts/test-paddle-webhook-simulation.mjs`) — this is how webhook
  delivery + signature verification got proven end-to-end before checkout
  itself was unblocked.

**Every Paddle SDK call in this codebase was written by reading the
installed package's actual `.d.ts` files first**, not from memory/training
data — the real API surface differs from what might be assumed in several
specific, non-obvious ways (see Gotchas below).

### Sandbox test fixtures

`/paddle-test` (gated out of production) has three FICTIONAL test tiers —
Starter $10/mo, Pro $30/mo, Advanced $300/mo — created purely to exercise
the checkout/PricePreview/webhook mechanics. **These are not real pricing
and were explicitly kept separate from it** after being asked directly:
real pricing stays Free/Pro as above. The underlying Paddle sandbox
products (`pro_01m1ad...`) and their monthly+yearly prices persist in the
Paddle sandbox account; safe to leave, low-value to delete, not "real
infrastructure" in the sense of anything depending on them — they were
built only for this testing.

`/welcome` is the test checkout's success-redirect target, same gating.

Testing was run through a **Cloudflare quick tunnel**
(`cloudflared tunnel --url http://localhost:3100`) since Paddle's servers
need a real public URL to deliver webhooks to — free, no account needed,
but the URL is ephemeral and dies when the tunnel process stops. If you
restart it, update the notification destination's `destination` field via
`paddle.notificationSettings.update()` to the new URL, or webhook testing
silently stops delivering anywhere real.

### Gotchas learned this session

- **Paddle checkout overlay checks the VIEWING page's domain**
  (`frame_ancestors`/approved-domains), completely separate from webhook
  delivery reachability. A working tunnel for webhooks does NOT mean
  checkout will open — that needs `localhost` specifically approved in the
  dashboard. Confirmed via the exact browser console CSP error, not
  guessed.
- **Notification destinations don't accept simulation traffic by default.**
  `paddle.simulations.create()` fails with "Notification setting cannot be
  used for 'simulation' traffic" unless the destination's `trafficSource`
  is explicitly set to `"all"` (default is `"platform"`-only) via
  `notificationSettings.update()`.
- **`PricePreviewParams` takes country as `address: { countryCode }`**, not
  a bare `countryCode` field at the top level — easy to get wrong since
  other Paddle types do take a bare code.
- **`Paddle.Checkout.open()`'s `Variant`** type really does include
  `'one-page'` (`'multi-page' | 'one-page' | 'express'`), confirmed against
  the installed `@paddle/paddle-js` types, not assumed.
- **Never `npm run build` while `next dev` is running** — same gotcha as
  documented in clip-worker/HANDOFF.md for the old app, still true here:
  they share `.next`, corrupts the dev server.

## Env vars (`.env.local`, not `.env.example`)

**A real credential once landed in `.env.example` (which IS committed to
git) instead of `.env.local` (gitignored) during this session** — caught
before it was committed, moved to the right file, `.env.example` restored
to blank template values. Worth double-checking whenever asked to add a
credential: confirm which file actually receives the real value.

Paddle vars, documented with blank values in `.env.example`:
`PADDLE_API_KEY`, `PADDLE_WEBHOOK_SECRET`, `PADDLE_PRICE_ID`,
`PADDLE_ENVIRONMENT` (sandbox/production), `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN`,
`NEXT_PUBLIC_PADDLE_ENVIRONMENT`. The client-side `getPaddle()` helper
**fails loudly** (throws) if `NEXT_PUBLIC_PADDLE_ENVIRONMENT` is unset or
not exactly `"sandbox"`/`"production"` — deliberately no silent default, so
it's never possible to accidentally run against the wrong Paddle account
without noticing.

`SUPABASE_SERVICE_ROLE_KEY` (needed by the Paddle webhook to write
entitlement, bypassing RLS) is the same key clip-worker's `.env` uses — same
Supabase project, safe to copy across if ever missing here.
