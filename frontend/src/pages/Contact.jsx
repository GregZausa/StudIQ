import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FORMSPREE_URL = import.meta.env.VITE_FORMSPREE_ENDPOINT_URL;

const Contact = () => {
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("general");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject,
          message: message.trim(),
          _subject: `[Stud IQ] ${subject} — from ${name.trim()}`,
        }),
      });
      const data = await res.json();
      if (res.ok) setSent(true);
      else
        setError(
          data?.errors?.[0]?.message ||
            "Something went wrong. Please try again.",
        );
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-cabinet";

  const QUICK_LINKS = [
    { label: "Privacy Policy", to: "/privacy-policy" },
    { label: "Terms of Service", to: "/terms-of-service" },
    { label: "About Stud IQ", to: "/about" },
    { label: "Dashboard", to: "/dashboard" },
  ];

  return (
    <>
      <style>{`@import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=cabinet-grotesk@400,500,700,800&display=swap'); .font-clash { font-family: 'Clash Display', sans-serif; } .font-cabinet { font-family: 'Cabinet Grotesk', sans-serif; }`}</style>

      <div className="min-h-screen bg-linear-to-br from-slate-950 via-black to-slate-900 text-white font-cabinet">
        <div className="max-w-2xl mx-auto px-6 py-16">
          <button
            onClick={() => navigate("/")}
            className="text-slate-400 hover:text-white text-sm mb-10 flex items-center gap-2 transition-colors cursor-pointer"
          >
            ← Back to Home
          </button>

          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-5 h-px bg-indigo-500" />
              <span className="font-clash font-bold text-[10px] tracking-[3px] uppercase text-indigo-400">
                Get in touch
              </span>
            </div>
            <h1 className="font-clash font-bold text-4xl tracking-[-1.5px] text-white mb-2">
              Contact Us
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Have a question, suggestion, or issue? We'd love to hear from you.
            </p>
          </div>

          {sent ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-10 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="font-clash font-bold text-xl tracking-tight text-emerald-400 mb-2">
                Message sent!
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Thanks for reaching out, <strong>{name}</strong>!<br />
                We'll reply to <span className="text-indigo-400">
                  {email}
                </span>{" "}
                within 1–3 business days.
              </p>
              <button
                onClick={() => navigate("/")}
                className="mt-6 bg-indigo-500 hover:bg-indigo-600 px-6 py-2.5 rounded-xl text-sm font-clash font-semibold transition-colors cursor-pointer"
              >
                Back to Home
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-slate-400 block mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError("");
                  }}
                  className={inputCls}
                />
              </div>

              <div>
                <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-slate-400 block mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  className={inputCls}
                />
              </div>

              <div>
                <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-slate-400 block mb-1.5">
                  Subject
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className={inputCls + " cursor-pointer"}
                >
                  <option value="general">General question</option>
                  <option value="bug">Bug report</option>
                  <option value="feature">Feature request</option>
                  <option value="adsense">Ad / content issue</option>
                  <option value="privacy">Privacy concern</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold tracking-[1.5px] uppercase text-slate-400 block mb-1.5">
                  Message
                </label>
                <textarea
                  placeholder="Tell us what's on your mind..."
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    setError("");
                  }}
                  rows={5}
                  className={inputCls + " resize-none"}
                />
              </div>

              {error && <p className="text-red-400 text-xs pl-0.5">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-clash font-bold text-sm tracking-tight cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30 flex items-center justify-center gap-2 mt-1"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                    Sending...
                  </>
                ) : (
                  "Send message →"
                )}
              </button>

              <p className="text-xs text-slate-500 text-center">
                We typically respond within 1–3 business days.
              </p>
            </form>
          )}

          <div className="mt-12 pt-8 border-t border-white/10">
            <h2 className="font-clash font-bold text-[10px] tracking-[2px] uppercase text-slate-500 mb-4">
              Helpful links
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {QUICK_LINKS.map(({ label, to }) => (
                <button
                  key={to}
                  onClick={() => navigate(to)}
                  className="text-left px-4 py-3 rounded-xl bg-white/5 border border-white/8 text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/15 text-sm transition-all cursor-pointer"
                >
                  {label} →
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
