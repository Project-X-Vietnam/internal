"use client";

import { useEffect, useRef, useState } from "react";
import IntroSection from "@/components/xos/intro-section";
import ExperienceSection from "@/components/xos/experience-section";

// ─── Inline SVG Illustrations ──────────────────────────────────────────────
const KeyLogoSVG = () => (
  <svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto">
    <text x="0" y="30" fontSize="26" fontFamily="Inter Tight, sans-serif" fontWeight="800" fill="#0f172a" letterSpacing="-1">xOS</text>
    <circle cx="107" cy="18" r="8" fill="#2563eb" />
    <path d="M107 14 L107 27" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M107 23 L111 27" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
    <path d="M107 23 L103 27" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
    <circle cx="107" cy="13" r="3" stroke="#0f172a" strokeWidth="2" fill="none" />
  </svg>
);

const TornPaperSVG = () => (
  <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full">
    <path
      d="M0,80 L0,40 L30,55 L60,35 L90,50 L120,30 L150,48 L180,25 L210,45 L240,32 L270,55 L300,38 L330,60 L360,42 L390,58 L420,28 L450,50 L480,35 L510,55 L540,38 L570,62 L600,40 L630,52 L660,33 L690,55 L720,38 L750,58 L780,30 L810,50 L840,35 L870,55 L900,40 L930,62 L960,42 L990,55 L1020,32 L1050,52 L1080,38 L1110,58 L1140,30 L1170,50 L1200,35 L1230,55 L1260,40 L1290,60 L1320,42 L1350,55 L1380,35 L1410,50 L1440,38 L1440,0 L0,0 Z"
      fill="#F2F1ED"
    />
  </svg>
);

// ─── Data ────────────────────────────────────────────────────────────────────



// Fan-card colours & tilts match the original site palette
const MY_PICS = [
  {
    title: "My pic",
    img: "https://storage.tally.so/private/anh-the-promax-Chau.jpg?id=W1ZxQa&accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlcxWnhRYSIsImZvcm1JZCI6IlpqVmdNYSIsImlhdCI6MTc3Mzg0ODkwNn0.ZwDe_Pd1xOlOlasq2CTelJvaIFEeommy_vTKzXeiSbw&signature=a3dc5c8b627776505c08aeea74c2de88edec35ac91182bbc3727362849820535",
    bg: "#F6D0D8",
    tilt: -10,
  },
  {
    title: "Moment represents me",
    img: "https://storage.tally.so/private/z7634460446801_351a234a4ddf155a87114fb2ea815987.jpg?id=EMa4b2&accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkVNYTRiMiIsImZvcm1JZCI6IlpqVmdNYSIsImlhdCI6MTc3Mzg0ODkwNn0.CQKBVy-Tjy14Cz3hf-6X5uoVXTN2rMlxCdqyE5gv1DU&signature=ae162d1b3d8fb3c7e47b6cdd543ea4613bb830ae61f06529ddc91cd6446c5428",
    bg: "#e0e7ff",
    tilt: 10,
  },
];


// Sticky step panels — alternating background colours
const STICKY_STEPS = [
  { step: "Step 1", label: "talk to us", title: "Who do you dream of becoming one day?", desc: "I actually don't dream of becoming anyone else but the best version of myself. I dream of being true, being alive, being imperfect, being whoever I am. As long as I'm the version that's better than my yesterday self, that's cool enough.", bg: "#f8fafc", accent: "#dbeafe" },
  { step: "Step 2", label: "we build defences", title: "What topic could you give a 30-minute talk about with zero preparation?", desc: "If I have to talk about something for 30 minutes then I guess it would be about dogs. I remember most of the breeds' names, and how they look. Shitzu? You name it. Doberman? You name it. Chow chows, Border Collie, English Dachshund... yipee", bg: "#f1f5f9", accent: "#bfdbfe" },
  { step: "Step 3", label: "quarterly reporting", title: "Something you are currently obsessed with?", desc: "Maybe not obsessed but captivated by flowers. Love them. I feel like flowers carry more than just beauty, they also hold many other values about imperfection, instability, humility and quietness", bg: "#ffffff", accent: "#dbeafe" },
  { step: "Step 4", label: "your taxes sorted", title: "What are you probably doing when nobody is watching?", desc: "Talking to my dog about my existential crisis or any other minor issue in life.", bg: "#0f172a", accent: "#1e40af" },
  { step: "Step 5", label: "talk to us", title: "What can people ask you for help with?", desc: "If possible, I can give you some tips on how to: Work with children, Build easy dashboard using PowerBI + AI, Deliver a speech using your humour, body and voice ", bg: "#f8fafc", accent: "#dbeafe" },
  { step: "Step 6", label: "we build defences", title: "What are you currently building or exploring?", desc: "I'm exploring career paths, which I can definitely learn from by hearing stories from different people and also experiencing them myself. Hope you guys can give me some of your own stories about your career life<3", bg: "#f1f5f9", accent: "#bfdbfe" },
];

