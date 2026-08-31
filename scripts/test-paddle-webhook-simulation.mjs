// Fires a real, signed Paddle test event at the local webhook through the
// sandbox notification destination created by
// create-paddle-notification-destination.mjs (which points at the live
// tunnel -> local dev server). Verifies delivery + response, independent of
// whether the checkout overlay itself works.
//
// Usage: node --env-file=.env.local scripts/test-paddle-webhook-simulation.mjs
import { Paddle, Environment } from "@paddle/paddle-node-sdk";

const key = process.env.PADDLE_API_KEY;
if (!key) throw new Error("PADDLE_API_KEY is not set (check .env.local)");
if (!key.includes("_sdbx")) {
  throw new Error("This key does not look like a sandbox key. Refusing to run against what might be a live key.");
}

const notificationSettingId = process.argv[2];
if (!notificationSettingId)
  throw new Error("Usage: node ... test-paddle-webhook-simulation.mjs <notification-setting-id>");

const paddle = new Paddle(key, { environment: Environment.sandbox });

const eventTypes = ["subscription.created", "subscription.updated", "subscription.canceled", "customer.created"];

for (const type of eventTypes) {
  const simulation = await paddle.simulations.create({
    notificationSettingId,
    name: `local test: ${type}`,
    type,
  });

  const run = await paddle.simulationRuns.create(simulation.id);

  // Poll briefly for the run to finish delivering.
  let events = [];
  for (let i = 0; i < 10; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    events = await paddle.simulationRunEvents.list(simulation.id, run.id).next();
    if (events.every((e) => e.status !== "pending")) break;
  }

  for (const e of events) {
    console.log(
      `${type} -> status=${e.status} httpStatus=${e.response?.statusCode ?? "n/a"} body=${e.response?.body?.slice(0, 200) ?? "n/a"}`
    );
  }
}
