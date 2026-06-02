import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { blogPosts } from "../data/blogData";
import Footer from "./components/layout/Footer";

const Blog = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);

  return (
    <>
      <style>{`
        @import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=cabinet-grotesk@400,500,700,800&display=swap');
        .font-clash   { font-family: 'Clash Display', sans-serif; }
        .font-cabinet { font-family: 'Cabinet Grotesk', sans-serif; }

        /* noise grain */
        .blog-grain::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.02;
          pointer-events: none;
          z-index: 0;
        }
      `}</style>

      <div className="blog-grain min-h-screen bg-[#f7f4ef] font-cabinet text-[#0d0d0d]">
        <div className="relative z-10">
          {/* ── Nav ── */}
          <nav className="sticky top-0 z-20 flex items-center justify-between px-6 lg:px-12 py-4 border-b border-[#ebe9e4] bg-[#f7f4ef]/90 backdrop-blur-md">
            <button
              onClick={() => navigate("/")}
              className="font-clash font-bold text-xl tracking-tight text-[#0d0d0d] cursor-pointer"
            >
              Stud<span className="text-[#2d3be8]">IQ</span>
            </button>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/about")}
                className="text-[13px] font-medium text-[#8a8278] hover:text-[#0d0d0d] cursor-pointer transition-colors"
              >
                About
              </button>
              <button
                onClick={() => navigate("/")}
                className="text-[13px] font-medium text-[#8a8278] hover:text-[#0d0d0d] cursor-pointer transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => navigate("/auth")}
                className="bg-[#0d0d0d] text-white font-clash font-semibold text-[13px] tracking-tight px-5 py-2.5 rounded-xl cursor-pointer hover:bg-[#2d3be8] hover:-translate-y-0.5 transition-all"
              >
                Open app →
              </button>
            </div>
          </nav>

          {/* ── Hero ── */}
          <div className="max-w-5xl mx-auto px-6 lg:px-12 pt-20 pb-14 border-b border-[#ebe9e4]">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-6 h-px bg-[#2d3be8]" />
              <span className="font-clash font-bold text-[11px] tracking-[3px] uppercase text-[#2d3be8]">
                Study Resources
              </span>
            </div>
            <h1 className="font-clash font-bold text-[clamp(40px,6vw,72px)] leading-[0.95] tracking-[-2.5px] text-[#0d0d0d] mb-5">
              Learn how to
              <br />
              learn better.
            </h1>
            <p className="text-[16px] text-[#8a8278] leading-relaxed max-w-lg">
              Evidence-based guides on study techniques, memory science, and
              academic performance — written for Filipino students.
            </p>
          </div>

          {/* ── Article list ── */}
          <div className="max-w-5xl mx-auto px-6 lg:px-12 pb-20">
            {blogPosts.map((post, i) => (
              <button
                key={post.slug}
                onClick={() => navigate(`/blog/${post.slug}`)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className={`w-full text-left grid gap-5 py-7 border-b border-[#ebe9e4] cursor-pointer transition-all group ${
                  i === 0 ? "border-t" : ""
                }`}
                style={{ gridTemplateColumns: "48px 1fr 20px" }}
              >
                {/* Number */}
                <span className="font-clash font-bold text-[12px] tracking-[1.5px] text-[#c8c3ba] pt-1">
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Body */}
                <div>
                  <span className="inline-block font-clash font-bold text-[9px] tracking-[2px] uppercase text-[#2d3be8] bg-[#2d3be8]/8 rounded-full px-3 py-1 mb-2">
                    Guide
                  </span>
                  <h2
                    className={`font-clash font-semibold text-[18px] tracking-[-0.5px] leading-snug mb-2 transition-colors ${
                      hovered === i ? "text-[#2d3be8]" : "text-[#0d0d0d]"
                    }`}
                  >
                    {post.title}
                  </h2>
                  <p className="text-[13px] text-[#8a8278] leading-relaxed max-w-2xl">
                    {post.excerpt}
                  </p>
                  <p className="text-[11px] text-[#b0a99a] font-medium mt-2.5">
                    {post.date} · {post.readTime}
                  </p>
                </div>

                {/* Arrow */}
                <span
                  className={`text-[#2d3be8] text-lg pt-1 transition-all ${
                    hovered === i ? "opacity-100 translate-x-1" : "opacity-0"
                  }`}
                >
                  →
                </span>
              </button>
            ))}
          </div>

          {/* ── CTA banner ── */}
          <div className="max-w-5xl mx-auto px-6 lg:px-12 pb-20">
            <div className="relative bg-[#0d0d0d] rounded-2xl px-10 py-14 lg:py-12 lg:px-16 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 overflow-hidden">
              {/* Glow */}
              <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#2d3be8] opacity-10 blur-[50px]" />

              <div className="relative">
                <h2 className="font-clash font-bold text-[clamp(20px,2.5vw,30px)] tracking-tight text-white leading-tight mb-2">
                  Put these techniques into practice.
                </h2>
                <p className="text-sm text-white/40 leading-relaxed max-w-sm">
                  Stud IQ has all the tools — free for all Filipino students.
                </p>
              </div>

              <button
                onClick={() => navigate("/auth")}
                className="relative shrink-0 bg-white text-[#0d0d0d] font-clash font-bold text-[14px] tracking-tight px-7 py-3.5 rounded-xl cursor-pointer hover:bg-[#2d3be8] hover:text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#2d3be8]/40 transition-all"
              >
                Start studying smarter →
              </button>
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </>
  );
};

export default Blog;
