"use client";

import { useEffect, useRef, useState } from "react";

// ─── Inline SVG Illustrations ───────────────────────────────────────────────

const TaxManSVG = ({ mugged }: { mugged: boolean }) => (
  <svg viewBox="0 0 320 480" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Body */}
    <ellipse cx="160" cy="360" rx="80" ry="110" fill="#011E17" />
    {/* Suit lapels */}
    <path d="M130 280 L160 350 L190 280 L175 260 L160 300 L145 260 Z" fill="#1a3a2e" />
    {/* Tie */}
    <path d="M155 290 L160 350 L165 290 L162 280 L160 295 L158 280 Z" fill="#C6EFD1" />
    {/* Head */}
    <ellipse cx="160" cy="200" rx="60" ry="65" fill="#f4c58a" />
    {/* Eyes */}
    <ellipse cx="140" cy="195" rx="8" ry="9" fill="white" />
    <ellipse cx="180" cy="195" rx="8" ry="9" fill="white" />
    <circle cx="142" cy="196" r="5" fill="#011E17" />
    <circle cx="182" cy="196" r="5" fill="#011E17" />
    <circle cx="143" cy="194" r="2" fill="white" />
    <circle cx="183" cy="194" r="2" fill="white" />
    {/* Nose */}
    {mugged ? (
      <g>
        {/* Nose pin / clothes peg */}
        <ellipse cx="160" cy="213" rx="10" ry="6" fill="#f4c58a" />
        <rect x="148" y="207" width="24" height="4" rx="2" fill="#FF6B35" />
        <rect x="150" y="211" width="4" height="8" rx="1" fill="#FF6B35" />
        <rect x="166" y="211" width="4" height="8" rx="1" fill="#FF6B35" />
      </g>
    ) : (
      <ellipse cx="160" cy="213" rx="10" ry="6" fill="#e8a96a" />
    )}
    {/* Mouth */}
    <path d="M148 228 Q160 238 172 228" stroke="#a0662a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    {/* Ears */}
    <ellipse cx="100" cy="200" rx="12" ry="16" fill="#f4c58a" />
    <ellipse cx="220" cy="200" rx="12" ry="16" fill="#f4c58a" />
    {/* Hair / Hat */}
    <path d="M105 165 Q130 130 160 128 Q190 130 215 165" fill="#2d1a0a" />
    <rect x="100" y="155" width="120" height="18" rx="4" fill="#2d1a0a" />
    {/* Briefcase */}
    <rect x="200" y="320" width="70" height="55" rx="8" fill="#1a3a2e" />
    <rect x="220" y="312" width="30" height="14" rx="6" fill="none" stroke="#1a3a2e" strokeWidth="4" />
    <rect x="200" y="343" width="70" height="4" fill="#0d2419" />
    <rect x="228" y="330" width="14" height="14" rx="3" fill="#C6EFD1" />
    {/* Legs */}
    <rect x="130" y="460" width="28" height="20" rx="6" fill="#011E17" />
    <rect x="162" y="460" width="28" height="20" rx="6" fill="#011E17" />
    {/* HMRC text on briefcase */}
    <text x="215" y="340" fontSize="8" fill="#C6EFD1" fontFamily="monospace" fontWeight="bold">HMRC</text>
  </svg>
);

const KeyLogoSVG = () => (
  <svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto">
    <text x="0" y="30" fontSize="26" fontFamily="Anton, sans-serif" fill="#011E17" letterSpacing="1">xOS</text>
    <circle cx="107" cy="18" r="8" fill="#C6EFD1" />
    <path d="M107 14 L107 27" stroke="#011E17" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M107 23 L111 27" stroke="#011E17" strokeWidth="2" strokeLinecap="round" />
    <path d="M107 23 L103 27" stroke="#011E17" strokeWidth="2" strokeLinecap="round" />
    <circle cx="107" cy="13" r="3" stroke="#011E17" strokeWidth="2" fill="none" />
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

const ABOUT_ME = [
  { title: "University", desc: "National Economics University (NEU)" },
  { title: "DOB", desc: "30/02/2005" },
  { title: "Email", desc: "chau@gmail.com" },
  { title: "Phone number", desc: "00000000" },
];

const EXPERIENCE = [
  { title: "Organizations / Side quests / Competitions", desc: "- Volunteer - Vietnam Youth Music Institution - Volunteer - Hanoi Grapevin" },
  { title: "Courses", desc: "- Microsoft Power BI Data Analyst - Datapot" },
  { title: "A tool you use that most people probably haven’t heard of", desc: "If it's something people haven't heard of then I don't think I have any." },
  { title: "Work experience", desc: "ABCDEF" },
];

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
    bg: "#C6EFD1",
    tilt: 10,
  },
];


