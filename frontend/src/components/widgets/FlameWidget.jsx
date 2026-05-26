import { useNavigate } from "react-router-dom";
import { useStreakContext } from "../../context/StreakContext";
import { getFlameState } from "../../utils/constants/streak.utils";

const FlameSVG = ({ state, size = 32 }) => {
  const { primaryColor, coreColor, glowColor } = state;

  return (
    <div
      className="relative shrink-0"
      style={{
        width: size,
        height: size,
        filter: `drop-shadow(0 0 ${size * 0.25}px ${glowColor})`,
        animation: "flamePulse 2s ease-in-out infinite",
      }}
    >
      <svg
        viewBox="0 0 32 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size * 1.25}
        className="overflow-visible"
      >
        <defs>
          <radialGradient id={`flameGrad-${size}`} cx="50%" cy="80%" r="60%">
            <stop offset="0%" stopColor={coreColor} stopOpacity="1" />
            <stop offset="40%" stopColor={primaryColor} stopOpacity="1" />
            <stop offset="100%" stopColor={primaryColor} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`coreGrad-${size}`} cx="50%" cy="90%" r="40%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
            <stop offset="100%" stopColor={coreColor} stopOpacity="0" />
          </radialGradient>
        </defs>

        <path
          d="M16 38 C6 38 2 30 4 22 C6 14 10 10 12 4 C13 8 12 12 14 14 C15 10 17 6 20 2 C21 8 18 14 20 18 C22 12 26 10 28 14 C30 18 30 26 28 32 C26 36 22 38 16 38Z"
          fill={`url(#flameGrad-${size})`}
          style={{ animation: "flameFlicker 1.8s ease-in-out infinite" }}
        />

        <path
          d="M16 36 C10 36 8 30 10 24 C11 20 13 18 14 14 C15 18 14 22 16 24 C17 20 19 17 21 20 C23 23 22 30 20 33 C19 35 17 36 16 36Z"
          fill={`url(#coreGrad-${size})`}
          style={{
            animation: "flameFlicker 1.4s ease-in-out infinite reverse",
          }}
        />
      </svg>

      <style>{`
        @keyframes flamePulse {
          0%, 100% { transform: scale(1);    }
          50%       { transform: scale(1.08); }
        }
        @keyframes flameFlicker {
          0%, 100% { transform: scaleX(1)    skewX(0deg);  }
          25%       { transform: scaleX(0.95) skewX(-3deg); }
          75%       { transform: scaleX(1.05) skewX(2deg);  }
        }
      `}</style>
    </div>
  );
};

const FlameWidget = ({ isDark }) => {
  const navigate = useNavigate();
  const { streakData, loading } = useStreakContext() || {
    streakData: { currentStreak: 0 },
    loading: false,
  };
  const { currentStreak } = streakData;
  const flameState = getFlameState(currentStreak);

  if (loading) return null;

  return (
    <button
      onClick={() => navigate("/dashboard/streak")}
      title={`${currentStreak} day streak — click to view`}
      className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-left cursor-pointer transition-all duration-200"
      style={{
        border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
        background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = isDark
          ? "rgba(255,255,255,0.08)"
          : "rgba(0,0,0,0.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = isDark
          ? "rgba(255,255,255,0.04)"
          : "rgba(0,0,0,0.02)";
      }}
    >
      <FlameSVG state={flameState} size={24} />

      <div className="flex-1 min-w-0">
        <div
          className="font-bold text-[13px] leading-tight tracking-tight"
          style={{
            fontFamily: "'Cabinet Grotesk', sans-serif",
            color: flameState.primaryColor,
          }}
        >
          {currentStreak} day{currentStreak !== 1 ? "s" : ""}
        </div>
        <div
          className="text-[10px] font-medium"
          style={{ color: isDark ? "rgba(255,255,255,0.35)" : "#aaa" }}
        >
          {flameState.label} streak
        </div>
      </div>

      {streakData.todayXp > 0 && (
        <div
          className="w-1.5 h-1.5 rounded-full shrink-0 bg-green-500"
          style={{
            boxShadow: "0 0 6px rgba(34,197,94,0.8)",
            animation: "flamePulse 2s infinite",
          }}
        />
      )}
    </button>
  );
};

export { FlameSVG };
export default FlameWidget;
