// One-off: adds a yearly price to each of the three sandbox test products
// created by create-paddle-sandbox-products.mjs, for the billing-cycle
// toggle on the /paddle-test page. 2 months free vs. the monthly price.
//
// Usage: node --env-file=.env.local scripts/add-paddle-yearly-prices.mjs
import { Paddle, Environment } from "@paddle/paddle-node-sdk";

const key = process.env.PADDLE_API_KEY;
if (!key) throw new Error("PADDLE_API_KEY is not set (check .env.local)");
if (!key.includes("_sdbx")) {
  throw new Error("This key does not look like a sandbox key. Refusing to run against what might be a live key.");
}

const paddle = new Paddle(key, { environment: Environment.sandbox });

const products = [
  { name: "Starter (test)", productId: "pro_01m1ad6fwdm6xvh0kxg6j3m8r8", yearAmount: "10000" },   // $100/yr
  { name: "Pro (test)", productId: "pro_01m1ad6gk797kbsheagaj8x3ep", yearAmount: "30000" },        // $300/yr
  { name: "Enterprise (test)", productId: "pro_01m1ad6h75ej6qpevnm75ka5qm", yearAmount: "300000" }, // $3000/yr
];

for (const p of products) {
  const price = await paddle.prices.create({
    productId: p.productId,
    description: `${p.name} yearly`,
    unitPrice: { amount: p.yearAmount, currencyCode: "USD" },
    billingCycle: { interval: "year", frequency: 1 },
  });
  console.log(`${p.name}: year price=${price.id}`);
}
