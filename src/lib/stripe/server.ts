import Stripe from "stripe";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";

export class StripeNotConfigured extends Error {}

const key = process.env.STRIPE_SECRET_KEY;
export const PRICE_ID = process.env.STRIPE_PRICE_ID ?? "";

export function stripe() {
  if (!key)
    throw new StripeNotConfigured(
      "STRIPE_SECRET_KEY is not set. Add it to .env.local (test mode: sk_test_...)"
    );
  return new Stripe(key);
}

/** Service-role client, for the webhook only.
 *
 * subscriptions has a read-own SELECT policy and deliberately no write policy,
 * so entitlement can only be written by something holding this key -- never by
 * a browser claiming to be Pro. This module is server-only; the key has no
 * NEXT_PUBLIC_ prefix, so Next will not inline it into a client bundle.
 */
export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !secret)
    throw new StripeNotConfigured(
      "SUPABASE_SERVICE_ROLE_KEY is required for the Stripe webhook."
    );
  return createSupabaseAdmin(url, secret, { auth: { persistSession: false } });
}
