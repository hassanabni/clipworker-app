# clipworker

Turn a long video into a short, vertical, ready-to-post clip. Upload the raw
footage, describe (or auto-detect) the moment you want, and get back a
captioned, auto-reframed 9:16 clip — no editing software required.

🔗 **Live**: [clipworker.xyz](https://clipworker.xyz)

## Status

This repo is the **frontend** — it's the finished, shipped part of the
product: landing page, auth, the upload/generate dashboard, and billing.

The **AI pipeline** (transcription, picking the best moment, auto-reframing,
caption burn-in, rendering) is a separate service that's still under active
development and isn't open source yet, since it's the core of the product.
It already runs end-to-end against real video — what's left is polish,
testing at scale, and going live for real customers.

## What's built

- **Landing page** — hero, before/after comparison, how-it-works, product
  demo, feature breakdown, pricing, FAQ.
- **Auth** — Google OAuth and magic-link sign-in via Supabase.
- **Dashboard** — upload a video, request a clip, watch it move through the
  pipeline, browse past clips.
- **Billing** — Paddle checkout, customer portal, and a webhook-verified
  subscription that gates a free tier against a paid one. Entitlement is
  read from the database, never trusted from the client — only a
  signature-verified webhook can grant Pro.
- **Design system** — dark, Poppins throughout, built on Tailwind + shadcn/ui.

## Tech stack

Next.js (App Router) · TypeScript · Tailwind CSS · shadcn/ui · Supabase
(Postgres, Auth, Row-Level Security) · Cloudflare R2 (video storage) ·
Paddle (billing) · Vercel.

## Notes for anyone reading the code

A few things here are subtle and deliberate — worth knowing before assuming
they're wrong and "fixing" them:

- `src/middleware.ts` refreshes the auth cookie on every request. Without
  it, sessions expire mid-use and users get silently signed out between
  page loads.
- `src/lib/supabase/server.ts`'s `currentUser()` calls `getUser()`, never
  `getSession()` — `getSession()` only reads a cookie the client could have
  tampered with, so it's never safe to use for authorization.
- `src/lib/r2.ts` sets `requestChecksumCalculation: "WHEN_REQUIRED"`. The
  AWS SDK otherwise bakes an empty-body CRC32 into presigned PUT URLs,
  which Cloudflare R2 rejects outright.
- Billing entitlement is enforced entirely server-side: the `subscriptions`
  table has a read-own policy and *no* write policy for regular users, so
  the only way to become Pro is through the webhook holding the
  service-role key.

## Running locally

```bash
npm install
npm run dev   # http://localhost:3100
```

Needs a `.env.local` (gitignored, see `.env.example` for the full list) —
Supabase project keys, R2 credentials, and Paddle sandbox keys. There is
deliberately no service-role key required for local frontend dev; it's only
needed by the billing webhook.

Uploads won't turn into finished clips without the backend AI pipeline
running against the same job queue — that's the private repo mentioned
above.
