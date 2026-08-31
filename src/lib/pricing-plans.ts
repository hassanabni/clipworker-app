// Deliberately only what exists today. The old page promised priority
// rendering, 2-hour videos and 90-day retention, none of which are built --
// listing them next to a working checkout would be charging for them.
export const freeFeatures = [
  "3 clips",
  "AI picks the moment",
  "Auto-reframe and captions",
  "Videos up to 1GB and 60 minutes",
  "Clips kept 30 days",
];

export const proFeatures = [
  "100 clips a month",
  "Everything in Free",
  "Your own b-roll and music",
  "Cancel any time",
];

export const plans = {
  free: {
    name: "Free",
    price: "$0",
    tagline: "Enough to see whether it works for you.",
    features: freeFeatures,
  },
  pro: {
    name: "Pro",
    price: "$15",
    period: "/mo",
    tagline: "For clipping at volume.",
    features: proFeatures,
  },
} as const;
