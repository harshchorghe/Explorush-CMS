"use client";

import { client } from "@/lib/sanity";
import Link from "next/link";
import Image from "next/image";

/* ─────────────────────────────────────────────
   GLOBAL STYLES  (inject once via a <style> tag)
───────────────────────────────────────────────*/
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:ital,wght@0,300;0,400;1,300&display=swap');

  :root {
    --bg:       #050810;
    --surface:  #0b0f1e;
    --border:   rgba(255,255,255,0.07);
    --accent:   #00ffe0;
    --accent2:  #ff4d6d;
    --gold:     #ffd166;
    --text:     #e8eaf6;
    --muted:    #5a607a;
    --card-bg:  rgba(255,255,255,0.03);
    --glow:     0 0 40px rgba(0,255,224,0.18);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    overflow-x: hidden;
    cursor: none;
  }

  /* ── Custom cursor ── */
  .cursor-dot {
    position: fixed; top: 0; left: 0; z-index: 9999;
    width: 10px; height: 10px; border-radius: 50%;
    background: var(--accent);
    pointer-events: none;
    transform: translate(-50%,-50%);
    transition: transform .08s ease, opacity .2s;
    mix-blend-mode: difference;
  }
  .cursor-ring {
    position: fixed; top: 0; left: 0; z-index: 9998;
    width: 36px; height: 36px; border-radius: 50%;
    border: 1px solid var(--accent);
    pointer-events: none;
    transform: translate(-50%,-50%);
    transition: transform .22s ease, width .2s, height .2s, opacity .2s;
    opacity: 0.5;
  }
  a:hover ~ .cursor-ring, button:hover ~ .cursor-ring { width: 56px; height: 56px; opacity: 0.8; }

  /* ── Noise overlay ── */
  body::before {
    content: '';
    position: fixed; inset: 0; z-index: 1;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    opacity: 0.5;
  }

  /* ── Grid lines decoration ── */
  .grid-lines {
    position: absolute; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(0,255,224,.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,255,224,.03) 1px, transparent 1px);
    background-size: 60px 60px;
  }

  /* ── Reveal animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(36px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes scanline {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(0,255,224,0.2); }
    50%       { box-shadow: 0 0 50px rgba(0,255,224,0.5); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-12px); }
  }
  @keyframes orbit {
    from { transform: rotate(0deg) translateX(120px) rotate(0deg); }
    to   { transform: rotate(360deg) translateX(120px) rotate(-360deg); }
  }
  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }

  .reveal { opacity: 0; animation: fadeUp .8s ease forwards; }
  .reveal-d1 { animation-delay: .1s; }
  .reveal-d2 { animation-delay: .25s; }
  .reveal-d3 { animation-delay: .4s; }
  .reveal-d4 { animation-delay: .55s; }
  .reveal-d5 { animation-delay: .7s; }

  /* ── Section headings ── */
  .section-label {
    font-family: 'Syne', sans-serif;
    font-size: 11px;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 12px;
  }
  .section-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(28px, 4vw, 48px);
    font-weight: 800;
    line-height: 1.1;
    color: var(--text);
  }

  /* ── Cards ── */
  .card {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
    text-decoration: none;
    color: var(--text);
    display: block;
    position: relative;
    transition: border-color .35s ease, transform .35s ease, box-shadow .35s ease;
    backdrop-filter: blur(8px);
  }
  .card::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(0,255,224,0.04), transparent 60%);
    opacity: 0;
    transition: opacity .35s ease;
    z-index: 0;
  }
  .card:hover {
    border-color: rgba(0,255,224,0.35);
    transform: translateY(-6px);
    box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(0,255,224,0.1);
  }
  .card:hover::before { opacity: 1; }

  .card-img-wrap {
    position: relative; overflow: hidden; height: 200px;
  }
  .card-img-wrap img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform .6s ease;
    filter: saturate(0.8) brightness(0.9);
  }
  .card:hover .card-img-wrap img {
    transform: scale(1.07);
    filter: saturate(1.1) brightness(1);
  }

  /* scanline on card hover */
  .card-img-wrap::after {
    content: '';
    position: absolute; left: 0; right: 0; top: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
    animation: scanline 2.5s linear infinite;
    opacity: 0;
    transition: opacity .3s;
  }
  .card:hover .card-img-wrap::after { opacity: 0.6; }

  .card-body {
    padding: 18px 20px 22px;
    position: relative; z-index: 1;
  }
  .card-tag {
    font-size: 10px; letter-spacing: 3px; text-transform: uppercase;
    color: var(--accent); margin-bottom: 8px;
    font-family: 'Syne', sans-serif;
  }
  .card-title {
    font-family: 'Syne', sans-serif;
    font-size: 17px; font-weight: 700; line-height: 1.3;
    color: var(--text);
    margin-bottom: 6px;
  }
  .card-meta {
    font-size: 13px; color: var(--muted); font-style: italic;
  }
  .card-arrow {
    position: absolute; bottom: 20px; right: 20px;
    width: 32px; height: 32px; border-radius: 50%;
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; color: var(--muted);
    transition: all .3s ease;
    z-index: 1;
  }
  .card:hover .card-arrow {
    border-color: var(--accent);
    color: var(--accent);
    background: rgba(0,255,224,0.08);
  }

  /* ── Nav ── */
  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 48px;
    backdrop-filter: blur(20px);
    background: rgba(5,8,16,0.75);
    border-bottom: 1px solid var(--border);
    animation: fadeIn .6s ease both;
  }
  .nav-logo {
    font-family: 'Syne', sans-serif;
    font-size: 20px; font-weight: 800;
    color: var(--text);
    text-decoration: none;
    display: flex; align-items: center; gap: 8px;
  }
  .nav-logo span {
    display: inline-block; width: 8px; height: 8px;
    border-radius: 50%; background: var(--accent);
    animation: pulse-glow 2s ease infinite;
  }
  .nav-links {
    display: flex; gap: 32px; list-style: none;
  }
  .nav-links a {
    font-size: 13px; letter-spacing: 1px;
    color: var(--muted); text-decoration: none;
    text-transform: uppercase;
    transition: color .2s;
    position: relative;
  }
  .nav-links a::after {
    content: ''; position: absolute; left: 0; bottom: -3px;
    width: 0; height: 1px; background: var(--accent);
    transition: width .3s ease;
  }
  .nav-links a:hover { color: var(--text); }
  .nav-links a:hover::after { width: 100%; }
  .nav-cta {
    padding: 9px 22px; border-radius: 8px;
    border: 1px solid var(--accent);
    color: var(--accent); font-size: 13px;
    text-decoration: none;
    font-family: 'Syne', sans-serif;
    letter-spacing: 1px;
    transition: all .25s ease;
  }
  .nav-cta:hover {
    background: var(--accent); color: var(--bg);
    box-shadow: var(--glow);
  }

  /* ── Hero ── */
  .hero {
    position: relative; min-height: 100vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center;
    padding: 120px 24px 80px;
    overflow: hidden;
  }
  .hero-bg {
    position: absolute; inset: 0; z-index: 0;
  }
  .hero-bg img {
    width: 100%; height: 100%; object-fit: cover;
    filter: brightness(0.2) saturate(0.6);
  }
  .hero-bg::after {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 50% 100%, rgba(0,255,224,0.12), transparent),
      linear-gradient(to top, var(--bg) 15%, transparent 60%);
  }
  .hero-eyebrow {
    position: relative; z-index: 2;
    font-size: 11px; letter-spacing: 5px;
    text-transform: uppercase; color: var(--accent);
    margin-bottom: 20px;
    animation: fadeUp .8s .2s ease both;
    display: flex; align-items: center; gap: 12px;
  }
  .hero-eyebrow::before,
  .hero-eyebrow::after {
    content: ''; width: 40px; height: 1px; background: var(--accent); opacity: 0.5;
  }
  .hero-h1 {
    position: relative; z-index: 2;
    font-family: 'Syne', sans-serif;
    font-size: clamp(52px, 10vw, 120px);
    font-weight: 800;
    line-height: 0.95;
    letter-spacing: -2px;
    animation: fadeUp .9s .35s ease both;
  }
  .hero-h1 .line-accent { color: var(--accent); display: block; }
  .hero-sub {
    position: relative; z-index: 2;
    max-width: 480px;
    font-size: 17px; font-weight: 300;
    color: rgba(232,234,246,0.6);
    line-height: 1.7;
    margin: 24px auto 0;
    animation: fadeUp .9s .5s ease both;
  }
  .hero-actions {
    position: relative; z-index: 2;
    display: flex; gap: 16px; justify-content: center;
    margin-top: 40px;
    animation: fadeUp .9s .65s ease both;
  }
  .btn-primary {
    padding: 14px 32px; border-radius: 10px;
    background: var(--accent); color: var(--bg);
    font-family: 'Syne', sans-serif; font-weight: 700;
    font-size: 14px; letter-spacing: 1px;
    text-decoration: none;
    transition: all .3s ease;
    box-shadow: 0 0 30px rgba(0,255,224,0.3);
  }
  .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 0 50px rgba(0,255,224,0.5); }
  .btn-ghost {
    padding: 14px 32px; border-radius: 10px;
    border: 1px solid var(--border);
    color: var(--text);
    font-family: 'Syne', sans-serif; font-weight: 400;
    font-size: 14px; letter-spacing: 1px;
    text-decoration: none;
    transition: all .3s ease;
  }
  .btn-ghost:hover { border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.05); }

  /* floating stats */
  .hero-stats {
    position: relative; z-index: 2;
    display: flex; gap: 48px; justify-content: center;
    margin-top: 64px;
    animation: fadeIn 1s 1s ease both;
  }
  .stat-item { text-align: center; }
  .stat-num {
    font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 800;
    color: var(--text);
    line-height: 1;
  }
  .stat-num span { color: var(--accent); }
  .stat-label { font-size: 11px; letter-spacing: 2px; color: var(--muted); margin-top: 4px; text-transform: uppercase; }

  /* scroll indicator */
  .scroll-hint {
    position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%);
    z-index: 2;
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    animation: fadeIn 1s 1.2s ease both;
  }
  .scroll-hint span { font-size: 10px; letter-spacing: 3px; color: var(--muted); text-transform: uppercase; }
  .scroll-line {
    width: 1px; height: 48px;
    background: linear-gradient(var(--accent), transparent);
    animation: float 2s ease infinite;
  }

  /* ── Marquee ticker ── */
  .ticker {
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    background: var(--surface);
    overflow: hidden; padding: 14px 0;
    position: relative; z-index: 2;
  }
  .ticker-track {
    display: flex; gap: 0;
    animation: marquee 30s linear infinite;
    width: max-content;
  }
  .ticker-item {
    display: flex; align-items: center; gap: 16px;
    padding: 0 40px;
    font-family: 'Syne', sans-serif;
    font-size: 13px; letter-spacing: 2px; text-transform: uppercase;
    color: var(--muted);
    white-space: nowrap;
  }
  .ticker-item span { color: var(--accent); font-size: 18px; }

  /* ── Sections ── */
  .section {
    position: relative;
    padding: 100px 48px;
    max-width: 1400px;
    margin: 0 auto;
  }
  .section-header {
    display: flex; align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 52px;
    gap: 20px;
  }
  .see-all {
    font-size: 12px; letter-spacing: 2px; text-transform: uppercase;
    color: var(--muted); text-decoration: none;
    display: flex; align-items: center; gap: 8px;
    transition: color .2s;
    white-space: nowrap;
  }
  .see-all:hover { color: var(--accent); }

  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
  }

  /* stagger cards */
  .card-grid .card:nth-child(1) { animation: fadeUp .7s .1s ease both; }
  .card-grid .card:nth-child(2) { animation: fadeUp .7s .25s ease both; }
  .card-grid .card:nth-child(3) { animation: fadeUp .7s .4s ease both; }

  /* ── Featured trip (big card) ── */
  .trip-featured {
    grid-column: span 2;
  }
  .trip-featured .card-img-wrap { height: 320px; }

  /* ── Divider ── */
  .section-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--border), transparent);
    margin: 0 48px;
  }

  /* ── Vlog section dark ── */
  .section-dark {
    background: var(--surface);
    padding: 100px 0;
  }
  .section-dark .section { max-width: 1400px; margin: 0 auto; }

  /* play badge */
  .play-badge {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%,-50%) scale(0.8);
    width: 52px; height: 52px; border-radius: 50%;
    background: rgba(0,255,224,0.15);
    border: 1px solid rgba(0,255,224,0.4);
    display: flex; align-items: center; justify-content: center;
    color: var(--accent); font-size: 18px;
    opacity: 0;
    transition: opacity .3s, transform .3s;
    backdrop-filter: blur(4px);
    z-index: 2;
  }
  .card:hover .play-badge { opacity: 1; transform: translate(-50%,-50%) scale(1); }

  /* ── Footer ── */
  footer {
    background: var(--surface);
    border-top: 1px solid var(--border);
    padding: 60px 48px 40px;
  }
  .footer-inner {
    max-width: 1400px; margin: 0 auto;
    display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 24px;
  }
  .footer-logo {
    font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800;
    color: var(--text);
  }
  .footer-links { display: flex; gap: 28px; list-style: none; }
  .footer-links a {
    font-size: 13px; letter-spacing: 1px;
    color: var(--muted); text-decoration: none;
    transition: color .2s;
  }
  .footer-links a:hover { color: var(--accent); }
  .footer-copy { font-size: 12px; color: var(--muted); margin-top: 40px; text-align: center; }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    nav { padding: 16px 24px; }
    .nav-links, .nav-cta { display: none; }
    .section { padding: 64px 24px; }
    .section-divider { margin: 0 24px; }
    .trip-featured { grid-column: span 1; }
    .trip-featured .card-img-wrap { height: 220px; }
    .hero-stats { gap: 28px; }
    footer { padding: 48px 24px 32px; }
    .footer-inner { flex-direction: column; align-items: flex-start; }
  }
