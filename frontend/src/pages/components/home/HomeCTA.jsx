import { useNavigate } from "react-router-dom";
import { RevealSection } from "./HomeComponents";

const HomeCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="section">
      <RevealSection>
        <div className="final-cta">
          <h2 className="final-cta-title">
            You don't need more effort.
            <br />
            You need better systems.
          </h2>
          <div className="final-cta-right">
            <p className="final-cta-sub">
              Free forever. Eight tools. Built for Filipino students who want
              results, not just effort.
            </p>
            <button className="btn-white" onClick={() => navigate("/auth")}>
              Start using StudIQ →
            </button>
          </div>
        </div>
      </RevealSection>
    </section>
  );
};

export default HomeCTA;
