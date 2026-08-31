// One-off: creates three test products+prices in the Paddle SANDBOX catalog,
// purely to prove the checkout/webhook mechanics work end to end. Not tied to
// clipworker's real pricing (Free/Pro) -- run once, note the price ids it
// prints, then this script has no further purpose.
//
// Usage: node --env-file=.env.local scripts/create-paddle-sandbox-products.mjs
import { Paddle, Environment } from "@paddle/paddle-node-sdk";

const key = process.env.PADDLE_API_KEY;
if (!key) throw new Error("PADDLE_API_KEY is not set (check .env.local)");
if (!key.includes("_sdbx")) {
  throw new Error("This key does not look like a sandbox key (expected '_sdbx' in it). Refusing to run against what might be a live key.");
}

const paddle = new Paddle(key, { environment: Environment.sandbox });

const tiers = [
  { name: "Starter (test)", amount: "1000" },   // $10.00
  { name: "Pro (test)", amount: "3000" },        // $30.00
  { name: "Enterprise (test)", amount: "30000" }, // $300.00
];

for (const tier of tiers) {
  const product = await paddle.products.create({
    name: tier.name,
    taxCategory: "saas",
  });

  const price = await paddle.prices.create({
    productId: product.id,
    description: `${tier.name} monthly`,
    unitPrice: { amount: tier.amount, currencyCode: "USD" },
    billingCycle: { interval: "month", frequency: 1 },
  });

  console.log(`${tier.name}: product=${product.id} price=${price.id}`);
}