`;

/* ─────────────────────────────────────────────
   DATA FETCH
───────────────────────────────────────────────*/
async function getHomepageData() {
  return await client.fetch(`{
    "trips": *[_type == "trip"] | order(startDate desc)[0...3]{
      _id, title, slug, location,
      coverImage{ asset->{ url } }
    },
    "blogs": *[_type == "blog"] | order(_createdAt desc)[0...3]{
      _id, title, slug,
      coverImage{ asset->{ url } }
    },
    "vlogs": *[_type == "vlog"] | order(_createdAt desc)[0...3]{
      _id, title, slug,
      thumbnail{ asset->{ url } }
    }
  }`);
}

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────*/
export default async function HomePage() {
  const { trips, blogs, vlogs } = await getHomepageData();

  const tickerItems = [
    "Trips", "Vlogs", "Blogs", "Adventures",
    "Destinations", "Stories", "Wanderlust",
    "Explore", "Discover", "Travel",
  ];
  // duplicate for seamless loop
  const ticker = [...tickerItems, ...tickerItems];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      {/* Custom cursor */}
      <div className="cursor-dot" id="cur-dot" />
      <div className="cursor-ring" id="cur-ring" />
      <script dangerouslySetInnerHTML={{
        __html: `
          const dot = document.getElementById('cur-dot');
          const ring = document.getElementById('cur-ring');
          document.addEventListener('mousemove', e => {
            dot.style.left = e.clientX + 'px';
            dot.style.top  = e.clientY + 'px';
            ring.style.left = e.clientX + 'px';
            ring.style.top  = e.clientY + 'px';
          });
        `
      }} />

      {/* ── NAV ── */}
      <nav>
        <a href="/" className="nav-logo">
          <span />
          Explorush
        </a>
        <ul className="nav-links">
          <li><a href="/trips">Trips</a></li>
          <li><a href="/vlogs">Vlogs</a></li>
          <li><a href="/blogs">Blogs</a></li>
          <li><a href="/about">About</a></li>
        </ul>
        <Link href="/trips" className="nav-cta">Explore Now</Link>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="grid-lines" />
        <div className="hero-bg">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1800&q=80"
            alt="Travel hero"
          />
        </div>

        <p className="hero-eyebrow">The World Is Calling</p>

        <h1 className="hero-h1">
          Explorush
        </h1>

        <p className="hero-sub">
          Real journeys. Raw stories. Every trip a chapter,
          every destination a world undiscovered.
        </p>

        <div className="hero-actions">
          <Link href="/trips" className="btn-primary">Explore Trips</Link>
          <Link href="/vlogs" className="btn-ghost">Watch Vlogs</Link>
        </div>

        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-num">{trips.length}<span>+</span></div>
            <div className="stat-label">Trips</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">{vlogs.length}<span>+</span></div>
            <div className="stat-label">Vlogs</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">{blogs.length}<span>+</span></div>
            <div className="stat-label">Blogs</div>
          </div>
        </div>

        <div className="scroll-hint">
          <span>Scroll</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="ticker">
        <div className="ticker-track">
          {ticker.map((item, i) => (
            <div key={i} className="ticker-item">
              <span>✦</span>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* ── TRIPS ── */}
      <section className="section">
        <div className="section-header reveal reveal-d1">
          <div>
            <p className="section-label">Adventures</p>
            <h2 className="section-title">Featured Trips</h2>
          </div>
          <Link href="/trips" className="see-all">
            All Trips →
          </Link>
        </div>

        <div className="card-grid">
          {trips.map((trip: any, i: number) => (
            <Link
              key={trip._id}
              href={`/trips/${trip.slug?.current}`}
              className={`card ${i === 0 ? "trip-featured" : ""}`}
            >
              {trip.coverImage?.asset?.url && (
                <div className="card-img-wrap">
                  <Image
                    src={trip.coverImage.asset.url}
                    alt={trip.title}
                    width={800}
                    height={320}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              )}
              <div className="card-body">
                <p className="card-tag">Trip</p>
                <h3 className="card-title">{trip.title}</h3>
                {trip.location && <p className="card-meta">📍 {trip.location}</p>}
              </div>
              <div className="card-arrow">↗</div>
            </Link>
          ))}
        </div>
      </section>

      <div className="section-divider" />

      {/* ── VLOGS ── */}
      <div className="section-dark">
        <section className="section" style={{ padding: "100px 48px" }}>
          <div className="section-header reveal reveal-d1">
            <div>
              <p className="section-label">Watch</p>
              <h2 className="section-title">Latest Vlogs</h2>
            </div>
            <Link href="/vlogs" className="see-all">All Vlogs →</Link>
          </div>

          <div className="card-grid">
            {vlogs.map((vlog: any) => (
              <Link
                key={vlog._id}
                href={`/vlogs/${vlog.slug?.current}`}
                className="card"
              >
                {vlog.thumbnail?.asset?.url && (
                  <div className="card-img-wrap">
                    <Image
                      src={vlog.thumbnail.asset.url}
                      alt={vlog.title}
                      width={600}
                      height={340}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div className="play-badge">▶</div>
                  </div>
                )}
                <div className="card-body">
                  <p className="card-tag">Vlog</p>
                  <h3 className="card-title">{vlog.title}</h3>
                </div>
                <div className="card-arrow">↗</div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* ── BLOGS ── */}
      <section className="section">
        <div className="section-header reveal reveal-d1">
          <div>
            <p className="section-label">Read</p>
            <h2 className="section-title">Latest Blogs</h2>
          </div>
          <Link href="/blogs" className="see-all">All Blogs →</Link>
        </div>

        <div className="card-grid">
          {blogs.map((blog: any) => (
            <Link
              key={blog._id}
              href={`/blogs/${blog.slug?.current}`}
              className="card"
            >
              {blog.coverImage?.asset?.url && (
                <div className="card-img-wrap">
                  <Image
                    src={blog.coverImage.asset.url}
                    alt={blog.title}
                    width={600}
                    height={340}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              )}
              <div className="card-body">
                <p className="card-tag">Blog</p>
                <h3 className="card-title">{blog.title}</h3>
              </div>
              <div className="card-arrow">↗</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <div className="footer-inner">
          <div className="footer-logo">Explorush<span style={{ color: "var(--accent)" }}>.</span></div>
          <ul className="footer-links">
            <li><a href="/trips">Trips</a></li>
            <li><a href="/vlogs">Vlogs</a></li>
            <li><a href="/blogs">Blogs</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </div>
        <p className="footer-copy">© 2026 Explorush. All rights reserved. Explore the world, one story at a time.</p>
      </footer>
    </>
  );
}