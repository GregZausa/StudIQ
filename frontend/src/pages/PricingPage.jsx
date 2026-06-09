import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "../context/SubscriptionContext";
import { useUser } from "../context/UserContext";
import {
  PLANS,
  PREMIUM_FEATURES,
  FREE_LIMITS,
} from "../utils/constants/premium.config";
import { Check, Zap, X } from "lucide-react";
import Footer from "./components/layout/Footer";

const COMPARISON = [
  {
    label: "To-do tasks",
    free: `${FREE_LIMITS.todos} max`,
    premium: "Unlimited",
  },
  {
    label: "Deadlines",
    free: `${FREE_LIMITS.deadlines} max`,
    premium: "Unlimited",
  },
  { label: "Notes", free: `${FREE_LIMITS.notes} max`, premium: "Unlimited" },
  {
    label: "Materials",
    free: `${FREE_LIMITS.materials} max`,
    premium: "Unlimited",
  },
  {
    label: "Flashcard decks",
    free: `${FREE_LIMITS.decks} max`,
    premium: "Unlimited",
  },
  {
    label: "Cards per deck",
    free: `${FREE_LIMITS.cards_per_deck} max`,
    premium: "Unlimited",
  },
  { label: "Class schedules", free: "1 semester", premium: "Unlimited" },
  { label: "Ads", free: "Shown", premium: "Ad-free ✨" },
  { label: "Full streak analytics", free: false, premium: true },
  { label: "Custom Pomodoro", free: false, premium: true },
  { label: "Priority support", free: false, premium: true },
];

const PricingPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useUser();
  const { isPremium, plan } = useSubscription() || {
    isPremium: false,
    plan: "free",
  };
  const [billing, setBilling] = useState("yearly");
  const [loading, setLoading] = useState(null);

  const activePlan = billing === "yearly" ? PLANS.yearly : PLANS.monthly;

  const handleUpgrade = async () => {
    if (!isLoggedIn) {
      navigate("/auth");
      return;
    }
    setLoading(billing);

    try {
      const { supabase } = await import("../config/supabase");
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const { createCheckout } = await import("../lib/api");
      const checkoutUrl = await createCheckout(billing, session?.access_token);
      window.location.href = checkoutUrl;
    } catch (err) {
      alert("Something went wrong. Please try again.");
      console.log(err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=cabinet-grotesk@400,500,700,800&display=swap');
        .font-clash   { font-family: 'Clash Display', sans-serif; }
        .font-cabinet { font-family: 'Cabinet Grotesk', sans-serif; }
        .pricing-grain::before {
          content: '';
          position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.02; pointer-events: none; z-index: 0;
        }
      `}</style>

      <div className="pricing-grain min-h-screen bg-[#f7f4ef] font-cabinet text-[#0d0d0d]">
        <div className="relative z-10">
          <nav className="sticky top-0 z-20 flex items-center justify-between px-6 lg:px-12 py-4 border-b border-[#ebe9e4] bg-[#f7f4ef]/90 backdrop-blur-md">
            <button
              onClick={() => navigate("/")}
              className="font-clash font-bold text-xl tracking-tight text-[#0d0d0d] cursor-pointer"
            >
              Stud<span className="text-[#2d3be8]">IQ</span>
            </button>
            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="bg-[#0d0d0d] text-white font-clash font-semibold text-[13px] px-5 py-2.5 rounded-xl cursor-pointer hover:bg-[#2d3be8] transition-all"
                >
                  Dashboard →
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/auth")}
                    className="text-[13px] font-medium text-[#8a8278] hover:text-[#0d0d0d] cursor-pointer transition-colors"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => navigate("/auth")}
                    className="bg-[#0d0d0d] text-white font-clash font-semibold text-[13px] px-5 py-2.5 rounded-xl cursor-pointer hover:bg-[#2d3be8] transition-all"
                  >
                    Sign up free →
                  </button>
                </>
              )}
            </div>
          </nav>

          <div className="max-w-4xl mx-auto px-6 pt-20 pb-12 text-center">
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-full px-4 py-1.5 mb-6">
              <Zap size={12} className="text-indigo-500" />
              <span className="font-clash font-bold text-[10px] tracking-[2px] uppercase text-indigo-600">
                Stud IQ Premium
              </span>
            </div>
            <h1 className="font-clash font-bold text-[clamp(36px,6vw,64px)] tracking-[-2.5px] leading-[0.95] text-[#0d0d0d] mb-5">
              Study without limits.
            </h1>
            <p className="text-[16px] text-[#8a8278] leading-relaxed max-w-md mx-auto">
              Unlock unlimited everything, go ad-free, and get the full StudIQ
              experience.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="flex gap-1 bg-white border border-[#ebe9e4] rounded-xl p-1">
              {["monthly", "yearly"].map((b) => (
                <button
                  key={b}
                  onClick={() => setBilling(b)}
                  className={`px-5 py-2 rounded-lg font-clash font-semibold text-[13px] tracking-tight cursor-pointer transition-all capitalize ${
                    billing === b
                      ? "bg-[#0d0d0d] text-white shadow-sm"
                      : "text-[#8a8278] hover:text-[#0d0d0d]"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
            {billing === "yearly" && (
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                Save ₱189
              </span>
            )}
          </div>

          <div className="max-w-3xl mx-auto px-6 mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-[#ebe9e4] rounded-3xl p-8">
                <div className="mb-6">
                  <div className="font-clash font-bold text-[11px] tracking-[2px] uppercase text-[#8a8278] mb-2">
                    Free
                  </div>
                  <div className="font-clash font-bold text-4xl tracking-[-2px] text-[#0d0d0d]">
                    ₱0
                  </div>
                  <div className="text-sm text-[#8a8278] mt-1">
                    Forever free
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    `${FREE_LIMITS.todos} tasks`,
                    `${FREE_LIMITS.notes} notes`,
                    `${FREE_LIMITS.decks} decks`,
                    "1 semester schedule",
                    "Ads supported",
                    "Basic streak stats",
                  ].map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2.5 text-sm text-[#6b6560]"
                    >
                      <Check size={14} className="text-[#0d0d0d] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate(isLoggedIn ? "/dashboard" : "/auth")}
                  className="w-full py-3 rounded-xl border border-[#ebe9e4] font-clash font-semibold text-[14px] tracking-tight text-[#0d0d0d] hover:bg-[#f7f4ef] cursor-pointer transition-all"
                >
                  {isLoggedIn ? "Current plan" : "Get started free"}
                </button>
              </div>

              <div className="relative bg-[#0d0d0d] rounded-3xl p-8 overflow-hidden">
                <div className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full bg-indigo-500 opacity-15 blur-[50px]" />

                <div className="relative">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="font-clash font-bold text-[11px] tracking-[2px] uppercase text-indigo-400">
                      Premium
                    </div>
                    <span className="bg-indigo-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wide">
                      {billing === "yearly" ? "BEST VALUE" : "POPULAR"}
                    </span>
                  </div>

                  <div className="mb-1">
                    <span className="font-clash font-bold text-4xl tracking-[-2px] text-white">
                      {billing === "yearly" ? "₱999" : "₱99"}
                    </span>
                    <span className="text-white/40 text-sm ml-2">
                      {billing === "yearly" ? "/year" : "/month"}
                    </span>
                  </div>
                  {billing === "yearly" && (
                    <div className="text-[11px] text-indigo-400 font-semibold mb-6">
                      ₱83.25/mo · Save ₱189 vs monthly
                    </div>
                  )}
                  {billing === "monthly" && <div className="mb-6" />}

                  <ul className="space-y-3 mb-8">
                    {[
                      "Unlimited tasks, notes, decks",
                      "Unlimited semesters",
                      "Ad-free experience",
                      "Full streak analytics",
                      "Custom Pomodoro durations",
                      "Priority support",
                    ].map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2.5 text-sm text-white/70"
                      >
                        <Check size={14} className="text-indigo-400 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {isPremium ? (
                    <button
                      onClick={() => navigate("/dashboard/billing")}
                      className="w-full py-3 rounded-xl bg-white/10 border border-white/20 font-clash font-semibold text-[14px] text-white cursor-pointer hover:bg-white/15 transition-all"
                    >
                      ✅ Active — Manage subscription
                    </button>
                  ) : (
                    <button
                      onClick={handleUpgrade}
                      disabled={loading === billing}
                      className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 font-clash font-bold text-[14px] tracking-tight text-white cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/30 disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {loading === billing ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Zap size={14} /> Upgrade now
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-6 mb-20">
            <h2 className="font-clash font-bold text-[clamp(24px,3vw,36px)] tracking-[-1.5px] text-[#0d0d0d] mb-8 text-center">
              Everything compared
            </h2>
            <div className="bg-white border border-[#ebe9e4] rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-3 border-b border-[#ebe9e4]">
                <div className="px-5 py-3 text-[11px] font-bold tracking-[1.5px] uppercase text-[#8a8278]">
                  Feature
                </div>
                <div className="px-5 py-3 text-center text-[11px] font-bold tracking-[1.5px] uppercase text-[#8a8278] border-l border-[#ebe9e4]">
                  Free
                </div>
                <div className="px-5 py-3 text-center text-[11px] font-bold tracking-[1.5px] uppercase text-indigo-600 border-l border-[#ebe9e4]">
                  Premium
                </div>
              </div>
              {COMPARISON.map((row, i) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-3 border-b last:border-b-0 border-[#ebe9e4] ${i % 2 === 0 ? "" : "bg-[#f7f4ef]/50"}`}
                >
                  <div className="px-5 py-3.5 text-sm font-medium text-[#2a2520]">
                    {row.label}
                  </div>
                  <div className="px-5 py-3.5 text-center border-l border-[#ebe9e4]">
                    {row.free === false ? (
                      <X size={14} className="mx-auto text-[#c8c3ba]" />
                    ) : (
                      <span className="text-sm text-[#6b6560]">{row.free}</span>
                    )}
                  </div>
                  <div className="px-5 py-3.5 text-center border-l border-[#ebe9e4]">
                    {row.premium === true ? (
                      <Check size={14} className="mx-auto text-indigo-500" />
                    ) : (
                      <span className="text-sm font-semibold text-indigo-600">
                        {row.premium}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-2xl mx-auto px-6 mb-20">
            <h2 className="font-clash font-bold text-[clamp(22px,3vw,32px)] tracking-[-1px] text-[#0d0d0d] mb-6 text-center">
              Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "How does payment work?",
                  a: "We use PayMongo — you can pay via GCash, Maya, or credit/debit card. It's secure and takes less than a minute.",
                },
                {
                  q: "Can I cancel anytime?",
                  a: "Yes. You can cancel your subscription at any time from your billing page. You'll keep access until the end of your billing period.",
                },
                {
                  q: "What happens to my data if I downgrade?",
                  a: "Your data is safe. You won't lose anything — you just won't be able to add more once you're over the free limits.",
                },
                {
                  q: "Is there a student discount?",
                  a: "The free plan already covers most students' needs. Premium at ₱99/month is priced specifically to be affordable for PH students.",
                },
              ].map(({ q, a }) => (
                <div
                  key={q}
                  className="bg-white border border-[#ebe9e4] rounded-2xl px-6 py-5"
                >
                  <div className="font-clash font-semibold text-[15px] tracking-tight text-[#0d0d0d] mb-2">
                    {q}
                  </div>
                  <div className="text-sm text-[#6b6560] leading-relaxed">
                    {a}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </>
  );
};

export default PricingPage;
