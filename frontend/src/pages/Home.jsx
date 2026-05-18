import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./components/layout/Footer";

const MESSAGES = [
  "students improving their study habits",
  "students using Pomodoro focus sessions",
  "students organizing their workload",
  "students preparing for exams smarter",
];

const TOOLS = [
  {
    emoji: "📊",
    title: "GPA Calculator",
    desc: "Instant academic performance tracking",
    color: "#6366f1",
    bg: "#eef2ff",
  },
  {
    emoji: "⏱",
    title: "Pomodoro Timer",
    desc: "Structured focus sessions that stick",
    color: "#8b5cf6",
    bg: "#f5f3ff",
  },
  {
    emoji: "❓",
    title: "Quiz Generator",
    desc: "Active recall for deeper retention",
    color: "#ec4899",
    bg: "#fdf2f8",
  },
  {
    emoji: "📝",
    title: "Task Manager",
    desc: "Deadlines and assignments, organized",
    color: "#f59e0b",
    bg: "#fffbeb",
  },
  {
    emoji: "📚",
    title: "Notes System",
    desc: "Structure your learning materials",
    color: "#10b981",
    bg: "#ecfdf5",
  },
  {
    emoji: "🔔",
    title: "Smart Alerts",
    desc: "Never miss a due date again",
    color: "#ef4444",
    bg: "#fef2f2",
  },
];

const ARTICLES = [
  "Active Recall: The Most Effective Study Method",
  "Why Rereading Notes Doesn't Work",
  "Pomodoro Technique Explained for Students",
  "How to Stop Procrastinating",
  "Best Study Habits for High Performers",
  "How to Improve GPA Effectively",
  "Spaced Repetition Explained Simply",
  "How to Study Without Burnout",
];

const OUTCOMES = [
  { icon: "📈", label: "Higher academic performance" },
  { icon: "🧠", label: "Better memory retention" },
  { icon: "⏳", label: "More efficient study time" },
];

function useTypewriter(words, speed = 80, pause = 2000) {
  const [displayed, setDisplayed] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    let timeout;
    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx((c) => c + 1), speed);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx((c) => c - 1), speed / 2);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setWordIdx((i) => (i + 1) % words.length);
    }
    setDisplayed(current.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return displayed;
}

function FloatingOrb({ style }) {
  return (
    <div
      style={{
        position: "absolute",
        borderRadius: "50%",
        filter: "blur(80px)",
        opacity: 0.18,
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}

function ToolCard({ emoji, title, desc, color, bg }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? color : "#fff",
        border: `1.5px solid ${hovered ? color : "#f1f0f0"}`,
        borderRadius: 20,
        padding: "28px 24px",
        cursor: "pointer",
        transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered
          ? `0 20px 40px ${color}30`
          : "0 2px 12px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 12 }}>{emoji}</div>
      <div
        style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
          fontSize: 16,
          color: hovered ? "#fff" : "#0f0f0f",
          marginBottom: 6,
          transition: "color 0.25s",
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 13,
          color: hovered ? "rgba(255,255,255,0.8)" : "#888",
          lineHeight: 1.5,
          transition: "color 0.25s",
        }}
      >
        {desc}
      </div>
    </div>
  );
}

function ArticleCard({ title, idx }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        border: "1.5px solid #f1f0f0",
        borderRadius: 16,
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        cursor: "pointer",
        transition: "all 0.2s ease",
        transform: hovered ? "translateX(6px)" : "none",
        boxShadow: hovered ? "0 8px 24px rgba(99,102,241,0.12)" : "none",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: hovered ? "#6366f1" : "#eef2ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          fontWeight: 700,
          color: hovered ? "#fff" : "#6366f1",
          flexShrink: 0,
          transition: "all 0.2s ease",
          fontFamily: "'Syne', sans-serif",
        }}
      >
        {String(idx + 1).padStart(2, "0")}
      </div>
      <div
        style={{
          fontSize: 14,
          fontWeight: 500,
          color: "#1a1a1a",
          lineHeight: 1.4,
        }}
      >
        {title}
      </div>
      <div
        style={{
          marginLeft: "auto",
          color: "#6366f1",
          fontSize: 18,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.2s",
        }}
      >
        →
      </div>
    </div>
  );
}