// Sticky step panels — alternating background colours
const STICKY_STEPS = [
  { step: "Step 1", label: "talk to us", title: "Who do you dream of becoming one day?", desc: "I actually don't dream of becoming anyone else but the best version of myself. I dream of being true, being alive, being imperfect, being whoever I am. As long as I'm the version that's better than my yesterday self, that's cool enough.", bg: "#F2F1ED", accent: "#C6EFD1" },
  { step: "Step 2", label: "we build defences", title: "What topic could you give a 30-minute talk about with zero preparation?", desc: "If I have to talk about something for 30 minutes then I guess it would be about dogs. I remember most of the breeds' names, and how they look. Shitzu? You name it. Doberman? You name it. Chow chows, Border Collie, English Dachshund... yipee", bg: "#C6EFD1", accent: "#F6D0D8" },
  { step: "Step 3", label: "quarterly reporting", title: "Something you are currently obsessed with?", desc: "Maybe not obsessed but captivated by flowers. Love them. I feel like flowers carry more than just beauty, they also hold many other values about imperfection, instability, humility and quietness", bg: "#F6D0D8", accent: "#C6EFD1" },
  { step: "Step 4", label: "your taxes sorted", title: "What are you probably doing when nobody is watching?", desc: "Talking to my dog about my existential crisis or any other minor issue in life.", bg: "#011E17", accent: "#C6EFD1" },
  { step: "Step 5", label: "talk to us", title: "What can people ask you for help with?", desc: "If possible, I can give you some tips on how to: Work with children, Build easy dashboard using PowerBI + AI, Deliver a speech using your humour, body and voice ", bg: "#F2F1ED", accent: "#C6EFD1" },
  { step: "Step 6", label: "we build defences", title: "What are you currently building or exploring?", desc: "I'm exploring career paths, which I can definitely learn from by hearing stories from different people and also experiencing them myself. Hope you guys can give me some of your own stories about your career life<3", bg: "#C6EFD1", accent: "#F6D0D8" },
];

const FOOTER_LINKS = {
  Services: ["Onboarding Phase", "Quarterly Reports", "Annual Accounts & Corporation Tax", "VAT", "Payroll & Pensions", "Self Assessment", "Making Tax Digital (MTD)"],
  Company: ["Who we help", "Our Community", "Team", "Our Story"],
  Resources: ["Case Studies", "Guides", "News", "Newsletter", "Videos"],
};

// ─── Main Component ──────────────────────────────────────────────────────────

