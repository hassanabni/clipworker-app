"use client";

import { initializePaddle, type Paddle } from "@paddle/paddle-js";

// Paddle.js is loaded once and reused -- re-initialising on every click would
// re-inject the script and re-run its setup for no reason.
let instance: Promise<Paddle | undefined> | null = null;

export function getPaddle() {
  if (!instance) {
    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    const environment = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT;
    if (!token) throw new Error("NEXT_PUBLIC_PADDLE_CLIENT_TOKEN is not set.");
    // No default: silently falling back to sandbox (or production) is how you
    // end up running against the wrong Paddle account without noticing.
    if (environment !== "sandbox" && environment !== "production")
      throw new Error(
        `NEXT_PUBLIC_PADDLE_ENVIRONMENT must be "sandbox" or "production", got: ${environment ?? "(unset)"}`
      );
    instance = initializePaddle({ token, environment });
  }
  return instance;
}
