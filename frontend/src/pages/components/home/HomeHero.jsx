import { useNavigate } from "react-router-dom";

const HomeHero = ({ typed }) => {
  const navigate = useNavigate();

  return (
    <section className="hero">
      {/* Subtle background grid lines */}
      <div className="grid-lines" aria-hidden>
        <div className="grid-line-v" style={{ left: "33.33%" }} />
        <div className="grid-line-v" style={{ left: "66.66%" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Eyebrow */}
        <div
          className="hero-eyebrow"
          style={{ opacity: 0, animation: "fadeUp 0.6s ease 0.1s forwards" }}
        >
          Built for Filipino students 🇵🇭
        </div>

        {/* Headline */}
        <h1
          className="hero-title"
          style={{ opacity: 0, animation: "fadeUp 0.7s ease 0.2s forwards" }}
        >
          Study smarter.
          <br />
          <em>Not harder.</em>
        </h1>

        {/* Subheadline */}
        <p
          className="hero-sub"
          style={{ opacity: 0, animation: "fadeUp 0.7s ease 0.35s forwards" }}
        >
          One dashboard. Eight tools. Built around cognitive science so every
          minute you study actually sticks.
        </p>

        {/* Typewriter */}
        <div
          className="typewriter-line"
          style={{ opacity: 0, animation: "fadeUp 0.6s ease 0.45s forwards" }}
        >
          <span className="tw-dot" />
          <span>
            <span className="tw-text">{typed}</span>
          </span>
        </div>

        {/* CTAs */}
        <div
          className="hero-ctas"
          style={{ opacity: 0, animation: "fadeUp 0.6s ease 0.55s forwards" }}
        >
          <button className="cta-primary" onClick={() => navigate("/auth")}>
            Start for free →
          </button>
          <button
            className="cta-secondary"
            onClick={() => navigate("/dashboard")}
          >
            Explore dashboard
          </button>
        </div>
      </div>

      {/* Ghost "IQ" background text */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: -20,
          bottom: 40,
          fontFamily: "'Clash Display', sans-serif",
          fontWeight: 700,
          fontSize: "clamp(160px, 22vw, 320px)",
          letterSpacing: "-12px",
          color: "transparent",
          WebkitTextStroke: "1.5px rgba(0,0,0,0.07)",
          lineHeight: 1,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        IQ
      </div>
    </section>
  );
};

export default HomeHero;
