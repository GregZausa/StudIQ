import { STATS, ARTICLES } from "../../../utils/home/home.constants";
import { RevealSection } from "./HomeComponents";

// ─── Stats grid ───────────────────────────────────────────────────────────────
export const HomeStats = () => (
  <div style={{ maxWidth: 1100, margin: "80px auto 0", padding: "0 48px" }}>
    <RevealSection>
      <div className="stats-grid">
        {STATS.map((s, i) => (
          <div key={i} className="stat-cell">
            <div className="stat-number">
              {s.number}
              <span className="stat-suffix">{s.suffix}</span>
            </div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </RevealSection>
  </div>
);

// ─── Marquee ──────────────────────────────────────────────────────────────────
export const HomeMarquee = () => (
  <div className="marquee-wrap">
    <div className="marquee-track">
      {[...ARTICLES, ...ARTICLES].map((a, i) => (
        <div key={i} className="marquee-pill">
          📘 {a}
        </div>
      ))}
    </div>
  </div>
);
