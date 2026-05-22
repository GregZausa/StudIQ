import { useState } from "react";
import { useInView } from "../../../utils/home/home.hooks";

export const RevealSection = ({ children, delay = 0, className = "" }) => {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

export const ToolCard = ({ emoji, title, desc, tag, index }) => {
  const [hovered, setHovered] = useState(false);
  const [ref, inView] = useInView(0.1);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.55s ease ${index * 60}ms, transform 0.55s ease ${index * 60}ms, background 0.2s, border-color 0.2s, box-shadow 0.2s`,
        background: hovered ? "#0d0d0d" : "#fff",
        border: `1px solid ${hovered ? "#0d0d0d" : "#ebe9e4"}`,
        borderRadius: 16,
        padding: "28px 24px 24px",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        boxShadow: hovered
          ? "0 20px 48px rgba(0,0,0,0.18)"
          : "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 1.5,
          textTransform: "uppercase",
          color: hovered ? "rgba(255,255,255,0.4)" : "#b0a99a",
          fontFamily: "'Cabinet Grotesk', sans-serif",
        }}
      >
        {tag}
      </div>

      <div style={{ fontSize: 28, marginBottom: 16, lineHeight: 1 }}>
        {emoji}
      </div>

      <div
        style={{
          fontFamily: "'Clash Display', sans-serif",
          fontWeight: 600,
          fontSize: 15,
          color: hovered ? "#fff" : "#0d0d0d",
          marginBottom: 8,
          transition: "color 0.2s",
          letterSpacing: "-0.3px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: 13,
          color: hovered ? "rgba(255,255,255,0.55)" : "#8a8278",
          lineHeight: 1.6,
          transition: "color 0.2s",
        }}
      >
        {desc}
      </div>
    </div>
  );
};