const Home = () => {
  const navigate = useNavigate();
  const typed = useTypewriter(MESSAGES);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body { font-family: 'DM Sans', sans-serif; background: #fafaf9; color: #1a1a1a; }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #fff;
          border: 1.5px solid #e8e6e6;
          border-radius: 100px;
          padding: 8px 18px;
          font-size: 13px;
          font-weight: 500;
          color: #555;
          margin-bottom: 36px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }

        .hero-badge .dot {
          width: 7px; height: 7px;
          background: #22c55e;
          border-radius: 50%;
          animation: pulse-dot 2s infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }

        .hero-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(40px, 6vw, 72px);
          line-height: 1.08;
          letter-spacing: -2px;
          color: #0a0a0a;
          margin-bottom: 24px;
        }

        .hero-title .accent {
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .typewriter-wrap {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(14px, 2vw, 16px);
          color: #888;
          margin-bottom: 48px;
          min-height: 24px;
        }

        .typewriter-wrap span {
          color: #6366f1;
          font-weight: 500;
          border-right: 2px solid #6366f1;
          padding-right: 3px;
          animation: blink 0.8s steps(1) infinite;
        }

        @keyframes blink {
          0%, 100% { border-color: #6366f1; }
          50% { border-color: transparent; }
        }

        .cta-group { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

        .btn-primary {
          background: #0a0a0a;
          color: #fff;
          border: none;
          border-radius: 14px;
          padding: 16px 36px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: -0.3px;
        }

        .btn-primary:hover {
          background: #6366f1;
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(99,102,241,0.35);
        }

        .btn-secondary {
          background: #fff;
          color: #0a0a0a;
          border: 1.5px solid #e8e6e6;
          border-radius: 14px;
          padding: 16px 32px;
          font-family: 'Syne', sans-serif;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-secondary:hover {
          border-color: #6366f1;
          color: #6366f1;
          transform: translateY(-2px);
        }

        .section-label {
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #6366f1;
          margin-bottom: 16px;
        }

        .section-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(28px, 4vw, 46px);
          letter-spacing: -1.5px;
          color: #0a0a0a;
          line-height: 1.1;
          margin-bottom: 16px;
        }

        .section-sub {
          font-size: 16px;
          color: #777;
          line-height: 1.7;
          max-width: 520px;
          margin: 0 auto;
        }

        .stat-card {
          background: #fff;
          border: 1.5px solid #f1f0f0;
          border-radius: 20px;
          padding: 28px 24px;
          text-align: left;
        }

        .stat-number {
          font-family: 'Syne', sans-serif;
          font-size: 42px;
          font-weight: 800;
          letter-spacing: -2px;
          color: #0a0a0a;
          line-height: 1;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 13px;
          color: #888;
          font-weight: 400;
        }

        .marquee-wrap {
          overflow: hidden;
          mask-image: linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent);
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent);
        }

        .marquee-track {
          display: flex;
          gap: 12px;
          animation: marquee 20s linear infinite;
          width: max-content;
        }

        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .marquee-pill {
          background: #fff;
          border: 1.5px solid #f1f0f0;
          border-radius: 100px;
          padding: 10px 20px;
          font-size: 13px;
          font-weight: 500;
          color: #444;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .final-cta {
          background: #0a0a0a;
          border-radius: 28px;
          padding: 72px 48px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .final-cta-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(28px, 4vw, 48px);
          font-weight: 800;
          color: #fff;
          letter-spacing: -1.5px;
          line-height: 1.1;
          margin-bottom: 16px;
        }

        .final-cta-sub {
          color: rgba(255,255,255,0.5);
          font-size: 16px;
          margin-bottom: 36px;
        }

        .btn-white {
          background: #fff;
          color: #0a0a0a;
          border: none;
          border-radius: 14px;
          padding: 16px 40px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-white:hover {
          background: #6366f1;
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(99,102,241,0.4);
        }

        .nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          padding: 16px 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.3s ease;
        }

        .nav.scrolled {
          background: rgba(250,250,249,0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid #eee;
        }

        .nav-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 20px;
          letter-spacing: -0.5px;
          color: #0a0a0a;
        }

        .nav-logo .dot { color: #6366f1; }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #e8e6e6, transparent);
          margin: 0 auto;
          max-width: 800px;
        }

        @media (max-width: 640px) {
          .nav { padding: 14px 20px; }
          .final-cta { padding: 48px 24px; }
        }
      `}</style>

      {/* NAV */}
      <nav className={`nav ${scrollY > 40 ? "scrolled" : ""}`}>
        <div className="nav-logo">
          Stud<span className="dot">IQ</span>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="btn-primary"
          style={{ padding: "10px 22px", fontSize: 13 }}
        >
          Open App →
        </button>
      </nav>

      {/* HERO */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "120px 24px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <FloatingOrb
          style={{
            width: 500,
            height: 500,
            background: "#6366f1",
            top: -100,
            left: -100,
          }}
        />
        <FloatingOrb
          style={{
            width: 400,
            height: 400,
            background: "#ec4899",
            bottom: -50,
            right: -80,
          }}
        />
        <FloatingOrb
          style={{
            width: 300,
            height: 300,
            background: "#8b5cf6",
            top: "40%",
            left: "60%",
          }}
        />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 760 }}>
          <div className="hero-badge">
            <span className="dot" />
            Built for Filipino students 🇵🇭
          </div>

          <h1 className="hero-title">
            Study smarter.
            <br />
            <span className="accent">Not harder.</span>
          </h1>

          <p className="typewriter-wrap">
            ● <span>{typed}</span>
          </p>

          <div className="cta-group">
            <button
              className="btn-primary"
              onClick={() => navigate("/dashboard")}
            >
              Start for free →
            </button>
            <button className="btn-secondary" onClick={() => navigate("/blog")}>
              Read guides
            </button>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section style={{ padding: "0 0 80px", overflow: "hidden" }}>
        <div className="marquee-wrap">
          <div className="marquee-track">
            {[...ARTICLES, ...ARTICLES].map((a, i) => (
              <div key={i} className="marquee-pill">
                📘 {a}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section
        style={{ padding: "0 24px 100px", maxWidth: 1100, margin: "0 auto" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
          }}
        >
          {[
            { number: "7", suffix: " tools", label: "All in one dashboard" },
            { number: "100", suffix: "%", label: "Free to use" },
            { number: "24h", suffix: "", label: "Deadline alerts" },
            { number: "∞", suffix: "", label: "Study sessions" },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div className="stat-number">
                {s.number}
                <span style={{ fontSize: 24, color: "#6366f1" }}>
                  {s.suffix}
                </span>
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TOOLS */}
      <section
        style={{ padding: "0 24px 100px", maxWidth: 1100, margin: "0 auto" }}
      >
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="section-label">What's inside</div>
          <h2 className="section-title">Every tool you need.</h2>
          <p className="section-sub">
            Six powerful study tools in one clean dashboard — no subscriptions,
            no clutter.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 16,
          }}
        >
          {TOOLS.map((t, i) => (
            <ToolCard key={i} {...t} />
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* WHY */}
      <section
        style={{ padding: "100px 24px", maxWidth: 900, margin: "0 auto" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "center",
          }}
        >
          <div>
            <div className="section-label">The problem</div>
            <h2
              className="section-title"
              style={{ textAlign: "left", margin: "0 0 24px" }}
            >
              Why most students struggle
            </h2>
          </div>
          <div>
            <p
              style={{
                fontSize: 16,
                color: "#666",
                lineHeight: 1.8,
                marginBottom: 20,
              }}
            >
              Most students rely on passive techniques — rereading notes,
              highlighting textbooks, or cramming. These <em>feel</em>{" "}
              productive but create weak long-term retention.
            </p>
            <p
              style={{
                fontSize: 16,
                color: "#666",
                lineHeight: 1.8,
                marginBottom: 20,
              }}
            >
              Cognitive science shows that{" "}
              <strong style={{ color: "#0a0a0a", fontWeight: 600 }}>
                active recall
              </strong>
              ,{" "}
              <strong style={{ color: "#0a0a0a", fontWeight: 600 }}>
                spaced repetition
              </strong>
              , and{" "}
              <strong style={{ color: "#0a0a0a", fontWeight: 600 }}>
                structured focus
              </strong>{" "}
              significantly improve learning outcomes.
            </p>
            <p style={{ fontSize: 16, color: "#666", lineHeight: 1.8 }}>
              StudIQ is built around these principles — so every minute you
              study actually counts.
            </p>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* OUTCOMES */}
      <section
        style={{
          padding: "100px 24px",
          maxWidth: 1100,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div className="section-label">Results</div>
        <h2 className="section-title">What improves when you use StudIQ</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
            marginTop: 48,
          }}
        >
          {OUTCOMES.map((o, i) => (
            <div
              key={i}
              style={{
                background: "#fff",
                border: "1.5px solid #f1f0f0",
                borderRadius: 20,
                padding: "36px 28px",
                textAlign: "left",
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 16 }}>{o.icon}</div>
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: 17,
                  color: "#0a0a0a",
                  lineHeight: 1.3,
                }}
              >
                {o.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        style={{ padding: "0 24px 100px", maxWidth: 860, margin: "0 auto" }}
      >
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div className="section-label">Learn</div>
          <h2 className="section-title">Study guides & articles</h2>
          <p className="section-sub">
            Proven techniques and strategies for Filipino students.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {ARTICLES.map((a, i) => (
            <ArticleCard key={i} title={a} idx={i} />
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 36 }}>
          <button className="btn-secondary" onClick={() => navigate("/blog")}>
            Read all guides →
          </button>
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        style={{ padding: "0 24px 80px", maxWidth: 1100, margin: "0 auto" }}
      >
        <div className="final-cta">
          <FloatingOrb
            style={{
              width: 300,
              height: 300,
              background: "#6366f1",
              top: -50,
              left: -50,
              opacity: 0.25,
            }}
          />
          <FloatingOrb
            style={{
              width: 250,
              height: 250,
              background: "#ec4899",
              bottom: -50,
              right: -30,
              opacity: 0.2,
            }}
          />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
                marginBottom: 20,
              }}
            >
              Start today
            </div>
            <h2 className="final-cta-title">
              You don't need more effort.
              <br />
              You need better systems.
            </h2>
            <p className="final-cta-sub">
              Free forever. No signup needed to explore.
            </p>
            <button
              className="btn-white"
              onClick={() => navigate("/dashboard")}
            >
              Open StudIQ →
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;
