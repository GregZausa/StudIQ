import { WHY_ITEMS } from "../../../utils/home/home.constants";
import { RevealSection } from "./HomeComponents";

const HomeWhy = () => (
  <section className="section">
    <RevealSection>
      <div className="section-header">
        <div>
          <div className="section-number">02 — The problem</div>
          <h2 className="section-title">
            Why students
            <br />
            struggle.
          </h2>
        </div>
      </div>
    </RevealSection>

    <div className="why-grid">
      {/* Sticky stat card */}
      <div className="why-sticky">
        <RevealSection delay={100}>
          <div
            style={{
              background: "#0d0d0d",
              borderRadius: 20,
              padding: "40px 36px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(135deg, rgba(45,59,232,0.3), transparent)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontWeight: 700,
                fontSize: 52,
                letterSpacing: "-3px",
                color: "#fff",
                lineHeight: 1,
                marginBottom: 16,
              }}
            >
              80%
            </div>
            <p
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.55)",
                lineHeight: 1.7,
              }}
            >
              of students use passive study methods that produce weak long-term
              memory retention.
            </p>
          </div>
        </RevealSection>
      </div>

      {/* Why items */}
      <div>
        {WHY_ITEMS.map((item, i) => (
          <RevealSection key={i} delay={i * 80}>
            <div className="why-item">
              <div className="why-item-num">{item.num}</div>
              <div className="why-item-title">{item.title}</div>
              <div className="why-item-text">{item.text}</div>
            </div>
          </RevealSection>
        ))}
      </div>
    </div>
  </section>
);

export default HomeWhy;
