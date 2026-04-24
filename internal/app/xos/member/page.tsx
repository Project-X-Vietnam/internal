"use client";

import { useEffect, useRef, useState } from "react";
import IntroSection from "@/components/xos/intro-section";
import ExperienceSection from "@/components/xos/experience-section";
import MyPicSection from "@/components/xos/mypic-section";
import DetailSection from "@/components/xos/detail-section";

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
        {/* ── S1: Intro + About ─────────────────────────────── */}
        <IntroSection />

        {/* ── S2: Experience Bento ─────────────────────────── */}
        <ExperienceSection />

        {/* ── S3: My Pic Section ─────────────────────────── */}
        <MyPicSection />

        {/* ── S4: Sticky Steps Panels ────────────────── */}
        <DetailSection />


      </div>
    </>
  );
}
