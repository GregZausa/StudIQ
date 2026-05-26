export const XP_VALUES = {
  complete_todo: 10,
  finish_pomodoro: 25,
  study_deck: 20,
  add_note: 5,
  add_deadline: 5,
  add_material: 5,
  streak_bonus: 15,
};

export const LEVELS = [
  { min: 0, max: 200, level: 1, tier: "Freshman", color: "#94a3b8" },
  { min: 201, max: 400, level: 2, tier: "Freshman", color: "#94a3b8" },
  { min: 401, max: 600, level: 3, tier: "Freshman", color: "#94a3b8" },
  { min: 601, max: 800, level: 4, tier: "Freshman", color: "#94a3b8" },
  { min: 801, max: 1000, level: 5, tier: "Freshman", color: "#94a3b8" },
  { min: 1001, max: 1300, level: 6, tier: "Sophomore", color: "#60a5fa" },
  { min: 1301, max: 1600, level: 7, tier: "Sophomore", color: "#60a5fa" },
  { min: 1601, max: 1900, level: 8, tier: "Sophomore", color: "#60a5fa" },
  { min: 1901, max: 2200, level: 9, tier: "Sophomore", color: "#60a5fa" },
  { min: 2201, max: 2500, level: 10, tier: "Sophomore", color: "#60a5fa" },
  { min: 2501, max: 3000, level: 11, tier: "Junior", color: "#34d399" },
  { min: 3001, max: 3500, level: 12, tier: "Junior", color: "#34d399" },
  { min: 3501, max: 4000, level: 13, tier: "Junior", color: "#34d399" },
  { min: 4001, max: 4500, level: 14, tier: "Junior", color: "#34d399" },
  { min: 4501, max: 5000, level: 15, tier: "Junior", color: "#34d399" },
  { min: 5001, max: 6000, level: 16, tier: "Senior", color: "#f59e0b" },
  { min: 6001, max: 7000, level: 17, tier: "Senior", color: "#f59e0b" },
  { min: 7001, max: 8000, level: 18, tier: "Senior", color: "#f59e0b" },
  { min: 8001, max: 9000, level: 19, tier: "Senior", color: "#f59e0b" },
  { min: 9001, max: 10000, level: 20, tier: "Senior", color: "#f59e0b" },
  { min: 10001, max: 12000, level: 21, tier: "Cum Laude", color: "#f97316" },
  { min: 12001, max: 14000, level: 22, tier: "Cum Laude", color: "#f97316" },
  { min: 14001, max: 16000, level: 23, tier: "Cum Laude", color: "#f97316" },
  { min: 16001, max: 18000, level: 24, tier: "Cum Laude", color: "#f97316" },
  { min: 18001, max: 20000, level: 25, tier: "Cum Laude", color: "#f97316" },
  { min: 20001, max: 24000, level: 26, tier: "Magna Laude", color: "#ef4444" },
  { min: 24001, max: 28000, level: 27, tier: "Magna Laude", color: "#ef4444" },
  { min: 28001, max: 32000, level: 28, tier: "Magna Laude", color: "#ef4444" },
  { min: 32001, max: 36000, level: 29, tier: "Magna Laude", color: "#ef4444" },
  { min: 36001, max: 40000, level: 30, tier: "Magna Laude", color: "#ef4444" },
  { min: 40001, max: 50000, level: 31, tier: "Summa Laude", color: "#a855f7" },
  { min: 50001, max: 60000, level: 32, tier: "Summa Laude", color: "#a855f7" },
  { min: 60001, max: 70000, level: 33, tier: "Summa Laude", color: "#a855f7" },
  { min: 70001, max: 80000, level: 34, tier: "Summa Laude", color: "#a855f7" },
  {
    min: 80001,
    max: Infinity,
    level: 35,
    tier: "Summa Laude",
    color: "#a855f7",
  },
];

