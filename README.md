# clipworker-app

The Clip Worker web app, rebuilt on Next 15 + shadcn/ui.

Replaces `clip-worker/web`. The **backend is unchanged and shared** — same
Supabase project, same RLS policies and quota triggers, same R2 bucket, same
worker and job contract. Only the front end is new.

## Ported deliberately, not rewritten

These are subtle, already correct, and cost real time to get right the first
time. Do not "simplify" them:

- `src/middleware.ts` — refreshes the auth cookie on every request. Without it
  the session expires mid-use and users are silently signed out between page
  loads.
- `src/lib/supabase/server.ts` — `currentUser()` uses `getUser()`, never
  `getSession()`. `getSession()` only reads a cookie the client could have
  tampered with; never trust it for authorisation.
- `src/lib/r2.ts` — `requestChecksumCalculation: "WHEN_REQUIRED"`. The AWS SDK
  otherwise bakes an empty-body CRC32 into presigned PUTs, which R2 rejects.
  Also signs `ContentLength`, which is what makes the upload size limit real
  rather than a browser courtesy.
- `src/lib/limits.ts` — every user-facing cap in one place, shared by the client
  pre-check and the server enforcement.

## Environment

`.env.local` (mode 600, gitignored). Two public values plus R2:

    NEXT_PUBLIC_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    R2_ACCOUNT_ID R2_BUCKET R2_ENDPOINT R2_ACCESS_KEY_ID R2_SECRET_ACCESS_KEY

There is deliberately **no service-role key here**. It bypasses RLS entirely
and only the worker needs it.

## Running

    npm run dev          # :3100, so it does not collide with the old app on :3000

The worker must be running separately to process jobs — see `clip-worker`.

## Billing

Stripe subscription, Pro $15/mo. Three routes under `src/app/api/stripe/`:
checkout, portal, webhook.

**Entitlement is read from the database, never the client.** The
`subscriptions` table has a read-own SELECT policy and deliberately NO write
policy, so the only thing that can grant Pro is the webhook, which holds the
service-role key. Verified: with a real row seeded, an anon PATCH setting
`status=active` leaves the database saying `inactive`.

The webhook refuses anything it cannot verify. Without `STRIPE_WEBHOOK_SECRET`
it returns 503 for every request rather than trusting the payload -- an
unverified webhook endpoint is an unauthenticated "make me Pro" API. It reads
the RAW body, because Stripe signs exact bytes.

Local testing:

    stripe listen --forward-to localhost:3100/api/stripe/webhook
    stripe trigger checkout.session.completed

## Still to build

- Landing page is a placeholder
- Account screen (the portal link lives on /pricing for now)
