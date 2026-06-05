import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "../context/SubscriptionContext";
import { useTheme } from "../context/ThemeContext";
import { useUser } from "../context/UserContext";
import {
  PLANS,
  PREMIUM_FEATURES,
  FREE_LIMITS,
} from "../utils/constants/premium.config";
import AdSenseAd from "../utils/AdSenseAd";
import {
  Zap,
  CreditCard,
  Calendar,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

const BillingPage = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { session } = useUser();
  const {
    subscription,
    isPremium,
    plan,
    periodEnd,
    isCancelled,
    loading,
    refresh,
  } = useSubscription() || {};
  const [upgradeLoading, setUpgradeLoading] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelConfirm, setCancelConfirm] = useState(false);

  const cardBg = isDark
    ? "bg-slate-800 border-slate-700"
    : "bg-white border-slate-200";
  const textPri = isDark ? "text-slate-100" : "text-slate-800";
  const textMut = isDark ? "text-slate-400" : "text-slate-500";

  const handleUpgrade = async (selectedPlan) => {
    setUpgradeLoading(selectedPlan);
    try {
      const token = session?.access_token;
      const res = await fetch("/api/paymongo-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan: selectedPlan }),
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setUpgradeLoading(null);
    }
  };

  const handleCancel = async () => {
    setCancelLoading(true);
    try {
      const { supabase } = await import("../config/supabase");
      const { data: userRow } = await supabase
        .from("users")
        .select("user_id")
        .eq("auth_id", session?.user?.id)
        .single();

      if (userRow) {
        await supabase
          .from("subscriptions")
          .update({ status: "cancelled", updated_at: new Date().toISOString() })
          .eq("user_id", userRow.user_id);
        await refresh();
      }
      setCancelConfirm(false);
    } catch {
      alert("Failed to cancel. Please contact support.");
    } finally {
      setCancelLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3" />
          <div className="text-sm">Loading billing info...</div>
        </div>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className={`text-xl font-bold flex items-center gap-2 ${textPri}`}>
          <CreditCard size={20} className="text-indigo-500" /> Billing &
          Subscription
        </h1>
        <p className={`text-xs mt-0.5 ${textMut}`}>
          Manage your StudIQ Premium subscription
        </p>
      </div>

      <AdSenseAd />

      <div className={`rounded-2xl border p-5 mb-4 ${cardBg}`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div
              className={`text-[10px] font-bold uppercase tracking-widest ${textMut} mb-1`}
            >
              Current plan
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-lg font-black tracking-tight ${textPri}`}>
                {isPremium ? "Premium" : "Free"}
              </span>
              {isPremium && (
                <span className="inline-flex items-center gap-1 bg-linear-to-r from-indigo-500 to-violet-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                  <Zap size={8} /> ACTIVE
                </span>
              )}
              {isCancelled && (
                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-[9px] font-bold px-2 py-0.5 rounded-full">
                  CANCELLED
                </span>
              )}
            </div>
          </div>
          <button
            onClick={refresh}
            className={`w-7 h-7 rounded-lg flex items-center justify-center ${textMut} cursor-pointer hover:text-indigo-500 transition-colors`}
            title="Refresh"
          >
            <RefreshCw size={13} />
          </button>
        </div>

        {isPremium || isCancelled ? (
          <div className="space-y-2.5">
            <div
              className={`flex items-center justify-between text-sm ${textMut}`}
            >
              <span className="flex items-center gap-1.5">
                <Calendar size={13} /> Plan
              </span>
              <span className={`font-semibold capitalize ${textPri}`}>
                {plan === "monthly" ? "Monthly (₱99/mo)" : "Yearly (₱999/yr)"}
              </span>
            </div>
            <div
              className={`flex items-center justify-between text-sm ${textMut}`}
            >
              <span className="flex items-center gap-1.5">
                {isCancelled ? (
                  <AlertCircle size={13} className="text-amber-500" />
                ) : (
                  <CheckCircle size={13} className="text-emerald-500" />
                )}
                {isCancelled ? "Access until" : "Renews on"}
              </span>
              <span
                className={`font-semibold ${isCancelled ? "text-amber-500" : textPri}`}
              >
                {formatDate(periodEnd)}
              </span>
            </div>

            {isCancelled && (
              <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-3 py-2.5 mt-2">
                <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                  Your subscription is cancelled. You'll keep premium access
                  until <strong>{formatDate(periodEnd)}</strong>, then revert to
                  the free plan.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div
            className={`rounded-xl p-3.5 ${isDark ? "bg-slate-700/50" : "bg-slate-50"}`}
          >
            <p className={`text-sm ${textMut} leading-relaxed`}>
              You're on the free plan. Upgrade to unlock unlimited features and
              go ad-free.
            </p>
          </div>
        )}
      </div>

      {!isPremium && !isCancelled && (
        <div className={`rounded-2xl border p-5 mb-4 ${cardBg}`}>
          <h2 className={`text-sm font-bold mb-4 ${textPri}`}>
            Upgrade to Premium
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {/* Monthly */}
            <div
              className={`rounded-xl border p-4 ${isDark ? "border-slate-600" : "border-slate-200"}`}
            >
              <div
                className={`text-[10px] font-bold uppercase tracking-wider ${textMut} mb-1`}
              >
                Monthly
              </div>
              <div className="text-2xl font-black text-indigo-500 tracking-tight mb-0.5">
                ₱99
              </div>
              <div className={`text-[11px] ${textMut} mb-4`}>per month</div>
              <button
                onClick={() => handleUpgrade("monthly")}
                disabled={upgradeLoading === "monthly"}
                className="w-full py-2 rounded-xl border border-indigo-500 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 font-bold text-xs cursor-pointer transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {upgradeLoading === "monthly" ? (
                  <span className="w-3 h-3 border-2 border-indigo-400/30 border-t-indigo-500 rounded-full animate-spin" />
                ) : (
                  <>
                    <Zap size={11} /> Choose
                  </>
                )}
              </button>
            </div>

            {/* Yearly */}
            <div className="rounded-xl border-2 border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-bl-lg">
                BEST VALUE
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
                Yearly
              </div>
              <div className="text-2xl font-black text-indigo-500 tracking-tight mb-0.5">
                ₱999
              </div>
              <div className="text-[11px] text-indigo-500/70 mb-4">
                ₱83.25/mo · save ₱189
              </div>
              <button
                onClick={() => handleUpgrade("yearly")}
                disabled={upgradeLoading === "yearly"}
                className="w-full py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs cursor-pointer transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {upgradeLoading === "yearly" ? (
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Zap size={11} /> Choose
                  </>
                )}
              </button>
            </div>
          </div>

          <p className={`text-[11px] ${textMut} text-center mt-3`}>
            Paid securely via PayMongo — GCash, Maya, or card accepted
          </p>
        </div>
      )}

      {isCancelled && (
        <div className={`rounded-2xl border p-5 mb-4 ${cardBg}`}>
          <h2 className={`text-sm font-bold mb-3 ${textPri}`}>Resubscribe</h2>
          <p className={`text-sm ${textMut} mb-4 leading-relaxed`}>
            Want to keep premium after your access ends? Resubscribe anytime.
          </p>
          <button
            onClick={() => navigate("/pricing")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm cursor-pointer transition-all"
          >
            <Zap size={14} /> View plans <ArrowRight size={14} />
          </button>
        </div>
      )}

      {isPremium && (
        <div className={`rounded-2xl border p-5 mb-4 ${cardBg}`}>
          <h2 className={`text-sm font-bold mb-3 ${textPri}`}>
            Your premium features
          </h2>
          <div className="space-y-2.5">
            {PREMIUM_FEATURES.map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <span className="text-lg shrink-0 leading-none mt-0.5">
                  {f.icon}
                </span>
                <div>
                  <div className={`text-sm font-semibold ${textPri}`}>
                    {f.title}
                  </div>
                  <div className={`text-xs ${textMut} leading-snug`}>
                    {f.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isPremium && !isCancelled && (
        <div
          className={`rounded-2xl border p-5 mb-4 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
        >
          <h2 className={`text-sm font-bold mb-1 ${textPri}`}>
            Cancel subscription
          </h2>
          <p className={`text-xs ${textMut} mb-4 leading-relaxed`}>
            You'll keep premium access until{" "}
            <strong>{formatDate(periodEnd)}</strong>, then revert to the free
            plan. Your data is always safe.
          </p>

          {!cancelConfirm ? (
            <button
              onClick={() => setCancelConfirm(true)}
              className="text-xs text-red-400 hover:text-red-500 cursor-pointer transition-colors underline underline-offset-2"
            >
              Cancel subscription
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancel}
                disabled={cancelLoading}
                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold cursor-pointer transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                {cancelLoading ? (
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Yes, cancel"
                )}
              </button>
              <button
                onClick={() => setCancelConfirm(false)}
                className={`px-4 py-2 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${isDark ? "border-slate-700 text-slate-300 hover:bg-slate-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
              >
                Keep premium
              </button>
            </div>
          )}
        </div>
      )}

      <div className={`rounded-2xl border p-4 ${cardBg}`}>
        <p className={`text-xs ${textMut} leading-relaxed`}>
          Questions about billing? Contact us at our{" "}
          <button
            onClick={() => navigate("/contact")}
            className="text-indigo-500 hover:text-indigo-400 cursor-pointer underline underline-offset-2"
          >
            contact page
          </button>
          . For PayMongo payment issues, keep your payment reference number
          handy.
        </p>
      </div>

      <p className="text-center text-[11px] text-slate-300 mt-6">
        Billing · StudyTools PH 🇵🇭
      </p>
    </div>
  );
};

export default BillingPage;
