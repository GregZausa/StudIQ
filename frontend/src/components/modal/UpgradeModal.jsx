import { useNavigate } from "react-router-dom";
import { X, Zap, ArrowRight } from "lucide-react";
import { PLANS, FREE_LIMITS } from "../../utils/constants/premium.config";

// ─── UpgradeModal ─────────────────────────────────────────────────────────────
// Props:
//   feature  — key from FREE_LIMITS (e.g. "notes", "decks")
//   onClose  — close handler
//   isDark   — theme
//
// Usage:
//   const [showUpgrade, setShowUpgrade] = useState(false);
//   {showUpgrade && <UpgradeModal feature="notes" onClose={() => setShowUpgrade(false)} isDark={isDark} />}
const UpgradeModal = ({ feature, onClose, isDark }) => {
  const navigate = useNavigate();
  const limit = FREE_LIMITS[feature] ?? "some";

  const FEATURE_COPY = {
    todos: {
      emoji: "✅",
      label: "tasks",
      msg: `You've hit the ${limit}-task free limit.`,
    },
    deadlines: {
      emoji: "⏰",
      label: "deadlines",
      msg: `You've hit the ${limit}-deadline free limit.`,
    },
    notes: {
      emoji: "📝",
      label: "notes",
      msg: `You've hit the ${limit}-note free limit.`,
    },
    materials: {
      emoji: "📚",
      label: "materials",
      msg: `You've hit the ${limit}-material free limit.`,
    },
    decks: {
      emoji: "🃏",
      label: "decks",
      msg: `You've hit the ${limit}-deck free limit.`,
    },
    cards_per_deck: {
      emoji: "🃏",
      label: "cards",
      msg: `You've hit the ${limit}-card per deck free limit.`,
    },
    semesters: {
      emoji: "📅",
      label: "semesters",
      msg: `Free plan only supports ${limit} semester.`,
    },
  };

  const copy = FEATURE_COPY[feature] || {
    emoji: "⭐",
    label: "this feature",
    msg: "You've reached a free plan limit.",
  };

  const cardBg = isDark
    ? "bg-slate-800 border-slate-700"
    : "bg-white border-slate-200";
  const textPri = isDark ? "text-slate-100" : "text-slate-800";
  const textMut = isDark ? "text-slate-400" : "text-slate-500";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0 bg-slate-900/70 backdrop-blur-sm">
      <div
        className={`rounded-3xl border shadow-2xl w-full max-w-sm p-6 ${cardBg}`}
      >
        {/* ── Close ── */}
        <div className="flex items-center justify-between mb-5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
            <Zap size={18} className="text-indigo-500" />
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center cursor-pointer transition-all"
          >
            <X size={15} />
          </button>
        </div>

        {/* ── Content ── */}
        <div className="mb-5">
          <h2 className={`text-lg font-bold tracking-tight mb-1.5 ${textPri}`}>
            Upgrade to Premium
          </h2>
          <p className={`text-sm leading-relaxed ${textMut}`}>
            {copy.msg} Upgrade to premium for unlimited {copy.label} and more.
          </p>
        </div>

        {/* ── Mini perks ── */}
        <div
          className={`rounded-2xl p-4 mb-5 space-y-2 ${isDark ? "bg-slate-700/50" : "bg-slate-50"}`}
        >
          {[
            "♾️  Unlimited tasks, notes, decks & more",
            "🚫  No ads — ever",
            "📅  Unlimited class schedules",
            "📊  Full streak analytics & badges",
          ].map((perk) => (
            <div key={perk} className={`text-xs font-medium ${textMut}`}>
              {perk}
            </div>
          ))}
        </div>

        {/* ── Pricing ── */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          <div
            className={`rounded-xl border p-3 text-center ${isDark ? "border-slate-600" : "border-slate-200"}`}
          >
            <div className={`text-xs font-semibold ${textMut} mb-0.5`}>
              Monthly
            </div>
            <div className="text-xl font-black text-indigo-500 tracking-tight">
              ₱99
            </div>
            <div className={`text-[10px] ${textMut}`}>per month</div>
          </div>
          <div className="rounded-xl border-2 border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 p-3 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-bl-lg">
              BEST VALUE
            </div>
            <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-0.5">
              Yearly
            </div>
            <div className="text-xl font-black text-indigo-500 tracking-tight">
              ₱999
            </div>
            <div className="text-[10px] text-indigo-500">
              ₱83/mo · save ₱189
            </div>
          </div>
        </div>

        {/* ── CTAs ── */}
        <button
          onClick={() => {
            onClose();
            navigate("/pricing");
          }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30"
        >
          See all plans <ArrowRight size={14} />
        </button>

        <button
          onClick={onClose}
          className={`w-full py-2.5 rounded-xl text-sm font-medium cursor-pointer mt-2 transition-colors ${textMut} hover:${isDark ? "text-slate-200" : "text-slate-700"}`}
        >
          Maybe later
        </button>
      </div>
    </div>
  );
};

export default UpgradeModal;