export default function xOSPage() {
  const [scrolled, setScrolled] = useState(false);
  const [fanProgress, setFanProgress] = useState(0); // 0..1 scroll progress inside fan wrapper

  const fanWrapperRef = useRef<HTMLDivElement>(null);

  // Scroll-triggered changes
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll-progress tracker for the fan wrapper
  useEffect(() => {
    const handleFanScroll = () => {
      const wrapper = fanWrapperRef.current;
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      const wrapperH = wrapper.offsetHeight;
      const vh = window.innerHeight;
      // scrolled = how far into the sticky runway we are
      const scrolled = -rect.top;
      const totalScrollable = wrapperH - vh;
      if (totalScrollable <= 0) return;
      setFanProgress(Math.max(0, Math.min(1, scrolled / totalScrollable)));
    };
    window.addEventListener("scroll", handleFanScroll, { passive: true });
    handleFanScroll(); // run once on mount
    return () => window.removeEventListener("scroll", handleFanScroll);
  }, []);


  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── Fan-cards (Who it's for) ───────────────────────── */

        /* ── Fan wrapper: tall scroll runway ── */
        .fan-wrapper {
          position: relative;
          /* 100vh sticky scene + (N cards × 80vh) runway */
          height: calc(100vh + 5 * 90vh);
          background: #F2F1ED;
        }

        .fan-sticky-scene {
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .fan-header {
          max-width: 1280px;
          margin: 0 auto 32px;
          padding: 0 32px;
        }

        .fan-stage {
          position: relative;
          flex: 1;
          overflow: hidden;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          /* pivot bottom-center so rotation fans correctly */
        }

        .fan-card {
          position: absolute;
          /* cards start off-screen at the bottom */
          bottom: 0;
          left: 50%;
          width: clamp(220px, 20vw, 280px);
          min-height: 300px;
          border-radius: 24px;
          padding: 24px 20px;
          border: 1.5px solid rgba(1,30,23,0.1);
          box-shadow: 0 12px 40px rgba(1,30,23,0.12);
          display: flex;
          flex-direction: column;
          gap: 12px;
          transform-origin: bottom center;
          /* transition only for smoothness within a frame — actual movement is JS-driven */
          transition: transform 0.12s ease-out, opacity 0.12s ease-out;
          will-change: transform, opacity;
        }

        .fan-card-tag {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #94a3b8;
        }

        .fan-card-title {
          font-family: 'Inter Tight', sans-serif;
          font-weight: 800;
          font-size: 22px;
          color: #0f172a;
          line-height: 1.1;
        }

        .fan-card-desc {
          flex: 1;
          border-radius: 12px;
          overflow: hidden;
          margin: 4px 0;
        }

        .fan-card-desc img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          border-radius: 12px;
        }

        .fan-card-arrow {
          width: 40px; height: 40px;
          border-radius: 50%;
          background: #eff6ff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2563eb;
          font-size: 16px;
          margin-top: auto;
          flex-shrink: 0;
        }

        /* ── Sticky Steps ───────────────────────────────────── */

        .sticky-steps-wrapper {
          /* total height = number-of-panels × 100vh */
          /* each panel is 100vh tall and sticky */
        }

        .sticky-step-panel {
          position: sticky;
          top: 0;
          height: 100vh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .sticky-step-inner {
          max-width: 1280px;
          width: 100%;
          margin: 0 auto;
          padding: 0 64px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .sticky-step-left {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .sticky-step-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }

        .sticky-step-num {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #94a3b8;
        }

        .sticky-step-label {
          display: inline-block;
          font-family: 'Inter Tight', sans-serif;
          font-weight: 700;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 5px 16px;
          border-radius: 9999px;
          color: #1e40af;
          background: #dbeafe;
        }

        .sticky-step-title {
          font-family: 'Inter Tight', sans-serif;
          font-weight: 800;
          font-size: clamp(36px, 4.5vw, 68px);
          color: #0f172a;
          line-height: 1.02;
          letter-spacing: -0.01em;
        }

        .sticky-step-title.light { color: #ffffff; }

        .sticky-step-desc {
          font-size: 16px;
          line-height: 1.75;
          color: #475569;
          max-width: 480px;
        }

        .sticky-step-desc.light { color: #cbd5e1; }

        .sticky-step-right {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .sticky-step-blob {
          width: 320px;
          height: 320px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .sticky-step-blob-num {
          font-family: 'Inter Tight', sans-serif;
          font-weight: 800;
          font-size: 180px;
          line-height: 1;
          color: transparent;
          -webkit-text-stroke: 2px currentColor;
          user-select: none;
        }

        @media (max-width: 900px) {
          .fan-stage { height: 600px; }
          .fan-card { width: 220px; min-height: 280px; }
          .sticky-step-inner { grid-template-columns: 1fr; padding: 0 32px; gap: 32px; }
          .sticky-step-right { display: none; }
        }

        body {
          font-family: 'Inter', sans-serif;
          background-color: #f8fafc;
        }

        .page-wrapper {
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
        }

        /* Sticky Header */
        .header {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          background-color: ${scrolled ? "#F2F1ED" : "transparent"};
          backdrop-filter: ${scrolled ? "blur(10px)" : "none"};
          border-bottom: ${scrolled ? "1px solid rgba(1,30,23,0.1)" : "none"};
          transition: all 0.3s ease;
        }

        .header-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 32px;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .nav-center {
          display: flex;
          gap: 32px;
          align-items: center;
        }

        .nav-link {
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #0f172a;
          text-decoration: none;
          letter-spacing: 0.02em;
          position: relative;
          padding-bottom: 2px;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 0; height: 1.5px;
          background: #2563eb;
          transition: width 0.3s ease;
        }

        .nav-link:hover::after { width: 100%; }

        .btn-outline {
          padding: 8px 20px;
          border: 1.5px solid #e2e8f0;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 600;
          color: #0f172a;
          background: transparent;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s ease;
          letter-spacing: 0.02em;
        }

        .btn-outline:hover {
          background: #f8fafc;
          color: #0f172a;
        }

        .btn-primary {
          padding: 10px 24px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          background: #2563eb;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s ease;
          letter-spacing: 0.02em;
          border: none;
        }

        .btn-primary:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.25);
        }



        /* Steps */
        .steps-section {
          background: transparent;
        }

        .steps-list {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .step-item {
          display: grid;
          grid-template-columns: 180px 1fr;
          gap: 32px;
          padding: 32px 0;
          border-top: 1px solid #e2e8f0;
          position: relative;
          transition: background 0.2s ease;
        }

        .step-item:last-child {
          border-bottom: 1px solid #e2e8f0;
        }

        .step-left {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .step-num {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #94a3b8;
        }

        .step-label {
          font-family: 'Inter Tight', sans-serif;
          font-weight: 700;
          font-size: 16px;
          color: #1e40af;
          background: #dbeafe;
          padding: 4px 12px;
          border-radius: 9999px;
          display: inline-block;
          width: fit-content;
        }

        .step-right {}

        .step-title {
          font-family: 'Inter Tight', sans-serif;
          font-weight: 800;
          font-size: clamp(28px, 3vw, 48px);
          color: #0f172a;
          line-height: 1.05;
          margin-bottom: 14px;
          letter-spacing: -0.01em;
        }

        .step-desc {
          font-size: 15px;
          line-height: 1.7;
          color: #475569;
          max-width: 600px;
        }



        /* Footer */
        .footer {
          background: #020617;
          position: relative;
        }

        .footer-torn {
          display: block;
          width: 100%;
          line-height: 0;
        }

        .footer-content {
          padding: 0 32px 60px;
          max-width: 1280px;
          margin: 0 auto;
        }

        .footer-logo-row {
          padding: 40px 0 48px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          margin-bottom: 48px;
        }

        .footer-logo-text {
          font-family: 'Inter Tight', sans-serif;
          font-weight: 800;
          font-size: clamp(60px, 8vw, 120px);
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(255,255,255,0.2);
          letter-spacing: -0.02em;
          line-height: 0.95;
        }

        .footer-links-col {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 60px;
        }

        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 28px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        .footer-copy {
          font-size: 12px;
          color: #64748b;
        }

        .footer-badges {
          display: flex;
          gap: 10px;
        }

        .footer-badge {
          padding: 4px 12px;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 9999px;
          font-size: 11px;
          color: #94a3b8;
          font-weight: 600;
        }

        /* Mobile menu */
        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          color: #0f172a;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .nav-center { display: none; }
          .mobile-menu-btn { display: block; }
          .step-item { grid-template-columns: 1fr; gap: 16px; }
        }

        /* Scroll fade-in */
        .fade-in {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .fade-in.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      <div className="page-wrapper">
        {/* ── Header ─────────────────────────────────────── */}
        <header className="header">
          <div className="header-inner">
            {/* Logo */}
            <a href="#" style={{ textDecoration: "none" }}>
              <KeyLogoSVG />
            </a>

            {/* Nav */}
            <nav className="nav-center" style={{ display: "flex", gap: "30px", alignItems: "center" }}>
              <a href="#" className="nav-link">Home</a>
              <a href="#about" className="nav-link">About</a>
              <a href="#experience" className="nav-link">Experience</a>
            </nav>
          </div>
        </header>
        {/* ── S1 & S2: Intro + About ─────────────────────────────── */}
        <IntroSection />

        {/* ── S3: Experience Bento ─────────────────────────── */}
        <ExperienceSection />



        {/* ══════════════════════════════════════════════════════ */}
        {/* ── NEW SECTION 1: Fan-cards scroll-driven (Who it's for) */}
        {/* ══════════════════════════════════════════════════════ */}
        <div className="fan-wrapper" ref={fanWrapperRef}>
          <div className="fan-sticky-scene">
            {/* Heading */}
            <div className="fan-header">
              <p className="section-tag" style={{ marginBottom: 14 }}>Who it&apos;s for</p>
              <h2 className="section-title" style={{ marginBottom: 0 }}>
                Me in my<br />
                <em>Environment</em>
              </h2>
            </div>

            {/* Card stage */}
            <div className="fan-stage">
              {(() => {
                const N = MY_PICS.length; // 5
                const slotSize = 1 / N;    // 0.2 per card
                // Fan-out starts once all cards are in (progress > 0.85)
                const fanFactor = Math.max(0, Math.min(1, (fanProgress - 0.80) / 0.20));
                const cardW = 260; // px — approximate card width
                const spread = cardW * 0.85; // horizontal spread in full fan
                const centerIdx = Math.floor(N / 2);

                return MY_PICS.map((card, i) => {
                  // --- scroll progress for this card slot ---
                  const slotStart = i * slotSize;
                  const cardProgress = Math.max(0, Math.min(1,
                    (fanProgress - slotStart) / slotSize
                  ));

                  // ease-out interpolation
                  const ease = 1 - Math.pow(1 - cardProgress, 3);

                  // Y: slide up from 110% below → 0% (settled)
                  const translateY = (1 - ease) * 110; // %

                  // X: spread only once ALL cards have arrived
                  const targetX = (i - centerIdx) * spread;
                  const translateX = fanFactor * targetX;

                  // Rotation: each card already has its final tilt from the start
                  // so it slides up already tilted (like real cards dealt from a deck)
                  const rotate = card.tilt;

                  // Z-index: later cards (higher i) sit on top during stacking
                  // but centre card sits on top in final fan
                  const zIndex = cardProgress > 0.5
                    ? i + 1   // stacking order
                    : 0;

                  return (
                    <div
                      key={i}
                      className="fan-card"
                      style={{
                        backgroundColor: card.bg,
                        marginLeft: `-${cardW / 2}px`, // center the card at left:50%
                        zIndex,
                        opacity: cardProgress > 0.05 ? 1 : 0,
                        transform: [
                          `translateX(${translateX}px)`,
                          `translateY(${translateY}%)`,
                          `rotate(${rotate}deg)`,
                        ].join(" "),
                      }}
                    >
                      <span className="fan-card-tag">For</span>
                      <h3 className="fan-card-title">{card.title}</h3>
                      <div className="fan-card-desc">
                        <img
                          src={card.img}
                          alt={card.title}
                        />
                      </div>
                      <div className="fan-card-arrow">→</div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════ */}
        {/* ── NEW SECTION 2: Sticky Steps Panels ────────────────── */}
        {/* ══════════════════════════════════════════════════════ */}
        <div className="sticky-steps-wrapper">
          {STICKY_STEPS.map((s, i) => {
            const isDark = s.bg === "#0f172a";
            return (
              <div
                key={s.step}
                className="sticky-step-panel"
                style={{
                  backgroundColor: s.bg,
                  // each panel stacks above the previous (z-index)
                  zIndex: i + 10,
                }}
              >
                <div className="sticky-step-inner">
                  {/* Left: text content */}
                  <div className="sticky-step-left">
                    <div className="sticky-step-badge">
                      <span className="sticky-step-num">{s.step}</span>
                      <span
                        className="sticky-step-label"
                        style={{ backgroundColor: s.accent }}
                      >
                        {s.label}
                      </span>
                    </div>
                    <h2 className={`sticky-step-title${isDark ? " light" : ""}`}>
                      {s.title}
                    </h2>
                    <p className={`sticky-step-desc${isDark ? " light" : ""}`}>
                      {s.desc}
                    </p>
                    <a
                      href="#"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        marginTop: 8,
                        fontWeight: 700,
                        fontSize: 14,
                        color: isDark ? s.accent : "#2563eb",
                        textDecoration: "none",
                        letterSpacing: "0.04em",
                      }}
                    >
                    </a>
                  </div>

                  {/* Right: large ghost step number as visual */}
                  <div className="sticky-step-right">
                    <div
                      className="sticky-step-blob"
                      style={{ backgroundColor: s.accent }}
                    >
                      <span
                        className="sticky-step-blob-num"
                        style={{ color: s.accent, WebkitTextStrokeColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(1,30,23,0.15)" }}
                      >
                        {i + 1}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>


        {/* ── Footer ──────────────────────────────────────── */}
        <footer className="footer">
          <div className="footer-torn">
            <TornPaperSVG />
          </div>

          <div className="footer-content">
            <div className="footer-logo-row">
              <div className="footer-logo-text">xOS</div>
            </div>

            <div className="footer-links-col">
              {/* Tagline col */}
              <div>
                <p style={{ fontSize: "14px", lineHeight: "1.75", color: "rgba(242,241,237,0.5)", maxWidth: "260px", marginBottom: "24px" }}>
                  A personal portfolio designed as a seamless operating system.
                </p>
                <a href="#" className="btn-outline" style={{ color: "#2563eb", borderColor: "#2563eb", fontSize: "13px" }}>
                  Contact Me →
                </a>
              </div>
            </div>

            <div className="footer-bottom">
              <p className="footer-copy">
                © {new Date().getFullYear()} xOS | Built by Chau
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
