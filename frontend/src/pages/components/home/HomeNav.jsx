import { useNavigate } from "react-router-dom";

const HomeNav = ({ solid }) => {
  const navigate = useNavigate();

  return (
    <nav className={`nav ${solid ? "solid" : ""}`}>
      <div className="nav-logo">
        Stud<span className="iq">IQ</span>
      </div>
      <div className="nav-right">
        <button className="nav-link" onClick={() => navigate("/about")}>About</button>
        <button className="nav-link" onClick={() => navigate("/blog")}>Blog</button>
        <button className="btn-dark"  onClick={() => navigate("/auth")}>Sign in →</button>
      </div>
    </nav>
  );
};

export default HomeNav;