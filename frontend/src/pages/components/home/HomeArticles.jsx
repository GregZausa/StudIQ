import { useNavigate } from "react-router-dom";
import { ARTICLES } from "../../../utils/home/home.constants";
import { RevealSection } from "../home/HomeComponents";

const HomeArticles = () => {
  const navigate = useNavigate();

  return (
    <section className="section">
      <RevealSection>
        <div className="section-header">
          <div>
            <div className="section-number">03 — Learn</div>
            <h2 className="section-title">
              Study guides
              <br />& articles.
            </h2>
          </div>
          <button
            className="btn-outline"
            onClick={() => navigate("/blog")}
            style={{ flexShrink: 0 }}
          >
            All articles →
          </button>
        </div>
      </RevealSection>

      <div>
        {ARTICLES.map((a, i) => (
          <RevealSection key={i} delay={i * 40}>
            <div className="article-row" onClick={() => navigate("/blog")}>
              <span className="article-idx">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="article-title">{a}</span>
              <span className="article-tag">Guide</span>
              <span className="article-arrow">→</span>
            </div>
          </RevealSection>
        ))}
      </div>
    </section>
  );
};

export default HomeArticles;
