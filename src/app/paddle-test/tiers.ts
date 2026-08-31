// Edit tiers here. These map to the sandbox test products created by
// scripts/create-paddle-sandbox-products.mjs and add-paddle-yearly-prices.mjs
// -- not real plans. "Advanced" reuses the product originally labelled
// "Enterprise (test)" in Paddle; only the display name differs here.
export interface Tier {
  name: "Starter" | "Pro" | "Advanced";
  description: string;
  features: string[];
  priceId: { month: string; year: string };
}

export const tiers: Tier[] = [
  {
    name: "Starter",
    description: "Sandbox test tier",
    features: ["Test feature one", "Test feature two"],
    priceId: { month: "pri_01m1ad6g5tdp8zck9g6d2w3hw2", year: "pri_01m1adhx6qb174ct7y0e7jk5xn" },
  },
  {
    name: "Pro",
    description: "Sandbox test tier",
    features: ["Everything in Starter", "Test feature three"],
    priceId: { month: "pri_01m1ad6gvkc8ma7jnjwkzycb88", year: "pri_01m1adhxjaeebeknt3krxefm52" },
  },
  {
    name: "Advanced",
    description: "Sandbox test tier",
    features: ["Everything in Pro", "Test feature four"],
    priceId: { month: "pri_01m1ad6hfs2g7mr3cjx701rbb7", year: "pri_01m1adhy15992x58w1p71051a6" },
  },
];
