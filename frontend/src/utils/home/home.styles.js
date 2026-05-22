const homeStyles = `
  @import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=cabinet-grotesk@400,500,700,800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink:    #0d0d0d;
    --paper:  #f7f4ef;
    --cream:  #fff;
    --accent: #2d3be8;
    --muted:  #8a8278;
    --border: #ebe9e4;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'Cabinet Grotesk', sans-serif;
    background: var(--paper);
    color: var(--ink);
    -webkit-font-smoothing: antialiased;
  }

  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
    opacity: 0.025;
    pointer-events: none;
    z-index: 9999;
  }

  /* ── Animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0);    }
  }

  @keyframes tw-pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.4; }
  }

  @keyframes tw-blink {
    0%, 100% { border-color: var(--accent); }
    50%       { border-color: transparent; }
  }

  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  .nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    padding: 20px 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.35s ease;
  }

  .nav.solid {
    background: rgba(247,244,239,0.9);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    padding: 14px 48px;
  }

  .nav-logo {
    font-family: 'Clash Display', sans-serif;
    font-weight: 700;
    font-size: 22px;
    letter-spacing: -0.5px;
    color: var(--ink);
  }

  .nav-logo .iq { color: var(--accent); }

  .nav-right { display: flex; align-items: center; gap: 12px; }

  .nav-link {
    font-size: 13px;
    font-weight: 500;
    color: var(--muted);
    cursor: pointer;
    background: none;
    border: none;
    transition: color 0.2s;
    font-family: 'Cabinet Grotesk', sans-serif;
    padding: 6px 0;
  }

  .nav-link:hover { color: var(--ink); }

  .btn-dark {
    background: var(--ink);
    color: #fff;
    border: none;
    border-radius: 10px;
    padding: 10px 22px;
    font-family: 'Clash Display', sans-serif;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s ease;
    letter-spacing: -0.2px;
  }

  .btn-dark:hover {
    background: var(--accent);
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(45,59,232,0.3);
  }

  .btn-outline {
    background: transparent;
    color: var(--ink);
    border: 1.5px solid var(--border);
    border-radius: 10px;
    padding: 10px 22px;
    font-family: 'Clash Display', sans-serif;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-outline:hover { border-color: var(--ink); transform: translateY(-1px); }

  .hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 140px 48px 80px;
    max-width: 1100px;
    margin: 0 auto;
    position: relative;
  }

  .hero-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 32px;
    font-family: 'Cabinet Grotesk', sans-serif;
  }

  .hero-eyebrow::before {
    content: '';
    display: block;
    width: 28px;
    height: 1.5px;
    background: var(--accent);
  }

  .hero-title {
    font-family: 'Clash Display', sans-serif;
    font-weight: 700;
    font-size: clamp(52px, 7.5vw, 96px);
    line-height: 0.95;
    letter-spacing: -3px;
    color: var(--ink);
    margin-bottom: 32px;
    max-width: 820px;
  }

  .hero-title em {
    font-style: normal;
    color: var(--accent);
    position: relative;
  }

  .hero-title em::after {
    content: '';
    position: absolute;
    bottom: 8px;
    left: 0; right: 0;
    height: 3px;
    background: var(--accent);
    opacity: 0.3;
  }

  .hero-sub {
    font-size: 17px;
    color: var(--muted);
    line-height: 1.7;
    max-width: 460px;
    margin-bottom: 48px;
    font-weight: 400;
  }

  .typewriter-line {
    font-size: 14px;
    font-weight: 500;
    color: var(--muted);
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: -24px;
    margin-bottom: 48px;
  }

  .tw-dot {
    width: 6px; height: 6px;
    background: #22c55e;
    border-radius: 50%;
    flex-shrink: 0;
    animation: tw-pulse 2s infinite;
  }

  .tw-text {
    color: var(--accent);
    font-weight: 600;
    border-right: 2px solid var(--accent);
    padding-right: 2px;
    animation: tw-blink 0.75s steps(1) infinite;
  }

  .hero-ctas { display: flex; gap: 12px; flex-wrap: wrap; }

  .cta-primary {
    background: var(--ink);
    color: #fff;
    border: none;
    border-radius: 12px;
    padding: 16px 40px;
    font-family: 'Clash Display', sans-serif;
    font-weight: 700;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.2s ease;
    letter-spacing: -0.3px;
  }

  .cta-primary:hover {
    background: var(--accent);
    transform: translateY(-2px);
    box-shadow: 0 16px 40px rgba(45,59,232,0.35);
  }

  .cta-secondary {
    background: transparent;
    color: var(--ink);
    border: 1.5px solid var(--border);
    border-radius: 12px;
    padding: 16px 32px;
    font-family: 'Clash Display', sans-serif;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .cta-secondary:hover { border-color: var(--ink); transform: translateY(-2px); }

  .grid-lines { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }

  .grid-line-v {
    position: absolute;
    top: 0; bottom: 0;
    width: 1px;
    background: linear-gradient(to bottom, transparent, var(--border) 20%, var(--border) 80%, transparent);
    opacity: 0.6;
  }

  .section { max-width: 1100px; margin: 0 auto; padding: 0 48px 120px; }

  .section-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 56px;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--border);
  }

  .section-number {
    font-family: 'Clash Display', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 12px;
  }

  .section-title {
    font-family: 'Clash Display', sans-serif;
    font-weight: 700;
    font-size: clamp(32px, 4vw, 52px);
    letter-spacing: -2px;
    color: var(--ink);
    line-height: 1.0;
  }

  .marquee-wrap {
    overflow: hidden;
    mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
    -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
    padding: 32px 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }

  .marquee-track {
    display: flex;
    gap: 12px;
    animation: marquee 28s linear infinite;
    width: max-content;
  }

  .marquee-pill {
    background: var(--cream);
    border: 1px solid var(--border);
    border-radius: 100px;
    padding: 9px 18px;
    font-size: 12px;
    font-weight: 500;
    color: #6b6560;
    white-space: nowrap;
    flex-shrink: 0;
    font-family: 'Cabinet Grotesk', sans-serif;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: var(--border);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 120px;
  }

  .stat-cell { background: var(--cream); padding: 36px 32px; }

  .stat-number {
    font-family: 'Clash Display', sans-serif;
    font-size: 48px;
    font-weight: 700;
    letter-spacing: -3px;
    color: var(--ink);
    line-height: 1;
    margin-bottom: 6px;
  }

  .stat-number .stat-suffix { font-size: 24px; color: var(--accent); letter-spacing: -1px; }
  .stat-label { font-size: 13px; color: var(--muted); font-weight: 500; }

  .why-grid {
    display: grid;
    grid-template-columns: 1fr 1.4fr;
    gap: 80px;
    align-items: start;
  }

  .why-sticky { position: sticky; top: 120px; }

  .why-item { padding: 28px 0; border-bottom: 1px solid var(--border); }
  .why-item:last-child { border-bottom: none; }

  .why-item-num {
    font-family: 'Clash Display', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    color: var(--accent);
    margin-bottom: 10px;
  }

  .why-item-title {
    font-family: 'Clash Display', sans-serif;
    font-weight: 600;
    font-size: 18px;
    color: var(--ink);
    margin-bottom: 8px;
    letter-spacing: -0.4px;
  }

  .why-item-text { font-size: 14px; color: var(--muted); line-height: 1.7; }

  .article-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    padding: 20px 0;
    border-bottom: 1px solid var(--border);
    cursor: pointer;
    transition: all 0.2s;
  }

  .article-row:first-child { border-top: 1px solid var(--border); }
  .article-row:hover .article-arrow { opacity: 1; transform: translateX(4px); }
  .article-row:hover .article-title { color: var(--accent); }

  .article-idx {
    font-family: 'Clash Display', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.5px;
    color: var(--muted);
    width: 28px;
    flex-shrink: 0;
  }

  .article-title {
    flex: 1;
    font-family: 'Clash Display', sans-serif;
    font-weight: 600;
    font-size: 15px;
    color: var(--ink);
    transition: color 0.2s;
    letter-spacing: -0.3px;
  }

  .article-tag {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--muted);
    flex-shrink: 0;
  }

  .article-arrow {
    color: var(--accent);
    font-size: 18px;
    opacity: 0;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  /* ── Final CTA ── */
  .final-cta {
    background: var(--ink);
    border-radius: 24px;
    padding: 80px 72px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
    position: relative;
    overflow: hidden;
  }

  .final-cta::before {
    content: '';
    position: absolute;
    top: -80px; right: -80px;
    width: 320px; height: 320px;
    background: var(--accent);
    border-radius: 50%;
    opacity: 0.12;
    filter: blur(60px);
  }

  .final-cta-title {
    font-family: 'Clash Display', sans-serif;
    font-weight: 700;
    font-size: clamp(28px, 3.5vw, 44px);
    color: #fff;
    letter-spacing: -1.5px;
    line-height: 1.05;
  }

  .final-cta-right { display: flex; flex-direction: column; gap: 16px; }

  .final-cta-sub { font-size: 15px; color: rgba(255,255,255,0.45); line-height: 1.7; }

  .btn-white {
    background: #fff;
    color: var(--ink);
    border: none;
    border-radius: 12px;
    padding: 16px 36px;
    font-family: 'Clash Display', sans-serif;
    font-weight: 700;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.2s ease;
    align-self: flex-start;
    letter-spacing: -0.3px;
  }

  .btn-white:hover {
    background: var(--accent);
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(45,59,232,0.4);
  }

  @media (max-width: 768px) {
    .nav        { padding: 16px 20px; }
    .nav.solid  { padding: 12px 20px; }
    .hero       { padding: 120px 20px 60px; }
    .section    { padding: 0 20px 80px; }
    .why-grid   { grid-template-columns: 1fr; gap: 40px; }
    .why-sticky { position: static; }
    .final-cta  { grid-template-columns: 1fr; padding: 48px 32px; gap: 32px; }
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .hero-title { letter-spacing: -2px; }
    .section-title { letter-spacing: -1.5px; }
  }
`;

export default homeStyles;
