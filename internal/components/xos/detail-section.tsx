"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Folder from "./Folder";

/** Three photo-card-style papers inside the Folder for step 01 */
const WHO_I_AM_FOLDER_PAPERS: React.ReactNode[] = [
  <React.Fragment key="watching">
    <span className="fpc-chip">ABOUT ME</span>
    <span className="fpc-title">When nobody&apos;s watching:</span>
    <span className="fpc-body">
      Talking to my dog about my existential crisis or any other minor issue in life.
    </span>
  </React.Fragment>,
  <React.Fragment key="obsessed">
    <span className="fpc-chip">CURRENTLY OBSESSED</span>
    <span className="fpc-title">Currently obsessed with:</span>
    <span className="fpc-body">
      Maybe not obsessed but captivated by flowers. Love them. I feel like flowers carry more than just beauty, they also hold many other values about imperfection, instability, humility and quietness.
    </span>
  </React.Fragment>,
  <React.Fragment key="talk">
    <span className="fpc-chip">30-MIN TALK</span>
    <span className="fpc-title">30-min talk with zero prep:</span>
    <span className="fpc-body">
      Ummm, if I have to talk about something for 30 minutes then I guess it would be about dogs. I remember most of the breeds&apos; names, and how they look. Shitzu? You name it. Doberman? You name it. Chow chows, Border Collie, English Dachshund... yipee (or meo, when I&apos;m overstimulated).
    </span>
  </React.Fragment>,
];

const STICKY_STEPS = [
  {
    step: "01",
    label: "Who I Am behind closed doors",
    title: "",
    /** Rendered as interactive Folder instead of plain text */
    desc: null as React.ReactNode,
    bg: "#FFFFFF",
    accent: "#0E56FA", /* Brand blue highlight for keywords on white */
    textColor: "#1A2B6D",
  },
  {
    step: "02",
    label: "For now, I'm building…",
    title: "Exploring momentum and direction",
    desc: null as React.ReactNode, /* rendered by Step02Content */
    bg: "#0E56FA",
    accent: "#C8DCFF",
    textColor: "#FFFFFF",
  },
  {
    step: "03",
    label: "I dream of becoming…",
    title: "Just the true version of myself",
    desc: null as React.ReactNode, /* rendered by Step03Content */
    bg: "#1A2B6D",
    accent: "#C8DCFF",
    textColor: "#FFFFFF",
  },
];



/* ─── Step 02: Typewriter title + floating emoji reactions ─── */
function useTypewriter(text: string, active: boolean, speed = 40) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    if (!active) { setDisplayed(""); return; }
    setDisplayed("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, active, speed]);
  return displayed;
}

type FloatingEmoji = { id: number; x: number; emoji: string };