export default function xOSPage() {
  const [mugged, setMugged] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [bgColor, setBgColor] = useState("#F2F1ED");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [fanProgress, setFanProgress] = useState(0); // 0..1 scroll progress inside fan wrapper



  const heroRef = useRef<HTMLDivElement>(null);
  const whoRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const whyRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const fanWrapperRef = useRef<HTMLDivElement>(null);

  // Scroll-triggered background color changes
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
      const y = window.scrollY;
      const whoTop = whoRef.current?.offsetTop ?? 0;
      const servicesTop = servicesRef.current?.offsetTop ?? 0;
      const whyTop = whyRef.current?.offsetTop ?? 0;
      const stepsTop = stepsRef.current?.offsetTop ?? 0;

      if (y >= stepsTop - 200) setBgColor("#F6D0D8");
      else if (y >= whyTop - 200) setBgColor("#C6EFD1");
      else if (y >= servicesTop - 200) setBgColor("#F6D0D8");
      else if (y >= whoTop - 200) setBgColor("#C6EFD1");
      else setBgColor("#F2F1ED");
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

  const cardsVisible = 3;
  const maxIndex = Math.max(0, ABOUT_ME.length - cardsVisible);

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@300;400;500;600;700&display=swap');

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
          margin: 0 auto 48px;
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
          min-height: 340px;
          border-radius: 24px;
          padding: 36px 30px;
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
          color: #011E17;
          opacity: 0.45;
        }

        .fan-card-title {
          font-family: 'Anton', sans-serif;
          font-size: 22px;
          text-transform: uppercase;
          color: #011E17;
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
          background: #011E17;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #C6EFD1;
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
          color: #011E17;
          opacity: 0.4;
        }

        .sticky-step-label {
          display: inline-block;
          font-family: 'Anton', sans-serif;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 5px 16px;
          border-radius: 100px;
          color: #011E17;
        }

        .sticky-step-title {
          font-family: 'Anton', sans-serif;
          font-size: clamp(36px, 4.5vw, 68px);
          text-transform: uppercase;
          color: #011E17;
          line-height: 1.02;
        }

        .sticky-step-title.light { color: #F2F1ED; }

        .sticky-step-desc {
          font-size: 16px;
          line-height: 1.75;
          color: #011E17;
          opacity: 0.65;
          max-width: 480px;
        }

        .sticky-step-desc.light { color: #F2F1ED; opacity: 0.7; }

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
          font-family: 'Anton', sans-serif;
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
          background-color: ${bgColor};
          transition: background-color 0.8s ease;
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
          color: #011E17;
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
          background: #011E17;
          transition: width 0.3s ease;
        }

        .nav-link:hover::after { width: 100%; }

        .btn-outline {
          padding: 8px 20px;
          border: 1.5px solid #011E17;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 600;
          color: #011E17;
          background: transparent;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s ease;
          letter-spacing: 0.02em;
        }

        .btn-outline:hover {
          background: #011E17;
          color: #F2F1ED;
        }

        .btn-primary {
          padding: 10px 24px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 700;
          color: #F2F1ED;
          background: #011E17;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s ease;
          letter-spacing: 0.02em;
          border: none;
        }

        .btn-primary:hover {
          background: #0d3326;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(1,30,23,0.25);
        }

        /* Hero */
        .hero {
          min-height: 100vh;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 32px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 48px;
          padding-top: 72px;
        }

        .hero-left { padding-right: 24px; }

        .hero-tag {
          display: inline-block;
          background: #011E17;
          color: #C6EFD1;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 6px 14px;
          border-radius: 100px;
          margin-bottom: 28px;
        }

        .hero-title {
          font-family: 'Anton', sans-serif;
          font-size: clamp(52px, 6vw, 96px);
          line-height: 0.95;
          letter-spacing: 0.01em;
          text-transform: uppercase;
          color: #011E17;
          margin-bottom: 24px;
        }

        .hero-title span {
          color: transparent;
          -webkit-text-stroke: 2px #011E17;
        }

        .hero-sub {
          font-size: 16px;
          line-height: 1.7;
          color: #011E17;
          opacity: 0.75;
          max-width: 420px;
          margin-bottom: 24px;
        }

        .hero-buttons {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 48px;
        }

        .hero-features {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .hero-feature {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 500;
          color: #011E17;
        }

        .hero-feature::before {
          content: '';
          width: 20px; height: 20px;
          border-radius: 50%;
          background: #C6EFD1;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .feature-check {
          width: 20px; height: 20px;
          border-radius: 50%;
          background: #C6EFD1;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .hero-right {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          height: 520px;
        }

        .hero-illustration {
          height: 460px;
          width: auto;
          position: relative;
          z-index: 1;
          animation: float 4s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-16px); }
        }

        .mug-btn {
          position: absolute;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          padding: 10px 22px;
          border: 2px solid #011E17;
          border-radius: 100px;
          background: #F2F1ED;
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #011E17;
          cursor: pointer;
          z-index: 2;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .mug-btn:hover {
          background: #011E17;
          color: #C6EFD1;
        }

        /* Section shared */
        .section {
          padding: 100px 32px;
          transition: background-color 0.8s ease;
        }

        .section-inner {
          max-width: 1280px;
          margin: 0 auto;
        }

        .section-tag {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #011E17;
          opacity: 0.55;
          margin-bottom: 16px;
        }

        .section-title {
          font-family: 'Anton', sans-serif;
          font-size: clamp(42px, 5vw, 80px);
          line-height: 0.98;
          letter-spacing: 0.01em;
          text-transform: uppercase;
          color: #011E17;
          margin-bottom: 56px;
        }

        .section-title em {
          font-style: normal;
          color: transparent;
          -webkit-text-stroke: 2px #011E17;
        }

        /* Who it's for */
        .who-section { background: transparent; }

        .carousel-wrapper {
          position: relative;
          overflow: hidden;
        }

        .carousel-track {
          display: flex;
          gap: 20px;
          transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .who-card {
          flex: 0 0 calc(33.333% - 14px);
          background: white;
          border-radius: 20px;
          padding: 36px;
          min-height: 200px;
          border: 1px solid rgba(1,30,23,0.08);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .who-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(1,30,23,0.1);
        }

        .who-card-title {
          font-family: 'Anton', sans-serif;
          font-size: 22px;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          color: #011E17;
          margin-bottom: 12px;
        }

        .who-card-desc {
          font-size: 14px;
          line-height: 1.65;
          color: #011E17;
          opacity: 0.65;
        }

        .carousel-controls {
          display: flex;
          gap: 12px;
          margin-top: 28px;
          align-items: center;
        }

        .carousel-btn {
          width: 44px; height: 44px;
          border-radius: 50%;
          border: 1.5px solid #011E17;
          background: transparent;
          color: #011E17;
          font-size: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .carousel-btn:hover:not(:disabled) {
          background: #011E17;
          color: #F2F1ED;
        }

        .carousel-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        /* Services */
        .services-section {
          background: #F6D0D8;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .service-card {
          background: #F2F1ED;
          border-radius: 20px;
          padding: 36px;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .service-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(1,30,23,0.12);
        }

        .service-num {
          font-family: 'Anton', sans-serif;
          font-size: 48px;
          color: #C6EFD1;
          line-height: 1;
          margin-bottom: 12px;
        }

        .service-title {
          font-family: 'Anton', sans-serif;
          font-size: 20px;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          color: #011E17;
          margin-bottom: 10px;
        }

        .service-desc {
          font-size: 14px;
          line-height: 1.65;
          color: #011E17;
          opacity: 0.65;
        }

        /* Why Choose  */
        .why-section {
          background: #C6EFD1;
        }

        .why-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 40px;
        }

        .why-card {
          background: #F2F1ED;
          border-radius: 20px;
          padding: 36px;
          display: flex;
          gap: 20px;
          align-items: flex-start;
          transition: transform 0.25s ease;
        }

        .why-card:hover { transform: translateY(-4px); }

        .why-icon {
          width: 44px; height: 44px;
          border-radius: 50%;
          background: #011E17;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #C6EFD1;
          font-size: 18px;
        }

        .why-title {
          font-family: 'Anton', sans-serif;
          font-size: 20px;
          text-transform: uppercase;
          color: #011E17;
          margin-bottom: 8px;
        }

        .why-desc {
          font-size: 14px;
          line-height: 1.65;
          color: #011E17;
          opacity: 0.65;
        }

        /* Steps */
        .steps-section {
          background: #F2F1ED;
        }

        .steps-list {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .step-item {
          display: grid;
          grid-template-columns: 180px 1fr;
          gap: 48px;
          padding: 48px 0;
          border-top: 1px solid rgba(1,30,23,0.12);
          position: relative;
          transition: background 0.2s ease;
        }

        .step-item:last-child {
          border-bottom: 1px solid rgba(1,30,23,0.12);
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
          color: #011E17;
          opacity: 0.45;
        }

        .step-label {
          font-family: 'Anton', sans-serif;
          font-size: 16px;
          text-transform: uppercase;
          color: #011E17;
          background: #C6EFD1;
          padding: 4px 12px;
          border-radius: 100px;
          display: inline-block;
          width: fit-content;
        }

        .step-right {}

        .step-title {
          font-family: 'Anton', sans-serif;
          font-size: clamp(28px, 3vw, 48px);
          text-transform: uppercase;
          color: #011E17;
          line-height: 1.05;
          margin-bottom: 14px;
        }

        .step-desc {
          font-size: 15px;
          line-height: 1.7;
          color: #011E17;
          opacity: 0.65;
          max-width: 600px;
        }

        /* CTA Banner */
        .cta-section {
          background: #011E17;
          padding: 80px 32px;
          text-align: center;
        }

        .cta-inner {
          max-width: 700px;
          margin: 0 auto;
        }

        .cta-tag {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #C6EFD1;
          opacity: 0.7;
          margin-bottom: 20px;
        }

        .cta-title {
          font-family: 'Anton', sans-serif;
          font-size: clamp(40px, 5vw, 72px);
          text-transform: uppercase;
          line-height: 0.98;
          color: #F2F1ED;
          margin-bottom: 36px;
        }

        .btn-cta {
          padding: 14px 36px;
          border-radius: 100px;
          font-size: 15px;
          font-weight: 700;
          color: #011E17;
          background: #C6EFD1;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s ease;
          letter-spacing: 0.02em;
          border: none;
          display: inline-block;
        }

        .btn-cta:hover {
          background: #aee8bf;
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        /* Footer */
        .footer {
          background: #011E17;
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
          border-bottom: 1px solid rgba(198,239,209,0.15);
          margin-bottom: 48px;
        }

        .footer-logo-text {
          font-family: 'Anton', sans-serif;
          font-size: clamp(60px, 8vw, 120px);
          text-transform: uppercase;
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(198,239,209,0.3);
          letter-spacing: 0.02em;
          line-height: 0.95;
        }

        .footer-links-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 48px;
          margin-bottom: 60px;
        }

        .footer-col-title {
          font-family: 'Anton', sans-serif;
          font-size: 14px;
          text-transform: uppercase;
          color: #C6EFD1;
          margin-bottom: 20px;
          letter-spacing: 0.06em;
        }

        .footer-link {
          display: block;
          font-size: 13px;
          color: rgba(242,241,237,0.55);
          text-decoration: none;
          margin-bottom: 10px;
          transition: color 0.2s ease;
        }

        .footer-link:hover { color: #F2F1ED; }

        .footer-bottom {
          border-top: 1px solid rgba(198,239,209,0.12);
          padding-top: 28px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        .footer-copy {
          font-size: 12px;
          color: rgba(242,241,237,0.35);
        }

        .footer-badges {
          display: flex;
          gap: 10px;
        }

        .footer-badge {
          padding: 4px 12px;
          border: 1px solid rgba(198,239,209,0.2);
          border-radius: 100px;
          font-size: 11px;
          color: rgba(198,239,209,0.5);
          font-weight: 600;
        }

        /* Mobile menu */
        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          color: #011E17;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .hero {
            grid-template-columns: 1fr;
            padding-top: 96px;
            text-align: center;
          }
          .hero-right { height: 340px; }
          .hero-illustration { height: 300px; }
          .hero-sub, .hero-features { max-width: 100%; align-items: center; }
          .hero-buttons { justify-content: center; }
          .nav-center { display: none; }
          .mobile-menu-btn { display: block; }
          .services-grid { grid-template-columns: 1fr 1fr; }
          .why-grid { grid-template-columns: 1fr; }
          .footer-links-grid { grid-template-columns: 1fr 1fr; }
          .step-item { grid-template-columns: 1fr; gap: 16px; }
          .who-card { flex: 0 0 calc(100% - 14px); }
        }

        @media (max-width: 600px) {
          .services-grid { grid-template-columns: 1fr; }
          .footer-links-grid { grid-template-columns: 1fr; }
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
              <a href="#" className="nav-link">Members Hub</a>
              <a href="#" className="nav-link">Resource Hub</a>
            </nav>

            {/* CTA buttons */}
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <a href="#" className="btn-outline">View pricing</a>
              <a href="#" className="btn-primary">Talk to us</a>
            </div>
          </div>
        </header>
        {/* ── Theme Song ──────────────────────────────────── */}
        <section className="cta-section" style={{ paddingTop: "100px", paddingBottom: "40px" }}>
          <div className="cta-inner">
            <h2 className="cta-title" style={{ fontSize: "48px", marginBottom: "0" }}>
              Listen to this while ...
            </h2>
            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: "16px", boxShadow: "0 10px 30px rgba(1, 30, 23, 0.4)", maxWidth: "480px", margin: "24px auto 0" }}>
              <iframe
                src="https://www.youtube.com/embed/rScwLoES2bM?si=7UOJc_od3uAMOZNg"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
              ></iframe>
            </div>
          </div>
        </section>

        {/* ── Hero ───────────────────────────────────────── */}
        <section ref={heroRef}>
          <div className="hero">
            <div className="hero-left">
              <span className="hero-tag">Operations Member</span>
              <h1 className="hero-title">
                Ngọc
                <span></span>
                <span> Châu</span>
              </h1>
              <p className="hero-sub">
                Yipee - or meo, when I'm overstimulated
              </p>


              <div className="hero-features">
                {["Fun", "Alivee", "True"].map((f) => (
                  <div key={f} className="hero-feature">
                    <span className="feature-check">
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="#011E17" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {f}
                  </div>
                ))}
              </div>
              {/* CTA buttons */}
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <a href="#" className="btn-outline" style={{ marginTop: "40px" }}>Facebook</a>
                <a href="#" className="btn-primary" style={{ marginTop: "40px" }}>LinkedIn</a>
              </div>
            </div>

            <div className="hero-right">
              <div className="hero-illustration">
                <TaxManSVG mugged={mugged} />
              </div>
              <button className="mug-btn" onClick={() => setMugged((m) => !m)}>
                {mugged ? "😤 Nose Pin On!" : "Click To Mug Off"}
              </button>
            </div>
          </div>
        </section>


        {/* ── Who it's for ────────────────────────────────── */}
        <section className="section who-section" ref={whoRef}>
          <div className="section-inner">
            <p className="section-tag">Who am I</p>
            <h2 className="section-title">
              About<br />
              <em>Me</em>
            </h2>

            <div className="carousel-wrapper">
              <div
                className="carousel-track"
                style={{ transform: `translateX(calc(-${carouselIndex} * (33.333% + 7px)))` }}
              >
                {ABOUT_ME.map((item, i) => (
                  <div key={item.title} className="who-card">
                    <div className="service-num">0{i + 1}</div>
                    <h3 className="who-card-title">{item.title}</h3>
                    <p className="who-card-desc">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="carousel-controls">
              <button
                className="carousel-btn"
                onClick={() => setCarouselIndex((i) => Math.max(0, i - 1))}
                disabled={carouselIndex === 0}
              >
                ←
              </button>
              <button
                className="carousel-btn"
                onClick={() => setCarouselIndex((i) => Math.min(maxIndex, i + 1))}
                disabled={carouselIndex >= maxIndex}
              >
                →
              </button>
              <span style={{ fontSize: "13px", color: "#011E17", opacity: 0.45, marginLeft: "8px" }}>
                {carouselIndex + 1} / {maxIndex + 1}
              </span>
            </div>
          </div>
        </section>


        {/* ── Why Choose Us ───────────────────────────────── */}
        <section className="section why-section" ref={whyRef}>
          <div className="section-inner">
            <p className="section-tag">What I&apos;ve done</p>
            <h2 className="section-title">
              My<br />
              <em>Experience</em>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", alignItems: "start" }}>
              <p style={{ fontSize: "16px", lineHeight: "1.75", color: "#011E17", opacity: 0.7 }}>
                Bespoke accounting for creatives. We encounter and resolve your challenges every day so you can focus on what you do best.
              </p>
            </div>
            <div className="why-grid" style={{ marginTop: "40px" }}>
              {EXPERIENCE.map((w, i) => (
                <div key={w.title} className="why-card">
                  <div className="why-icon">
                    {["💬", "😌", "📋", "🤝"][i]}
                  </div>
                  <div>
                    <h3 className="why-title">{w.title}</h3>
                    <p className="why-desc">{w.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>



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
            const isDark = s.bg === "#011E17";
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
                        color: isDark ? s.accent : "#011E17",
                        textDecoration: "none",
                        letterSpacing: "0.04em",
                        textTransform: "uppercase" as const,
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

            <div className="footer-links-grid">
              {/* Tagline col */}
              <div>
                <p style={{ fontSize: "14px", lineHeight: "1.75", color: "rgba(242,241,237,0.5)", maxWidth: "260px", marginBottom: "24px" }}>
                  Accountants for UK-based creatives who'd rather be creating.
                </p>
                <a href="#" className="btn-outline" style={{ color: "#C6EFD1", borderColor: "rgba(198,239,209,0.3)", fontSize: "13px" }}>
                  Talk to us →
                </a>
              </div>

              {/* Link cols */}
              {Object.entries(FOOTER_LINKS).map(([col, links]) => (
                <div key={col}>
                  <p className="footer-col-title">{col}</p>
                  {links.map((link) => (
                    <a key={link} href="#" className="footer-link">{link}</a>
                  ))}
                </div>
              ))}
            </div>

            <div className="footer-bottom">
              <p className="footer-copy">
                © 2026 xOS Limited | Company No. 14184586 | Registered Office: 10 Spinney Nook, Bolton, BL2 4BB, England
              </p>
              <div className="footer-badges">
                <span className="footer-badge">AccountsSorted</span>
                <span className="footer-badge">TaxPaid</span>
                <span className="footer-badge">PeaceOfMind</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
