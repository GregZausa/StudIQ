import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// Replaces full page content for anonymous users on
// features that require a logged-in account:
// Deadlines, Materials, ClassSchedule
//
// Usage:
//   const { isAnon } = useUser();
//   if (isAnon) return <SignInPrompt feature="Deadlines" isDark={isDark} />;

const SignInPrompt = ({ feature, isDark }) => {
  const navigate = useNavigate();

  const FEATURE_COPY = {
    Deadlines: {
      emoji: "⏰",
      desc: "Track exams and assignments with browser notifications at 24h, 3h, and 1 hour before deadline.",
    },
    Materials: {
      emoji: "📚",
      desc: "Save links, PDFs, and YouTube videos organized by subject — accessible anywhere.",
    },
    "Class Schedule": {
      emoji: "📅",
      desc: "Build your weekly timetable with subjects, rooms, and time slots per semester.",
    },
  };

  const copy = FEATURE_COPY[feature] || {
    emoji: "🔒",
    desc: "This feature requires a free account.",
  };

  return (
    <div className="max-w-md mx-auto py-16 px-4 text-center">
      <div
        className={`rounded-3xl border p-10 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
      >
        <div className="text-4xl mb-4">{copy.emoji}</div>

        <h2
          className={`text-lg font-bold tracking-tight mb-2 ${isDark ? "text-slate-100" : "text-slate-800"}`}
        >
          {feature} requires an account
        </h2>

        <p
          className={`text-sm leading-relaxed mb-6 ${isDark ? "text-slate-400" : "text-slate-500"}`}
        >
          {copy.desc}
        </p>

        <div
          className={`rounded-2xl p-4 mb-6 text-left space-y-2 ${isDark ? "bg-slate-700/50" : "bg-slate-50"}`}
        >
          {[
            "✅ Completely free — no credit card",
            "🔒 Your data is encrypted and private",
            "📱 Works on mobile and desktop",
            "🔥 Keep your study streak forever",
          ].map((perk) => (
            <div
              key={perk}
              className={`text-xs font-medium ${isDark ? "text-slate-300" : "text-slate-600"}`}
            >
              {perk}
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate("/auth")}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30"
        >
          Create free account <ArrowRight size={14} />
        </button>

        <button
          onClick={() => navigate("/auth")}
          className={`mt-2 w-full py-2 text-xs cursor-pointer transition-colors ${isDark ? "text-slate-400 hover:text-slate-200" : "text-slate-400 hover:text-slate-600"}`}
        >
          Already have an account? Log in →
        </button>
      </div>
    </div>
  );
};

export default SignInPrompt;
