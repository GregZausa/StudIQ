// ─── Pricing ──────────────────────────────────────────────────────────────────
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

// ─── Anonymous user limits (strictest) ───────────────────────────────────────
// Anon users store data in localStorage only
export const ANON_LIMITS = {
  todos: 5,
  notes: 3,
  decks: 1,
  cards_per_deck: 10,
  // deadlines, materials, semesters — not available to anon
};

// ─── Free logged-in limits ────────────────────────────────────────────────────
export const FREE_LIMITS = {
  todos: 20,
  deadlines: 10,
  notes: 15,
  materials: 15,
  decks: 3,
  cards_per_deck: 20,
  semesters: 1,
};

// ─── Premium features list ────────────────────────────────────────────────────
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

// ─── Limit messages ───────────────────────────────────────────────────────────
export const LIMIT_MESSAGES = {
  todos: (n) => `You've reached the ${n}-task limit.`,
  deadlines: (n) => `You've reached the ${n}-deadline limit.`,
  notes: (n) => `You've reached the ${n}-note limit.`,
  materials: (n) => `You've reached the ${n}-material limit.`,
  decks: (n) => `You've reached the ${n}-deck limit.`,
  cards_per_deck: (n) => `You've reached the ${n}-card limit per deck.`,
  semesters: (n) => `The free plan only supports ${n} semester.`,
};

// ─── Get the effective limit for a user ──────────────────────────────────────
export function getLimit(feature, isPremium, isAnon) {
  if (isPremium) return null; // unlimited
  if (isAnon) return ANON_LIMITS[feature] ?? FREE_LIMITS[feature] ?? null;
  return FREE_LIMITS[feature] ?? null;
}

// ─── Check if user has hit their limit ───────────────────────────────────────
export function isAtLimit(feature, currentCount, isPremium, isAnon = false) {
  if (isPremium) return false;
  const limit = getLimit(feature, isPremium, isAnon);
  if (limit === null || limit === undefined) return false;
  return currentCount >= limit;
}

// ─── Get limit info for display ───────────────────────────────────────────────
export function getLimitInfo(feature, currentCount, isPremium, isAnon = false) {
  if (isPremium) return { atLimit: false, count: currentCount, limit: null };
  const limit = getLimit(feature, isPremium, isAnon);
  if (!limit) return { atLimit: false, count: currentCount, limit: null };
  return {
    atLimit: currentCount >= limit,
    count: currentCount,
    limit,
    remaining: Math.max(0, limit - currentCount),
    pct: Math.min(100, Math.round((currentCount / limit) * 100)),
  };
}