function Step02Content({ active }: { active: boolean }) {
  const title = useTypewriter("Exploring momentum and direction", active, 35);
  const [emojis, setEmojis] = useState<FloatingEmoji[]>([]);
  const counterRef = useRef(0);

  const spawnEmojis = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const parentRect = (e.currentTarget as HTMLElement).closest(".bareis-right")?.getBoundingClientRect();
    const x = rect.left - (parentRect?.left ?? 0) + rect.width / 2;
    const pool = ["❤️", "🚀", "🌱", "✨", "💼", "🙌", "📖", "💡"];
    const batch: FloatingEmoji[] = Array.from({ length: 6 }, () => ({
      id: counterRef.current++,
      x: x + (Math.random() - 0.5) * 80,
      emoji: pool[Math.floor(Math.random() * pool.length)],
    }));
    setEmojis(prev => [...prev, ...batch]);
    setTimeout(() => {
      setEmojis(prev => prev.filter(em => !batch.find(b => b.id === em.id)));
    }, 1400);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", position: "relative" }}>
      <style>{`
        @keyframes emoji-fly {
          0%   { transform: translateY(0) scale(1);   opacity: 1; }
          100% { transform: translateY(-90px) scale(1.3); opacity: 0; }
        }
        .emoji-float {
          position: absolute;
          bottom: 0;
          font-size: 22px;
          pointer-events: none;
          animation: emoji-fly 1.3s ease-out forwards;
          z-index: 10;
        }
        @keyframes shimmer-line {
          0%, 100% { background-position: -200% center; }
          50%       { background-position: 200% center; }
        }
        .keyword-shimmer {
          background: linear-gradient(90deg, #C8DCFF 25%, #ffffff 50%, #C8DCFF 75%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
          animation: shimmer-line 2.5s linear infinite;
        }
        .career-life-btn {
          cursor: pointer;
          position: relative;
          font-weight: 700;
          text-decoration: underline wavy #C8DCFF;
          text-underline-offset: 3px;
          transition: transform 0.15s;
        }
        .career-life-btn:hover { transform: scale(1.05); }
        .career-life-btn:active { transform: scale(0.97); }
      `}</style>
      <h3 style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: 700,
        fontSize: "clamp(28px, 3.5vw, 48px)",
        lineHeight: 1.15,
        color: "#FFFFFF",
        letterSpacing: "-0.01em",
        minHeight: "2.3em",
        margin: 0,
      }}>
        {title}<span style={{ opacity: 0.5 }}>{active && title.length < 34 ? "▍" : ""}</span>
      </h3>
      <div style={{ fontSize: 18, lineHeight: 1.7, color: "#FFFFFF" }}>
        I&apos;m exploring <span className="keyword-shimmer">career paths</span>, which I can definitely learn from by hearing stories from different people and also experiencing them myself.
      </div>
      <div style={{ fontSize: 18, lineHeight: 1.7, color: "#FFFFFF", position: "relative" }}>
        Hope you guys can give me some of your own stories about your{" "}
        <span className="career-life-btn" onClick={spawnEmojis}>
          career life {"<3"}
        </span>
        {emojis.map(em => (
          <span key={em.id} className="emoji-float" style={{ left: em.x }}>{em.emoji}</span>
        ))}
      </div>
    </div>
  );
}

/* ─── Step 03: Floating particles + glow keywords ─── */
type Particle = { id: number; x: number; size: number; delay: number; dur: number };

