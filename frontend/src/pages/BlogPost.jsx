import { useParams, useNavigate } from "react-router-dom";
import { blogPosts } from "../data/blogData";
import Footer from "./components/layout/Footer";

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = blogPosts.find((p) => p.slug === slug);
  const postIndex = blogPosts.findIndex((p) => p.slug === slug);
  const nextPost = blogPosts[postIndex + 1] || null;
  const prevPost = blogPosts[postIndex - 1] || null;

  const renderContent = (text) => {
    const lines = text.split("\n");
    const elements = [];
    let paraBuffer = [];

    const flushPara = () => {
      if (paraBuffer.length > 0) {
        const isFirst = elements.filter((e) => e.type === "p").length === 0;
        elements.push(
          <p
            key={elements.length}
            className={`leading-[1.85] mb-5 ${
              isFirst
                ? "text-[17px] font-medium text-[#1a1612] border-l-[3px] border-[#2d3be8] pl-5 -ml-5.75"
                : "text-[16px] text-[#2a2520]"
            }`}
          >
            {paraBuffer.join(" ")}
          </p>,
        );
        paraBuffer = [];
      }
    };

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) {
        flushPara();
        return;
      }
      const isHeading =
        trimmed === trimmed.toUpperCase() &&
        trimmed.length > 5 &&
        /[A-Z]/.test(trimmed);
      if (isHeading) {
        flushPara();
        elements.push(
          <h2
            key={elements.length}
            className="font-clash font-bold text-[11px] tracking-[2.5px] uppercase text-[#0d0d0d] mt-10 mb-4 pb-3 border-b border-[#ebe9e4]"
          >
            {trimmed}
          </h2>,
        );
      } else {
        paraBuffer.push(trimmed);
      }
    });
    flushPara();
    return elements;
  };

  if (!post)
    return (
      <>
        <style>{`@import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=cabinet-grotesk@400,500,700,800&display=swap'); .font-clash { font-family: 'Clash Display', sans-serif; }`}</style>
        <div className="min-h-screen bg-[#f7f4ef] font-cabinet flex flex-col items-center justify-center gap-4">
          <span className="font-clash font-bold text-6xl tracking-[-3px] text-[#0d0d0d]">
            404
          </span>
          <p className="text-sm text-[#8a8278]">Article not found.</p>
          <button
            onClick={() => navigate("/blog")}
            className="bg-[#0d0d0d] text-white font-clash font-semibold text-sm px-6 py-2.5 rounded-xl cursor-pointer hover:bg-[#2d3be8] transition-colors"
          >
            ← Back to Blog
          </button>
        </div>
      </>
    );

  return (
    <>
      <style>{`
        @import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=cabinet-grotesk@400,500,700,800&display=swap');
        .font-clash   { font-family: 'Clash Display', sans-serif; }
        .font-cabinet { font-family: 'Cabinet Grotesk', sans-serif; }

        /* noise grain */
        .bp-grain::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.02;
          pointer-events: none;
          z-index: 0;
        }
      `}</style>

      <div className="bp-grain min-h-screen bg-[#f7f4ef] font-cabinet text-[#0d0d0d]">
        <div className="relative z-10">
          {/* ── Nav ── */}
          <nav className="sticky top-0 z-20 flex items-center justify-between px-6 lg:px-12 py-4 border-b border-[#ebe9e4] bg-[#f7f4ef]/90 backdrop-blur-md">
            <button
              onClick={() => navigate("/")}
              className="font-clash font-bold text-[20px] tracking-tight text-[#0d0d0d] cursor-pointer"
            >
              Stud<span className="text-[#2d3be8]">IQ</span>
            </button>
            <button
              onClick={() => navigate("/blog")}
              className="flex items-center gap-2 border border-[#ebe9e4] hover:border-[#0d0d0d] text-[#8a8278] hover:text-[#0d0d0d] text-xs font-semibold px-3.5 py-2 rounded-lg cursor-pointer transition-all"
            >
              ← All articles
            </button>
          </nav>

          {/* ── Article header ── */}
          <header className="max-w-3xl mx-auto px-6 lg:px-12 pt-16 pb-12 border-b border-[#ebe9e4]">
            <div className="flex items-center gap-4 mb-6">
              <span className="font-clash font-bold text-[9px] tracking-[2.5px] uppercase text-[#2d3be8] bg-[#2d3be8]/8 rounded-full px-3 py-1">
                Study Guide
              </span>
              <span className="text-[12px] text-[#b0a99a] font-medium">
                {post.date}
              </span>
              <span className="text-[#b0a99a]">·</span>
              <span className="text-[12px] text-[#b0a99a] font-medium">
                {post.readTime}
              </span>
            </div>
            <h1 className="font-clash font-bold text-[clamp(30px,5vw,52px)] tracking-[-2px] leading-[1.05] text-[#0d0d0d] mb-5">
              {post.title}
            </h1>
            <p className="text-[17px] text-[#6b6560] leading-relaxed max-w-2xl">
              {post.excerpt}
            </p>
          </header>

          {/* ── Article body ── */}
          <article className="max-w-3xl mx-auto px-6 lg:px-20 pt-12 pb-16">
            {renderContent(post.content)}
          </article>

          {/* ── CTA strip ── */}
          <div className="max-w-3xl mx-auto px-6 lg:px-12 pb-10">
            <div className="relative bg-[#0d0d0d] rounded-2xl px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 overflow-hidden">
              <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full bg-[#2d3be8] opacity-10 blur-2xl" />
              <div className="relative">
                <div className="font-clash font-bold text-[18px] tracking-tight text-white leading-tight mb-1">
                  Put this into practice with Stud IQ.
                </div>
                <div className="text-xs text-white/40">
                  Free tools for Filipino students — no subscription needed.
                </div>
              </div>
              <button
                onClick={() => navigate("/auth")}
                className="relative shrink-0 bg-white text-[#0d0d0d] font-clash font-bold text-[13px] px-6 py-3 rounded-xl cursor-pointer hover:bg-[#2d3be8] hover:text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#2d3be8]/40 transition-all whitespace-nowrap"
              >
                Open Stud IQ →
              </button>
            </div>
          </div>

          {/* ── Prev / Next ── */}
          <div className="max-w-3xl mx-auto px-6 lg:px-12 pt-10 pb-20 border-t border-[#ebe9e4] grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              {prevPost && (
                <button
                  onClick={() => navigate(`/blog/${prevPost.slug}`)}
                  className="w-full text-left border border-[#ebe9e4] hover:border-[#0d0d0d] hover:bg-white rounded-2xl px-5 py-5 cursor-pointer transition-all group"
                >
                  <div className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#b0a99a] mb-2">
                    ← Previous
                  </div>
                  <div className="font-clash font-semibold text-[14px] tracking-[-0.3px] text-[#0d0d0d] leading-snug group-hover:text-[#2d3be8] transition-colors">
                    {prevPost.title}
                  </div>
                </button>
              )}
            </div>
            <div>
              {nextPost && (
                <button
                  onClick={() => navigate(`/blog/${nextPost.slug}`)}
                  className="w-full text-right border border-[#ebe9e4] hover:border-[#0d0d0d] hover:bg-white rounded-2xl px-5 py-5 cursor-pointer transition-all group"
                >
                  <div className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#b0a99a] mb-2">
                    Next →
                  </div>
                  <div className="font-clash font-semibold text-[14px] tracking-[-0.3px] text-[#0d0d0d] leading-snug group-hover:text-[#2d3be8] transition-colors">
                    {nextPost.title}
                  </div>
                </button>
              )}
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </>
  );
};

export default BlogPost;
