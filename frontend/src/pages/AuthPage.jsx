import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, signOut, signUp } from "../config/user";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

const AuthPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const reset = () => {
    setError("");
    setSuccess("");
  };

  useEffect(() => {
    signOut();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    reset();

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (tab === "signup" && password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    if (tab === "login") {
      // ── Just sign in — no signOut() call needed ──
      // If there's an existing session, Supabase handles replacing it.
      // Calling signOut() first was causing the race condition.
      const { error } = await signIn(email.trim(), password);
      if (error) {
        setError(
          error.message === "Invalid login credentials"
            ? "Wrong email or password. Try again."
            : error.message,
        );
        setLoading(false);
        return;
      }
      // onAuthStateChange in UserContext will fire → loadUserRow → loading resolves
      navigate("/dashboard");
    } else {
      const { error } = await signUp(email.trim(), password);
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      setSuccess("Account created! You can now log in.");
      setTab("login");
      setPassword("");
      setConfirm("");
    }

    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError("Enter your email first.");
      return;
    }
    reset();
    const { supabase } = await import("../config/supabase");
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) setError(error.message);
    else setSuccess("Reset link sent! Check your inbox.");
  };

  const inputCls =
    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-indigo-500/60 focus:bg-indigo-500/5 focus:ring-2 focus:ring-indigo-500/10 transition-all font-[Cabinet_Grotesk]";

  const FEATURES = [
    "GPA calculator for PH grading system",
    "Pomodoro timer with ambient sounds",
    "Flashcard maker with public sharing",
    "Deadline alerts at 24h, 3h, and 1h",
    "Study streak tracker with XP levels",
    "Class schedule builder",
  ];

  return (
    <>
      <style>{`
        @import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=cabinet-grotesk@400,500,700,800&display=swap');
        .font-clash   { font-family: 'Clash Display', sans-serif; }
        .font-cabinet { font-family: 'Cabinet Grotesk', sans-serif; }

        .auth-grain::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.03;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes auth-spin { to { transform: rotate(360deg); } }
        .auth-spinner { animation: auth-spin 0.7s linear infinite; }

        .stroke-ghost {
          color: transparent;
          -webkit-text-stroke: 1px rgba(255,255,255,0.12);
        }
      `}</style>

      <div className="auth-grain min-h-screen bg-[#080808] flex font-cabinet relative overflow-hidden">
        <div className="pointer-events-none fixed -top-1/4 -left-1/4 w-[60vw] h-[60vw] rounded-full bg-indigo-500/10 blur-[100px]" />
        <div className="pointer-events-none fixed -bottom-1/4 -right-1/4 w-[40vw] h-[40vw] rounded-full bg-violet-500/8 blur-[80px]" />

        {/* ── Left brand panel ── */}
        <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 px-14 py-14 border-r border-white/5 relative z-10">
          <div className="font-clash font-bold text-2xl tracking-tight text-white">
            Stud<span className="text-indigo-400">IQ</span>
          </div>
          <div>
            <h2 className="font-clash font-bold text-[42px] leading-[1.05] tracking-[-2px] text-white mb-4">
              Study smarter.
              <br />
              <span className="stroke-ghost">Not harder.</span>
            </h2>
            <p className="text-sm text-white/30 leading-relaxed">
              Built for Filipino students who want results, not just effort.
            </p>
          </div>
          <ul className="space-y-3">
            {FEATURES.map((f) => (
              <li
                key={f}
                className="flex items-center gap-3 text-xs text-white/35"
              >
                <span className="w-4 h-px bg-indigo-500 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-white/15">
            © {new Date().getFullYear()} Stud IQ · Free for all students
          </p>
        </div>

        {/* ── Right form panel ── */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
          <div className="w-full max-w-[380px]">
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-10">
              <div className="font-clash font-bold text-2xl tracking-tight text-white">
                Stud<span className="text-indigo-400">IQ</span>
              </div>
              <p className="text-xs text-white/30 mt-1">
                Study smarter, not harder 📚
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-white/3 border border-white/8 rounded-xl p-1 mb-8">
              {["login", "signup"].map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTab(t);
                    reset();
                  }}
                  className={`flex-1 py-2 rounded-lg font-clash font-semibold text-[13px] tracking-tight cursor-pointer transition-all ${
                    tab === t
                      ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                      : "text-white/30 hover:text-white/60"
                  }`}
                >
                  {t === "login" ? "Log in" : "Sign up"}
                </button>
              ))}
            </div>

            {/* Heading */}
            <h1 className="font-clash font-bold text-3xl tracking-[-1px] text-white mb-1.5">
              {tab === "login" ? "Welcome back." : "Create account."}
            </h1>
            <p className="text-[13px] text-white/30 mb-7">
              {tab === "login"
                ? "Log in to your Stud IQ account to continue."
                : "Join thousands of Filipino students studying smarter."}
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold tracking-[1.5px] uppercase text-white/25 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    reset();
                  }}
                  className={inputCls}
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-[1.5px] uppercase text-white/25 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    placeholder={
                      tab === "login" ? "Your password" : "Min. 6 characters"
                    }
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      reset();
                    }}
                    className={inputCls + " pr-10"}
                    autoComplete={
                      tab === "login" ? "current-password" : "new-password"
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 cursor-pointer transition-colors"
                  >
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {tab === "signup" && (
                <div>
                  <label className="block text-[10px] font-bold tracking-[1.5px] uppercase text-white/25 mb-1.5">
                    Confirm password
                  </label>
                  <input
                    type={showPw ? "text" : "password"}
                    placeholder="Repeat your password"
                    value={confirm}
                    onChange={(e) => {
                      setConfirm(e.target.value);
                      reset();
                    }}
                    className={inputCls}
                    autoComplete="new-password"
                  />
                </div>
              )}

              {error && <p className="text-xs text-red-400 pl-0.5">{error}</p>}
              {success && (
                <p className="text-xs text-emerald-400 pl-0.5">{success}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white font-clash font-bold text-sm tracking-tight cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30 mt-2"
              >
                {loading ? (
                  <span className="auth-spinner w-4 h-4 border-2 border-white/25 border-t-white rounded-full" />
                ) : (
                  <>
                    {tab === "login" ? "Log in" : "Create account"}{" "}
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            <div className="h-px bg-white/6 my-6" />

            <div className="text-center space-y-2">
              {tab === "login" && (
                <p className="text-xs text-white/25">
                  Forgot your password?{" "}
                  <button
                    onClick={handleForgotPassword}
                    className="text-indigo-400 hover:text-indigo-300 cursor-pointer underline underline-offset-2 transition-colors"
                  >
                    Reset it
                  </button>
                </p>
              )}
              <button
                onClick={() => navigate("/")}
                className="text-xs text-white/25 hover:text-white/50 cursor-pointer transition-colors underline underline-offset-2"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
