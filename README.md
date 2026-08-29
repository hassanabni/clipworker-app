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

## Still to build

- `/app` dashboard: upload, suggest shortlist, clip list
- `/pricing` and Stripe checkout
- Account/billing screen
