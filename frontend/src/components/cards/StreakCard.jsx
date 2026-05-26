import { useNavigate } from "react-router-dom";
import { useStreakContext } from "../../context/StreakContext";
import { FlameSVG } from "../widgets/FlameWidget";
import {
  getFlameState,
  getLevelInfo,
  getXpProgress,
  getEarnedBadges,
  getNextBadge,
  activityLabel,
  XP_VALUES,
} from "../../utils/constants/streak.utils";

const MiniHeatmap = ({ recentDates, isDark }) => {
  const maxXp = Math.max(...recentDates.map((d) => d.xp), 1);

  return (
    <div
      className="grid gap-0.75"
      style={{ gridTemplateColumns: "repeat(15, 1fr)" }}
    >
      {recentDates.slice(-60).map((d, i) => {
        const intensity = d.xp > 0 ? Math.max(0.2, d.xp / maxXp) : 0;
        const isToday = d.date === new Date().toISOString().split("T")[0];

        return (
          <div
            key={i}
            title={`${d.date}: ${d.xp} XP`}
            className="w-full rounded-[3px]"
            style={{
              aspectRatio: "1",
              background:
                d.xp > 0
                  ? `rgba(249,115,22,${intensity})`
                  : isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.06)",
              outline: isToday ? "1.5px solid #f97316" : "none",
              outlineOffset: "1px",
            }}
          />
        );
      })}
    </div>
  );
};

const XpBar = ({ totalXp, isDark }) => {
  const lvl = getLevelInfo(totalXp);
  const progress = getXpProgress(totalXp);

  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span
          className="text-[11px] font-bold tracking-[1px] uppercase"
          style={{ color: lvl.color }}
        >
          Lv.{lvl.level} {lvl.tier}
        </span>
        <span
          className="text-[11px]"
          style={{ color: isDark ? "rgba(255,255,255,0.4)" : "#aaa" }}
        >
          {totalXp.toLocaleString()} XP
        </span>
      </div>
      <div
        className="h-1.5 rounded-[3px] overflow-hidden"
        style={{
          background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
        }}
      >
        <div
          className="h-full rounded-[3px] transition-[width] duration-1000 ease-in-out"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${lvl.color}88, ${lvl.color})`,
          }}
        />
      </div>
    </div>
  );
};

const StreakCard = ({ isDark }) => {
  const navigate = useNavigate();
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
    todayXp,
    recentDates,
    todayActivities,
  } = streakData;
  const flameState = getFlameState(currentStreak);
  const earnedBadges = getEarnedBadges(longestStreak);
  const nextBadge = getNextBadge(longestStreak);

  const cardBg = isDark ? "#1e293b" : "#fff";
  const border = isDark ? "#334155" : "#e2e8f0";
  const textPrimary = isDark ? "#f1f5f9" : "#0f172a";
  const textMuted = isDark ? "#94a3b8" : "#64748b";

  if (loading)
    return (
      <div
        className="rounded-[20px] p-6 min-h-50"
        style={{ background: cardBg, border: `1px solid ${border}` }}
      />
    );

  return (
    <div
      className="rounded-[20px] overflow-hidden relative"
      style={{ background: cardBg, border: `1px solid ${border}` }}
    >
      <div
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
        style={{
          background: flameState.glowColor,
          filter: "blur(40px)",
        }}
      />

      <div className="p-6 relative">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3.5">
            <FlameSVG state={flameState} size={48} />
            <div>
              <div
                className="font-extrabold leading-none tracking-[-2px]"
                style={{ fontSize: 42, color: flameState.primaryColor }}
              >
                {currentStreak}
              </div>
              <div
                className="text-xs font-semibold tracking-[0.5px]"
                style={{ color: textMuted }}
              >
                day streak
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/dashboard/streak")}
            className="text-[11px] font-semibold tracking-[0.3px] bg-transparent rounded-lg px-2.5 py-1.25 cursor-pointer"
            style={{
              color: flameState.primaryColor,
              border: `1px solid ${flameState.primaryColor}40`,
            }}
          >
            Full stats →
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: "Best streak", value: `${longestStreak}d` },
            { label: "Today's XP", value: `+${todayXp}` },
            { label: "Badges", value: earnedBadges.length },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-xl px-3 py-2.5"
              style={{
                background: isDark
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(0,0,0,0.03)",
              }}
            >
              <div
                className="text-[10px] font-semibold uppercase tracking-[0.8px] mb-0.75"
                style={{ color: textMuted }}
              >
                {label}
              </div>
              <div
                className="text-lg font-extrabold tracking-[-0.5px]"
                style={{ color: textPrimary }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>

        <div className="mb-5">
          <XpBar totalXp={totalXp} isDark={isDark} />
        </div>

        <div className="mb-4">
          <div
            className="text-[10px] font-semibold uppercase tracking-[0.8px] mb-1.5"
            style={{ color: textMuted }}
          >
            Last 60 days
          </div>
          <MiniHeatmap recentDates={recentDates} isDark={isDark} />
        </div>

        {nextBadge && (
          <div
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
            style={{
              background: isDark
                ? "rgba(255,255,255,0.04)"
                : "rgba(249,115,22,0.06)",
              border: `1px dashed ${isDark ? "rgba(255,255,255,0.1)" : "rgba(249,115,22,0.3)"}`,
            }}
          >
            <span className="text-xl">{nextBadge.icon}</span>
            <div className="flex-1">
              <div
                className="text-[11px] font-bold"
                style={{ color: textPrimary }}
              >
                {nextBadge.label}
              </div>
              <div className="text-[10px]" style={{ color: textMuted }}>
                {nextBadge.days - longestStreak} more days to unlock
              </div>
            </div>
          </div>
        )}

        {todayActivities.length > 0 && (
          <div className="mt-4">
            <div
              className="text-[10px] font-semibold uppercase tracking-[0.8px] mb-2"
              style={{ color: textMuted }}
            >
              Today's activities
            </div>
            <div className="flex flex-col gap-1">
              {todayActivities.slice(0, 4).map((a, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-xs"
                  style={{ color: textMuted }}
                >
                  <div className="w-1.25 h-1.25 rounded-full shrink-0 bg-green-500" />
                  {activityLabel(a.key)}
                  <span className="ml-auto text-[11px] font-bold text-green-500">
                    +{XP_VALUES?.[a.key] || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StreakCard;
