export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const DAY_FULL = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
};

export const TIME_SLOTS = (() => {
  const slots = [];
  for (let h = 6; h <= 21; h++) {
    for (const m of ["00", "30"]) {
      if (h === 21 && m === "30") continue;
      const ampm = h >= 12 ? "PM" : "AM";
      const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
      slots.push({
        label: `${hour}:${m} ${ampm}`,
        value: `${String(h).padStart(2, "0")}:${m}`,
      });
    }
  }
  return slots;
})();

export const TIME_OPTIONS = TIME_SLOTS.map((s) => ({
  value: s.value,
  label: s.label,
}));

export const SUBJECT_COLORS = [
  {
    value: "indigo",
    label: "Indigo",
    bg: "bg-indigo-500",
    light: "bg-indigo-100",
    text: "text-indigo-700",
    border: "border-indigo-200",
    hex: "#6366f1",
  },
  {
    value: "blue",
    label: "Blue",
    bg: "bg-blue-500",
    light: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
    hex: "#3b82f6",
  },
  {
    value: "violet",
    label: "Violet",
    bg: "bg-violet-500",
    light: "bg-violet-100",
    text: "text-violet-700",
    border: "border-violet-200",
    hex: "#8b5cf6",
  },
  {
    value: "pink",
    label: "Pink",
    bg: "bg-pink-500",
    light: "bg-pink-100",
    text: "text-pink-700",
    border: "border-pink-200",
    hex: "#ec4899",
  },
  {
    value: "rose",
    label: "Rose",
    bg: "bg-rose-500",
    light: "bg-rose-100",
    text: "text-rose-700",
    border: "border-rose-200",
    hex: "#f43f5e",
  },
  {
    value: "orange",
    label: "Orange",
    bg: "bg-orange-500",
    light: "bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-200",
    hex: "#f97316",
  },
  {
    value: "amber",
    label: "Amber",
    bg: "bg-amber-500",
    light: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
    hex: "#f59e0b",
  },
  {
    value: "emerald",
    label: "Emerald",
    bg: "bg-emerald-500",
    light: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
    hex: "#10b981",
  },
  {
    value: "teal",
    label: "Teal",
    bg: "bg-teal-500",
    light: "bg-teal-100",
    text: "text-teal-700",
    border: "border-teal-200",
    hex: "#14b8a6",
  },
  {
    value: "cyan",
    label: "Cyan",
    bg: "bg-cyan-500",
    light: "bg-cyan-100",
    text: "text-cyan-700",
    border: "border-cyan-200",
    hex: "#06b6d4",
  },
];

export const getColor = (value) =>
  SUBJECT_COLORS.find((c) => c.value === value) || SUBJECT_COLORS[0];

export const SEMESTER_LABELS = (() => {
  const labels = [];
  const year = new Date().getFullYear();
  for (let y = year - 1; y <= year + 1; y++) {
    labels.push(`1st Sem ${y}-${y + 1}`);
    labels.push(`2nd Sem ${y}-${y + 1}`);
    labels.push(`Summer ${y}-${y + 1}`);
  }
  return labels.map((l) => ({ value: l, label: l }));
})();

export function formatTime(time24) {
  if (!time24) return "";
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${display}:${String(m).padStart(2, "0")} ${period}`;
}

export function timeToMinutes(time24) {
  const [h, m] = time24.split(":").map(Number);
  return h * 60 + m;
}

export const GRID_START_MINUTES = 6 * 60;
export const GRID_END_MINUTES = 21 * 60;
export const SLOT_HEIGHT_PX = 48;