export const BADGES = [
  {
    id: "spark",
    days: 1,
    icon: "✨",
    label: "First Spark",
    desc: "Started your first study day",
  },
  {
    id: "ember",
    days: 3,
    icon: "🔥",
    label: "Ember",
    desc: "3-day streak — it's heating up",
  },
  {
    id: "flame",
    days: 7,
    icon: "🔥",
    label: "Flame",
    desc: "7-day streak — one full week!",
  },
  {
    id: "blaze",
    days: 14,
    icon: "🔥",
    label: "Blaze",
    desc: "14-day streak — two weeks strong",
  },
  {
    id: "inferno",
    days: 30,
    icon: "🌋",
    label: "Inferno",
    desc: "30-day streak — unstoppable",
  },
  {
    id: "nova",
    days: 60,
    icon: "⭐",
    label: "Nova",
    desc: "60-day streak — you're a star",
  },
  {
    id: "supernova",
    days: 100,
    icon: "🌟",
    label: "Supernova",
    desc: "100-day streak — legendary",
  },
  {
    id: "eternal",
    days: 365,
    icon: "♾️",
    label: "Eternal Flame",
    desc: "365 days — a whole year of studying",
  },
];

export const FLAME_STATES = [
  {
    minDays: 0,
    label: "Cold",
    primaryColor: "#60a5fa",
    coreColor: "#93c5fd",
    glowColor: "rgba(96,165,250,0.3)",
    size: 0.6,
  },
  {
    minDays: 1,
    label: "Flicker",
    primaryColor: "#fb923c",
    coreColor: "#fdba74",
    glowColor: "rgba(251,146,60,0.35)",
    size: 0.75,
  },
  {
    minDays: 3,
    label: "Warm",
    primaryColor: "#f97316",
    coreColor: "#fbbf24",
    glowColor: "rgba(249,115,22,0.4)",
    size: 0.85,
  },
  {
    minDays: 7,
    label: "Hot",
    primaryColor: "#ef4444",
    coreColor: "#f97316",
    glowColor: "rgba(239,68,68,0.45)",
    size: 1.0,
  },
  {
    minDays: 14,
    label: "Blazing",
    primaryColor: "#dc2626",
    coreColor: "#ef4444",
    glowColor: "rgba(220,38,38,0.5)",
    size: 1.1,
  },
  {
    minDays: 30,
    label: "Inferno",
    primaryColor: "#b91c1c",
    coreColor: "#fbbf24",
    glowColor: "rgba(185,28,28,0.55)",
    size: 1.2,
  },
  {
    minDays: 100,
    label: "Plasma",
    primaryColor: "#7c3aed",
    coreColor: "#fff",
    glowColor: "rgba(124,58,237,0.6)",
    size: 1.3,
  },
];

export function getFlameState(streak) {
  const states = [...FLAME_STATES].reverse();
  return states.find((s) => streak >= s.minDays) || FLAME_STATES[0];
}

export function getLevelInfo(totalXp) {
  const found = LEVELS.find((l) => totalXp >= l.min && totalXp <= l.max);
  return found || LEVELS[LEVELS.length - 1];
}

export function getXpProgress(totalXp) {
  const lvl = getLevelInfo(totalXp);
  const range = lvl.max === Infinity ? 10000 : lvl.max - lvl.min;
  const progress = ((totalXp - lvl.min) / range) * 100;
  return Math.min(Math.round(progress), 100);
}

export function getEarnedBadges(longestStreak) {
  return BADGES.filter((b) => longestStreak >= b.days);
}

export function getNextBadge(longestStreak) {
  return BADGES.find((b) => longestStreak < b.days) || null;
}

export function todayStr() {
  return new Date().toISOString().split("T")[0];
}
export function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
  });
}

export function buildHeatmapDates() {
  const dates = [];
  const today = new Date();
  for (let i = 83; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}

export function activityLabel(key) {
  const map = {
    complete_todo: "Completed a task",
    finish_pomodoro: "Finished a Pomodoro",
    study_deck: "Studied a deck",
    add_note: "Added a note",
    add_deadline: "Added a deadline",
    add_material: "Saved a material",
    streak_bonus: "Streak bonus",
  };
  return map[key] || key;
}
