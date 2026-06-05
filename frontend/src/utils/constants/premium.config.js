export const PLANS = {
  free: {
    id: "free",
    label: "Free",
    price: 0,
    interval: null,
  },
  monthly: {
    id: "monthly",
    label: "Premium Monthly",
    price: 99,
    interval: "month",
    displayPrice: "₱99",
    displayPer: "/month",
    paymongoAmount: 9900,
  },
  yearly: {
    id: "yearly",
    label: "Premium Yearly",
    price: 999,
    interval: "year",
    displayPrice: "₱999",
    displayPer: "/year",
    savings: "Save ₱189 vs monthly",
    paymongoAmount: 99900,
    perMonth: "₱83.25/mo",
  },
};

export const FREE_LIMITS = {
  todos: 20,
  deadlines: 10,
  notes: 15,
  materials: 15,
  decks: 3,
  cards_per_deck: 20,
  semesters: 1,
};

export const PREMIUM_FEATURES = [
  {
    icon: "♾️",
    title: "Unlimited everything",
    desc: "No caps on tasks, notes, deadlines, materials, decks, or cards.",
  },
  {
    icon: "📅",
    title: "Unlimited semesters",
    desc: "Save and switch between as many class schedules as you need.",
  },
  {
    icon: "🚫",
    title: "Ad-free experience",
    desc: "No ads anywhere in the app. Clean, distraction-free studying.",
  },
  {
    icon: "📊",
    title: "Full streak analytics",
    desc: "Complete heatmap, XP history, all badges, and detailed activity log.",
  },
  {
    icon: "⏱️",
    title: "Custom Pomodoro durations",
    desc: "Set any focus and break duration. Unlock all ambient sounds.",
  },
  {
    icon: "🎨",
    title: "Priority support",
    desc: "Get faster responses when you reach out via the contact form.",
  },
];

export const LIMIT_MESSAGES = {
  todos: (n) => `You've reached the ${n}-task limit on the free plan.`,
  deadlines: (n) => `You've reached the ${n}-deadline limit on the free plan.`,
  notes: (n) => `You've reached the ${n}-note limit on the free plan.`,
  materials: (n) => `You've reached the ${n}-material limit on the free plan.`,
  decks: (n) => `You've reached the ${n}-deck limit on the free plan.`,
  cards_per_deck: (n) =>
    `You've reached the ${n}-card limit per deck on the free plan.`,
  semesters: (n) => `The free plan only supports ${n} semester.`,
};

export function isAtLimit(feature, currentCount, isPremium) {
  if (isPremium) return false;
  const limit = FREE_LIMITS[feature];
  if (limit === undefined) return false;
  return currentCount >= limit;
}

export function getLimitInfo(feature, currentCount, isPremium) {
  if (isPremium) return { atLimit: false, count: currentCount, limit: null };
  const limit = FREE_LIMITS[feature];
  return {
    atLimit: currentCount >= limit,
    count: currentCount,
    limit,
    remaining: Math.max(0, limit - currentCount),
    pct: Math.min(100, Math.round((currentCount / limit) * 100)),
  };
}
