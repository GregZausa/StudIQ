import { useState } from "react";
import { Zap } from "lucide-react";
import { useSubscription } from "../context/SubscriptionContext";
import { getLimitInfo } from "../utils/constants/premium.config";
import UpgradeModal from "../components/modal/UpgradeModal";

// ─── PremiumBadge — inline badge shown in sidebar/header ─────────────────────
export const PremiumBadge = () => (
  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wide">
    <Zap size={8} /> PREMIUM
  </span>
);

// ─── LimitBar — shows usage progress for a feature ───────────────────────────
// Usage: <LimitBar feature="notes" count={notes.length} isDark={isDark} />
export const LimitBar = ({ feature, count, isDark }) => {
  const { isPremium } = useSubscription() || { isPremium: false };
  const info = getLimitInfo(feature, count, isPremium);

  if (isPremium || !info.limit) return null;

  const isNearLimit = info.pct >= 80;
  const atLimit = info.atLimit;

  return (
    <div
      className={`rounded-xl px-3 py-2 ${isDark ? "bg-slate-700/50" : "bg-slate-50"} ${atLimit ? "border border-red-200 dark:border-red-800" : ""}`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span
          className={`text-[10px] font-semibold ${atLimit ? "text-red-500" : isNearLimit ? "text-amber-500" : isDark ? "text-slate-400" : "text-slate-500"}`}
        >
          {info.count}/{info.limit} used
        </span>
        {atLimit && (
          <span className="text-[9px] font-bold text-red-500 uppercase tracking-wide">
            Limit reached
          </span>
        )}
      </div>
      <div
        className={`h-1.5 rounded-full overflow-hidden ${isDark ? "bg-slate-600" : "bg-slate-200"}`}
      >
        <div
          className={`h-full rounded-full transition-all ${
            atLimit
              ? "bg-red-500"
              : isNearLimit
                ? "bg-amber-400"
                : "bg-indigo-500"
          }`}
          style={{ width: `${info.pct}%` }}
        />
      </div>
    </div>
  );
};

// ─── PremiumGate — wraps a feature, shows upgrade prompt if at limit ──────────
// Usage:
//   <PremiumGate feature="notes" count={notes.length} isDark={isDark}>
//     <button onClick={handleAdd}>Add note</button>
//   </PremiumGate>
//
// When at limit: renders a disabled-looking button that opens UpgradeModal
// When not at limit: renders children normally
const PremiumGate = ({ feature, count, children, isDark }) => {
  const { isPremium } = useSubscription() || { isPremium: false };
  const [showModal, setShowModal] = useState(false);
  const info = getLimitInfo(feature, count, isPremium);

  if (!info.atLimit) return <>{children}</>;

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className="cursor-pointer"
        title="Upgrade to Premium to continue"
      >
        <div className="pointer-events-none opacity-50 select-none">
          {children}
        </div>
        <div className="flex items-center justify-center gap-1.5 mt-1">
          <Zap size={11} className="text-indigo-500" />
          <span className="text-[11px] font-semibold text-indigo-500">
            Upgrade to add more
          </span>
        </div>
      </div>

      {showModal && (
        <UpgradeModal
          feature={feature}
          onClose={() => setShowModal(false)}
          isDark={isDark}
        />
      )}
    </>
  );
};

export default PremiumGate;
