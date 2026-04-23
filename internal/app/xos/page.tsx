"use client";

import { useEffect, useRef, useState } from "react";
import IntroSection from "@/components/xos/intro-section";
import ExperienceSection from "@/components/xos/experience-section";
import MyPicSection from "@/components/xos/mypic-section";
import DetailSection from "@/components/xos/detail-section";

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
      fill="#DBEAFE"
    />
  </svg>
);

// ─── Data ────────────────────────────────────────────────────────────────────

export default function xOSPage() {
  const [scrolled, setScrolled] = useState(false);

  // Scroll-triggered changes
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <>
      {/* Local Fonts - Plus Jakarta Sans & SF Pro Display */}
      <style>{`

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── Section Shared ─────────────────────────────────── */
        .section-tag {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #2563eb;
          opacity: 1;
          margin-bottom: 12px;
        }

        .section-title {
          font-family: 'SF Pro Display', sans-serif;
          font-weight: 700;
          font-size: clamp(42px, 5vw, 80px);
          line-height: 0.98;
          letter-spacing: -0.02em;
          color: #0f172a;
          margin-bottom: 32px;
        }

        .section-title em {
          font-style: normal;
          color: #2563eb;
        }

        /* ── Page Specific Base Styles ─────────────────────────────────── */

        body {
          font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
          background-color: #ffffff;
        }

        .page-wrapper {
          min-height: 100vh;
          font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
          background-color: #ffffff;
          background-image:
            linear-gradient(rgba(37,99,235,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(37,99,235,0.06) 1px, transparent 1px);
          background-size: 40px 40px;
          position: relative;
        }

        /* Soft blue corner glow fixed behind all content */
        .page-wrapper::before {
          content: '';
          position: fixed;
          top: -100px;
          left: -100px;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(147,197,253,0.4) 0%, rgba(196,220,255,0.15) 50%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .header {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          background-color: ${scrolled ? "rgba(255, 255, 255, 0.85)" : "transparent"};
          backdrop-filter: ${scrolled ? "blur(10px)" : "none"};
          border-bottom: ${scrolled ? "1px solid rgba(15,23,42,0.08)" : "none"};
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
          font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
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
          font-family: 'SF Pro Display', sans-serif;
          font-weight: 600;
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
          font-family: 'SF Pro Display', sans-serif;
          font-weight: 700;
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
          background: #f0f4ff;
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
          border-bottom: 1px solid rgba(15,23,42,0.1);
          margin-bottom: 48px;
        }

        .footer-logo-text {
          font-family: 'SF Pro Display', sans-serif;
          font-weight: 700;
          font-size: clamp(60px, 8vw, 120px);
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(15,23,42,0.15);
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
          border-top: 1px solid rgba(15,23,42,0.1);
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
          border: 1px solid rgba(15,23,42,0.2);
          border-radius: 9999px;
          font-size: 11px;
          color: #475569;
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
        {/* ── S1: Intro + About ─────────────────────────────── */}
        <IntroSection />

        {/* ── S2: Experience Bento ─────────────────────────── */}
        <ExperienceSection />

        {/* ── S3: My Pic Section ─────────────────────────── */}
        <MyPicSection />

        {/* ── S4: Sticky Steps Panels ────────────────── */}
        <DetailSection />

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
                <p style={{ fontSize: "14px", lineHeight: "1.75", color: "rgba(15,23,42,0.55)", maxWidth: "260px", marginBottom: "24px" }}>
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
