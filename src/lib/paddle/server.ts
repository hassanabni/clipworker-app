import { Paddle, Environment } from "@paddle/paddle-node-sdk";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";

export class PaddleNotConfigured extends Error {}

const key = process.env.PADDLE_API_KEY;
export const PRICE_ID = process.env.PADDLE_PRICE_ID ?? "";

export function paddle() {
  if (!key)
    throw new PaddleNotConfigured(
      "PADDLE_API_KEY is not set. Add it to .env.local."
    );
  return new Paddle(key, {
    environment: process.env.PADDLE_ENVIRONMENT === "production"
      ? Environment.production : Environment.sandbox,
  });
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
    throw new PaddleNotConfigured(
      "SUPABASE_SERVICE_ROLE_KEY is required for the Paddle webhook."
    );
  return createSupabaseAdmin(url, secret, { auth: { persistSession: false } });
}