function Step03Content({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) { setParticles([]); return; }
    const ps: Particle[] = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 90 + 5,
      size: Math.random() * 6 + 3,
      delay: Math.random() * 3,
      dur: Math.random() * 4 + 5,
    }));
    setParticles(ps);
  }, [active]);

  return (
    <div style={{ position: "relative", overflow: "hidden", padding: "4px 0" }}>
      <style>{`
        @keyframes particle-rise {
          0%   { transform: translateY(0) scale(1);   opacity: 0; }
          15%  { opacity: 0.6; }
          85%  { opacity: 0.3; }
          100% { transform: translateY(-120px) scale(0.4); opacity: 0; }
        }
        @keyframes keyword-glow {
          0%, 100% { text-shadow: 0 0 8px rgba(200,220,255,0.4); }
          50%       { text-shadow: 0 0 20px rgba(200,220,255,1), 0 0 40px rgba(200,220,255,0.5); }
        }
        .glow-keyword {
          font-weight: 700;
          color: #C8DCFF;
          animation: keyword-glow 2.5s ease-in-out infinite;
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-color: rgba(200,220,255,0.4);
        }
        .glow-keyword:hover {
          animation-duration: 0.6s;
        }
        .step03-particle {
          position: absolute;
          bottom: 0;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(200,220,255,0.9) 0%, rgba(14,86,250,0.3) 100%);
          pointer-events: none;
          animation: particle-rise linear infinite;
        }
        @keyframes line-reveal {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .step03-line {
          animation: line-reveal 0.55s ease-out both;
        }
        .step03-line:nth-child(2) { animation-delay: 0.25s; }
      `}</style>

      {particles.map(p => (
        <span
          key={p.id}
          className="step03-particle"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      <div style={{ display: "flex", flexDirection: "column", gap: "24px", fontSize: "20px", lineHeight: 1.8, position: "relative", zIndex: 1 }}>
        <p className="step03-line" style={{ margin: 0, color: "#FFFFFF" }}>
          I actually don&apos;t dream of becoming anyone else but{" "}
          <span className="glow-keyword">the best version of myself</span>.{" "}
          I dream of being true, being alive, being imperfect, being whoever I am.
        </p>
        <p className="step03-line" style={{ margin: 0, color: "#FFFFFF" }}>
          As long as I&apos;m the version that&apos;s better than my{" "}
          <span className="glow-keyword">yesterday self</span>, that&apos;s cool enough.
        </p>
      </div>
    </div>
  );
}
/** 3-D perspective tilt heading — same effect as "MY PICTURES" */
function TiltedHeading({ children }: { children: React.ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-80, 0, 80], [30, 12, -12]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-80, 0, 80], [-30, -12, 12]), { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <div style={{ perspective: 1000 }} className="inline-block relative z-20 hover:z-30">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative px-6 py-3 md:px-8 md:py-4 bg-[#0E56FA] transform -skew-x-6 cursor-crosshair shadow-[0_10px_30px_-10px_rgba(14,86,250,0.6)] pointer-events-auto"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        <motion.h2
          style={{ translateZ: 40 }}
          className="text-3xl md:text-5xl font-sans font-medium tracking-tighter text-white uppercase drop-shadow-md whitespace-nowrap"
        >
          {children}
        </motion.h2>
      </motion.div>
    </div>
  );
}
export default function DetailSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStep = STICKY_STEPS[activeIndex];

  return (
    <>
      {/* TargetCursor removed - using FairyDustCursor (star pointer) instead */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;700;800&family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');

        .section-divider-wrapper {
          display: block;
          width: 100%;
          max-width: 860px;
          margin: 80px auto 48px;
          padding: 0 48px;
          background: transparent;
        }

        .section-divider-badge {
          display: inline-block;
          background: #0E56FA;
          color: #FFFFFF;
          font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
          font-weight: 700;
          font-size: clamp(22px, 3vw, 42px);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 10px 32px 14px;
          line-height: 1.1;
          transform: rotate(-2deg);
          box-shadow: 6px 6px 0px #1A2B6D;
        }

        .bareis-wrapper {
          display: flex;
          width: 100%;
          min-height: 90vh;
          background: #EEF4FF;
        }

        .bareis-left {
          width: 40%;
          display: flex;
          flex-direction: column;
          border-right: 1px solid rgba(26, 43, 109, 0.15);
        }

        .bareis-row {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 4vw;
          border-bottom: 1px solid rgba(26, 43, 109, 0.15);
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .bareis-row:last-child {
          border-bottom: none;
        }

        .bareis-row:hover, .bareis-row.active {
          background-color: #0E56FA; /* Brand Blue Hover */
        }

        .bareis-row-title {
          font-family: 'Inter', system-ui, sans-serif;
          font-weight: 500;
          font-size: clamp(14px, 1.5vw, 20px);
          color: #1A2B6D;
          margin: 0;
          line-height: 1.3;
          letter-spacing: -0.01em;
        }

        .bareis-row:hover .bareis-row-title, .bareis-row.active .bareis-row-title {
          color: #FFFFFF;
        }

        .bareis-row-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1.5px solid rgba(26, 43, 109, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: transparent;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .bareis-row:hover .bareis-row-icon, .bareis-row.active .bareis-row-icon {
          border-color: rgba(255,255,255,0.7);
          background-color: rgba(255,255,255,0.12);
        }

        .bareis-row-icon svg {
          width: 20px;
          height: 20px;
          display: block;
          color: #1A2B6D;
          transition: color 0.3s ease;
        }

        .bareis-row:hover .bareis-row-icon svg, .bareis-row.active .bareis-row-icon svg {
          color: #FFFFFF;
        }

        .bareis-right {
          width: 60%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4vw 6vw;
          transition: background-color 0.5s ease;
          position: relative;
          overflow: hidden;
        }

        .bareis-right-logo {
          position: absolute;
          bottom: -20px;
          right: -20px;
          width: clamp(180px, 22vw, 280px);
          height: auto;
          opacity: 0.07;
          pointer-events: none;
          user-select: none;
          animation: logo-drift 12s ease-in-out infinite;
          transform-origin: center;
          filter: brightness(10) invert(1);
        }

        @keyframes logo-drift {
          0%, 100% { transform: rotate(-4deg) scale(1); }
          50%       { transform: rotate(4deg) scale(1.05); }
        }

        .bareis-right:has(.xos-folder-stage) {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          align-items: stretch;
          justify-content: flex-start;
        }

        .right-content-wrapper {
          max-width: 600px;
          width: 100%;
        }

        .right-content-wrapper.xos-right-folder {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: min(72vh, 640px);
          max-width: 100%;
        }

        .right-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 600;
          font-size: clamp(32px, 3.5vw, 48px);
          line-height: 1.1;
          letter-spacing: -0.01em;
          margin-bottom: 40px;
          transition: color 0.5s ease;
        }

        .right-desc {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 18px;
          font-weight: 500;
          line-height: 1.7;
          transition: color 0.5s ease;
        }

        .xos-folder-stage {
          position: relative;
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          min-height: 0;
          padding: 40px 0 32px;
          gap: 0;
        }

        .xos-folder-hint {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          font-size: clamp(18px, 2.2vw, 26px);
          font-weight: 700;
          color: #01001f;
          text-align: center;
          line-height: 1.45;
          padding: 0 8px 32px;
          flex-shrink: 0;
        }

        .xos-folder-hint .xos-do-not-strike {
          text-decoration: line-through;
          text-decoration-thickness: 2px;
          text-decoration-color: #0e56fa;
          opacity: 0.85;
          margin: 0 0.2em;
        }

        .xos-folder-footer {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }

        /* Photo-card style cards inside folder */
        .fpc-chip {
          display: inline-block;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.75);
          margin-bottom: 10px;
        }

        .fpc-title {
          display: block;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(16px, 2vw, 22px);
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 10px;
          color: #FFFFFF;
        }

        .fpc-body {
          display: block;
          font-family: Inter, system-ui, sans-serif;
          font-size: clamp(13px, 1.4vw, 15px);
          font-weight: 400;
          line-height: 1.6;
          color: rgba(255,255,255,0.82);
        }

        .keyword {
          font-weight: 600;
          background-image: linear-gradient(transparent 60%, var(--keyword-color) 60%);
          background-size: 100% 100%;
          background-repeat: no-repeat;
          padding: 0 2px;
          transition: background-image 0.5s ease;
        }

        @media (max-width: 900px) {
          .bareis-wrapper {
            flex-direction: column;
            height: auto;
          }
          .bareis-left, .bareis-right {
            width: 100%;
          }
          .bareis-row {
            padding: 40px 24px;
          }
          .bareis-row-icon {
            width: 40px;
            height: 40px;
          }

          .bareis-row-mark-img {
            width: 22px;
            height: 22px;
          }

          .bareis-row.active .bareis-row-mark-img {
            width: 24px;
            height: 24px;
          }
          .bareis-right {
            padding: 48px 24px;
            min-height: 50vh;
          }
        }
      `}</style>

      <div className="section-divider-wrapper">
        <TiltedHeading>More things about me</TiltedHeading>
      </div>

      <div className="bareis-wrapper">
        {/* LEFT COLUMN - NAV/ACCORDION */}
        <div className="bareis-left">
          {STICKY_STEPS.map((step, idx) => (
            <div
              key={step.step}
              className={`bareis-row cursor-target ${activeIndex === idx ? 'active' : ''}`}
              onClick={() => setActiveIndex(idx)}
            >
              <h2 className="bareis-row-title">{step.label}</h2>
              <div className="bareis-row-icon">
                {activeIndex === idx ? (
                  /* Minus — active */
                  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <rect x="6" y="14" width="20" height="4" rx="2" fill="currentColor" opacity="0.9" />
                  </svg>
                ) : (
                  /* Plus — inactive */
                  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <rect x="14" y="6" width="4" height="20" rx="2" fill="currentColor" opacity="0.9" />
                    <rect x="6" y="14" width="20" height="4" rx="2" fill="currentColor" opacity="0.9" />
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN - CONTENT CONTAINER */}
        <div
          className="bareis-right"
          style={{
            backgroundColor: activeStep.bg,
            /* @ts-ignore: Custom CSS variable passing */
            "--keyword-color": activeStep.accent
          }}
        >
          {/* Project X watermark — only for steps 02 & 03 */}
          {activeIndex !== 0 && (
            <img
              src="/xos/project-x-mark.png"
              alt=""
              aria-hidden="true"
              className="bareis-right-logo"
            />
          )}
          <div
            className={`right-content-wrapper${activeIndex === 0 ? " xos-right-folder" : ""}`}
          >
            {activeIndex === 0 ? (
              <div className="xos-folder-stage">
                <p className="xos-folder-hint">
                  Sensitive content,{" "}
                  <span className="xos-do-not-strike" aria-label="DO NOT (crossed out)">
                    DO NOT
                  </span>{" "}
                  OPEN!
                </p>
                <div className="xos-folder-footer">
                  <Folder
                    size={1.15}
                    color="#0E56FA"
                    items={WHO_I_AM_FOLDER_PAPERS}
                    className="xos-member-folder"
                  />
                </div>
              </div>
            ) : activeIndex === 1 ? (
              <div className="right-desc">
                <Step02Content active={activeIndex === 1} />
              </div>
            ) : (
              <div className="right-desc">
                <Step03Content active={activeIndex === 2} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function TargetCursor({
  spinDuration = 2,
  hideDefaultCursor = true,
  hoverDuration = 0.2
}: {
  spinDuration?: number;
  hideDefaultCursor?: boolean;
  hoverDuration?: number;
}) {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (hideDefaultCursor) {
      const style = document.createElement("style");
      style.innerHTML = `.cursor-target, .cursor-target * { cursor: none !important; }`;
      document.head.appendChild(style);
      return () => { document.head.removeChild(style); };
    }
  }, [hideDefaultCursor]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('.cursor-target');
      if (target) {
        setIsHovering(true);
      }
    };
    const handleMouseOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('.cursor-target');
      if (target) {
        setIsHovering(false);
      }
    };

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  const size = 80;
  const width = isHovering ? size : 0;
  const height = isHovering ? size : 0;
  const borderRadius = "50%";

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        x: cursorX,
        y: cursorY,
        width,
        height,
        borderRadius,
        pointerEvents: "none",
        zIndex: 9999,
        translateX: "-50%",
        translateY: "-50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: isHovering ? 1 : 0,
      }}
      transition={{
        width: { duration: hoverDuration, ease: "easeOut" },
        height: { duration: hoverDuration, ease: "easeOut" },
        opacity: { duration: 0.15 }
      }}
    >
      <motion.div
        style={{
          width: "100%",
          height: "100%",
          border: "1.5px solid rgba(23, 202, 250, 0.5)",
          borderRadius,
        }}
        animate={{
          rotate: isHovering ? 360 : 0
        }}
        transition={{
          rotate: { repeat: Infinity, duration: spinDuration, ease: "linear" }
        }}
      >
        {isHovering && (
          <>
            <div style={{ position: "absolute", top: -4, left: -4, width: 8, height: 8, borderTop: "2px solid #17CAFA", borderLeft: "2px solid #17CAFA" }} />
            <div style={{ position: "absolute", top: -4, right: -4, width: 8, height: 8, borderTop: "2px solid #17CAFA", borderRight: "2px solid #17CAFA" }} />
            <div style={{ position: "absolute", bottom: -4, left: -4, width: 8, height: 8, borderBottom: "2px solid #17CAFA", borderLeft: "2px solid #17CAFA" }} />
            <div style={{ position: "absolute", bottom: -4, right: -4, width: 8, height: 8, borderBottom: "2px solid #17CAFA", borderRight: "2px solid #17CAFA" }} />
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
