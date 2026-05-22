import { TOOLS } from "../../../utils/home/home.constants";
import { RevealSection, ToolCard } from "../home/HomeComponents";

const HomeTools = () => (
  <section className="section">
    <RevealSection>
      <div className="section-header">
        <div>
          <div className="section-number">01 — What's inside</div>
          <h2 className="section-title">
            Eight tools.
            <br />
            One place.
          </h2>
        </div>
        <p
          style={{
            fontSize: 14,
            color: "var(--muted)",
            maxWidth: 280,
            lineHeight: 1.7,
            textAlign: "right",
          }}
        >
          Every tool designed around how memory actually works — not how
          studying feels like it should work.
        </p>
      </div>
    </RevealSection>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: 14,
      }}
    >
      {TOOLS.map((t, i) => (
        <ToolCard key={i} {...t} index={i} />
      ))}
    </div>
  </section>
);

export default HomeTools;
