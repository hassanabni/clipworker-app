// One-off: registers a sandbox notification destination pointed at a
// Cloudflare quick-tunnel URL (temporary, changes every time the tunnel
// restarts) so real Paddle sandbox events can reach the local dev server
// for end-to-end webhook testing. Prints the signing secret to add to
// PADDLE_WEBHOOK_SECRET in .env.local.
//
// Usage: node --env-file=.env.local scripts/create-paddle-notification-destination.mjs <tunnel-url>
import { Paddle, Environment } from "@paddle/paddle-node-sdk";

const key = process.env.PADDLE_API_KEY;
if (!key) throw new Error("PADDLE_API_KEY is not set (check .env.local)");
if (!key.includes("_sdbx")) {
  throw new Error("This key does not look like a sandbox key. Refusing to run against what might be a live key.");
}

const tunnelUrl = process.argv[2];
if (!tunnelUrl) throw new Error("Usage: node ... create-paddle-notification-destination.mjs <tunnel-url>");

const paddle = new Paddle(key, { environment: Environment.sandbox });

const destination = await paddle.notificationSettings.create({
  description: "clipworker-app local dev (temporary tunnel)",
  destination: `${tunnelUrl}/api/paddle/webhook`,
  type: "url",
  subscribedEvents: [
    "subscription.created",
    "subscription.updated",
    "subscription.canceled",
    "subscription.activated",
    "subscription.paused",
    "subscription.resumed",
    "subscription.trialing",
    "subscription.past_due",
    "customer.created",
    "customer.updated",
    "transaction.completed",
  ],
});

console.log(`id: ${destination.id}`);
console.log(`destination: ${destination.destination}`);
console.log(`PADDLE_WEBHOOK_SECRET=${destination.endpointSecretKey}`);
