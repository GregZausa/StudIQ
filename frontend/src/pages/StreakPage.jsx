import { useNavigate } from "react-router-dom";
import { useStreakContext } from "../context/StreakContext";
import { FlameSVG } from "../components/widgets/FlameWidget";
import AdSenseAd from "../utils/AdSenseAd";
import { useTheme } from "../context/ThemeContext";
import {
  getFlameState,
  getLevelInfo,
  getXpProgress,
  getEarnedBadges,
  getNextBadge,
  BADGES,
  LEVELS,
  XP_VALUES,
  activityLabel,
  formatDate,
} from "../utils/constants/streak.utils";
import { ArrowLeft, Flame, Trophy, Zap, Calendar, Star } from "lucide-react";

const Heatmap = ({ recentDates, isDark }) => {
  const maxXp = Math.max(...recentDates.map((d) => d.xp), 1);
  const weeks = [];

  for (let i = 0; i < recentDates.length; i += 7) {
    weeks.push(recentDates.slice(i, i + 7));
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1.5 min-w-max">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1.5">
            {week.map((day, di) => {
              const intensity = day.xp > 0 ? Math.max(0.15, day.xp / maxXp) : 0;
              const isToday = day.date === today;
              const isEmpty = day.xp === 0;

              return (
                <div
                  key={di}
                  title={`${formatDate(day.date)}: ${day.xp} XP`}
                  className={`w-3.5 h-3.5 rounded-sm cursor-default transition-all ${
                    isToday ? "ring-2 ring-offset-1 ring-orange-400" : ""
                  }`}
                  style={{
                    background: isEmpty
                      ? isDark
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(0,0,0,0.07)"
                      : `rgba(249,115,22,${intensity})`,
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-3">
        <span className="text-[10px] text-slate-400">Less</span>
        {[0.1, 0.3, 0.5, 0.75, 1].map((v, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-sm"
            style={{ background: `rgba(249,115,22,${v})` }}
          />
        ))}
        <span className="text-[10px] text-slate-400">More</span>
      </div>
    </div>
  );
};

const XpBar = ({ totalXp, isDark }) => {
  const lvl = getLevelInfo(totalXp);
  const progress = getXpProgress(totalXp);
  const nextLvl = LEVELS.find((l) => l.level === lvl.level + 1);

  return (
    <div
      className={`rounded-2xl border p-5 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
            Current level
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-2xl font-black tracking-tight"
              style={{ color: lvl.color }}
            >
              Lv.{lvl.level}
            </span>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: `${lvl.color}20`, color: lvl.color }}
            >
              {lvl.tier}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">
            Total XP
          </div>
          <div className="text-xl font-black font-mono text-slate-700 dark:text-slate-200 tracking-tight">
            {totalXp.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Bar */}
      <div
        className={`h-3 rounded-full overflow-hidden ${isDark ? "bg-slate-700" : "bg-slate-100"}`}
      >
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${lvl.color}88, ${lvl.color})`,
          }}
        />
      </div>

      <div className="flex justify-between mt-1.5">
        <span className="text-[10px] text-slate-400">
          {progress}% to next level
        </span>
        {nextLvl && (
          <span className="text-[10px] text-slate-400">
            {(nextLvl.min - totalXp).toLocaleString()} XP to Lv.{nextLvl.level}
          </span>
        )}
      </div>

      {/* All tiers preview */}
      <div className="flex gap-1 mt-4 flex-wrap">
        {[
          "Freshman",
          "Sophomore",
          "Junior",
          "Senior",
          "Cum Laude",
          "Magna Laude",
          "Summa Laude",
        ].map((tier, i) => {
          const tierLevel = LEVELS.find((l) => l.tier === tier);
          const isActive = lvl.tier === tier;
          return (
            <span
              key={i}
              className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide"
              style={{
                background: isActive
                  ? `${tierLevel?.color}25`
                  : isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.04)",
                color: isActive
                  ? tierLevel?.color
                  : isDark
                    ? "#475569"
                    : "#94a3b8",
                border: isActive
                  ? `1px solid ${tierLevel?.color}40`
                  : "1px solid transparent",
              }}
            >
              {tier}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// ─── Badge Grid ───────────────────────────────────────────────────────────────
const BadgeGrid = ({ longestStreak, isDark }) => {
  const earned = getEarnedBadges(longestStreak);

  return (
    <div
      className={`rounded-2xl border p-5 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <Trophy size={16} className="text-amber-500" />
        <h3
          className={`text-sm font-bold ${isDark ? "text-slate-100" : "text-slate-800"}`}
        >
          Milestone Badges
        </h3>
        <span className="text-[10px] font-bold text-slate-400 ml-auto">
          {earned.length}/{BADGES.length}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {BADGES.map((badge) => {
          const isEarned = longestStreak >= badge.days;
          return (
            <div
              key={badge.id}
              title={`${badge.label} — ${badge.desc}`}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                isEarned
                  ? isDark
                    ? "bg-amber-900/20 border-amber-700/40"
                    : "bg-amber-50 border-amber-200"
                  : isDark
                    ? "bg-slate-700/30 border-slate-700"
                    : "bg-slate-50 border-slate-200"
              }`}
            >
              <span
                className={`text-2xl ${!isEarned ? "grayscale opacity-30" : ""}`}
              >
                {badge.icon}
              </span>
              <div
                className={`text-[9px] font-bold text-center leading-tight ${
                  isEarned
                    ? isDark
                      ? "text-amber-300"
                      : "text-amber-700"
                    : "text-slate-400"
                }`}
              >
                {badge.label}
              </div>
              <div
                className={`text-[8px] font-semibold ${
                  isEarned ? "text-amber-500" : "text-slate-400"
                }`}
              >
                {badge.days}d
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Stats Cards ──────────────────────────────────────────────────────────────
const StatCards = ({ streakData, flameState, isDark }) => {
  const { currentStreak, longestStreak, totalXp, todayXp } = streakData;

  const stats = [
    {
      label: "Current Streak",
      value: `${currentStreak}d`,
      icon: Flame,
      color: flameState.primaryColor,
    },
    {
      label: "Longest Streak",
      value: `${longestStreak}d`,
      icon: Trophy,
      color: "#f59e0b",
    },
    {
      label: "Total XP",
      value: totalXp.toLocaleString(),
      icon: Zap,
      color: "#8b5cf6",
    },
    { label: "Today's XP", value: `+${todayXp}`, icon: Star, color: "#22c55e" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <div
          key={label}
          className={`rounded-2xl border p-4 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Icon size={14} style={{ color }} />
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              {label}
            </span>
          </div>
          <div className="text-2xl font-black tracking-tight" style={{ color }}>
            {value}
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Activity Log ─────────────────────────────────────────────────────────────
const ActivityLog = ({ todayActivities, isDark }) => (
  <div
    className={`rounded-2xl border p-5 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
  >
    <div className="flex items-center gap-2 mb-4">
      <Calendar size={16} className="text-indigo-500" />
      <h3
        className={`text-sm font-bold ${isDark ? "text-slate-100" : "text-slate-800"}`}
      >
        Today's Activity
      </h3>
    </div>

    {todayActivities.length === 0 ? (
      <div className="text-center py-6">
        <div className="text-2xl mb-2">🌅</div>
        <p className="text-sm text-slate-400">No activity yet today.</p>
        <p className="text-xs text-slate-400 mt-1">
          Complete a task, study a deck, or finish a Pomodoro to earn XP!
        </p>
      </div>
    ) : (
      <div className="space-y-2">
        {todayActivities.map((a, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 p-2.5 rounded-xl ${isDark ? "bg-slate-700/40" : "bg-slate-50"}`}
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span
              className={`text-sm flex-1 ${isDark ? "text-slate-300" : "text-slate-600"}`}
            >
              {activityLabel(a.key)}
            </span>
            <span className="text-xs font-bold text-emerald-500">
              +{XP_VALUES[a.key] || 0} XP
            </span>
          </div>
        ))}
      </div>
    )}
  </div>
);

// ─── XP Guide ─────────────────────────────────────────────────────────────────
const XpGuide = ({ isDark }) => (
  <div
    className={`rounded-2xl border p-5 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
  >
    <div className="flex items-center gap-2 mb-4">
      <Zap size={16} className="text-purple-500" />
      <h3
        className={`text-sm font-bold ${isDark ? "text-slate-100" : "text-slate-800"}`}
      >
        How to earn XP
      </h3>
    </div>
    <div className="space-y-2">
      {Object.entries(XP_VALUES).map(([key, xp]) => (
        <div key={key} className="flex items-center justify-between">
          <span
            className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            {activityLabel(key)}
          </span>
          <span className="text-xs font-bold text-purple-500">+{xp} XP</span>
        </div>
      ))}
    </div>
  </div>
);

const StreakPage = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { streakData, loading } = useStreakContext() || {
    streakData: {
      currentStreak: 0,
      longestStreak: 0,
      totalXp: 0,
      todayXp: 0,
      recentDates: [],
      todayActivities: [],
    },
    loading: false,
  };

  const {
    currentStreak,
    longestStreak,
    totalXp,
    recentDates,
    todayActivities,
  } = streakData;
  const flameState = getFlameState(currentStreak);
  const nextBadge = getNextBadge(longestStreak);

  return (
    <div className="max-w-4xl mx-auto">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className={`w-8 h-8 rounded-xl border flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer transition-colors ${
            isDark
              ? "border-slate-700 hover:bg-slate-700"
              : "border-slate-200 hover:bg-slate-50"
          }`}
        >
          <ArrowLeft size={15} />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <FlameSVG state={flameState} size={36} />
          <div>
            <h1
              className={`text-xl font-black tracking-tight ${isDark ? "text-slate-100" : "text-slate-800"}`}
            >
              Study Flame
            </h1>
            <p className="text-xs text-slate-400">
              {flameState.label} — {currentStreak} day streak
            </p>
          </div>
        </div>

        {/* Next badge teaser */}
        {nextBadge && (
          <div
            className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl border text-xs ${
              isDark
                ? "bg-slate-800 border-slate-700 text-slate-300"
                : "bg-orange-50 border-orange-200 text-orange-700"
            }`}
          >
            <span>{nextBadge.icon}</span>
            <span className="font-semibold">
              {nextBadge.days - longestStreak}d to {nextBadge.label}
            </span>
          </div>
        )}
      </div>

      <AdSenseAd />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center text-slate-400">
            <div className="w-8 h-8 border-2 border-slate-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-3" />
            <div className="text-sm">Loading your flame...</div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* ── Stat cards ── */}
          <StatCards
            streakData={streakData}
            flameState={flameState}
            isDark={isDark}
          />

          <XpBar totalXp={totalXp} isDark={isDark} />

          <div
            className={`rounded-2xl border p-5 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
          >
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={16} className="text-orange-500" />
              <h3
                className={`text-sm font-bold ${isDark ? "text-slate-100" : "text-slate-800"}`}
              >
                Activity Heatmap
              </h3>
              <span className="text-[10px] text-slate-400 ml-auto">
                Last 12 weeks
              </span>
            </div>
            <Heatmap recentDates={recentDates} isDark={isDark} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <BadgeGrid longestStreak={longestStreak} isDark={isDark} />
            <ActivityLog todayActivities={todayActivities} isDark={isDark} />
          </div>

          {/* ── XP guide ── */}
          <XpGuide isDark={isDark} />

          <AdSenseAd />

          <p className="text-center text-[11px] text-slate-300 mt-4">
            Study Flame · StudyTools PH 🇵🇭
          </p>
        </div>
      )}
    </div>
  );
};

export default StreakPage;
