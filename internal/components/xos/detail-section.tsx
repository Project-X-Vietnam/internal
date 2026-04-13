"use client";

import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Folder from "./Folder";

/** Three “papers” inside the Folder for step 01 */
const WHO_I_AM_FOLDER_PAPERS: React.ReactNode[] = [
  <React.Fragment key="watching">
    <span className="folder-paper-label">When nobody&apos;s watching:</span>
    <span className="folder-paper-body">
      Talking to my dog about my existential crisis or any other minor issue in life.
    </span>
  </React.Fragment>,
  <React.Fragment key="obsessed">
    <span className="folder-paper-label">Currently obsessed with:</span>
    <span className="folder-paper-body">
      Maybe not obsessed but captivated by flowers. Love them. I feel like flowers carry more than just beauty, they also hold many other values about imperfection, instability, humility and quietness.
    </span>
  </React.Fragment>,
  <React.Fragment key="talk">
    <span className="folder-paper-label">30-min talk with zero prep:</span>
    <span className="folder-paper-body">
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
    accent: "#17CAFA", /* Cyan highlight for keywords on white */
    textColor: "#01001F",
  },
  {
    step: "02",
    label: "For now, I’m building…",
    title: "Exploring momentum and direction",
    desc: (
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div>I'm exploring <span className="keyword">career paths</span>, which I can definitely learn from by hearing stories from different people and also experiencing them myself.</div>
        <div>Hope you guys can give me some of your own stories about your <span className="keyword">career life {"<3"}</span></div>
      </div>
    ),
    bg: "#0E56FA",
    accent: "#17CAFA", /* Cyan highlight for keywords on Blue */
    textColor: "#FFFFFF",
  },
  {
    step: "03",
    label: "I dream of becoming…",
    title: "Just the true version of myself",
    desc: (
      <div style={{ display: "flex", flexDirection: "column", gap: "24px", fontSize: "20px", lineHeight: 1.8 }}>
        <p>
          I actually don't dream of becoming anyone else but <span className="keyword">the best version of myself</span>. I dream of being true, being alive, being imperfect, being whoever I am.
        </p>
        <p>
          As long as I'm the version that's better than my <span className="keyword">yesterday self</span>, that's cool enough.
        </p>
      </div>
    ),
    bg: "#01001F",
    accent: "#0E56FA", /* Blue highlight for keywords on Black */
    textColor: "#FFFFFF",
  },
];

export default function DetailSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStep = STICKY_STEPS[activeIndex];

  return (
    <>
      <TargetCursor
        spinDuration={2}
        hideDefaultCursor
        hoverDuration={0.2}
      />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');

        .section-divider-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 100px 4vw;
          background: #FFFFFF;
        }

        .section-divider-text {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 800;
          font-size: clamp(32px, 4vw, 56px);
          margin: 0 40px;
          white-space: nowrap;
          letter-spacing: -0.02em;
        }

        .section-divider-line {
          flex: 1;
          height: 1px;
          background-color: rgba(1, 0, 31, 0.15);
          max-width: 400px;
        }

        .bareis-wrapper {
          display: flex;
          width: 100%;
          min-height: 100vh;
          background: #01001F;
        }

        .bareis-left {
          width: 40%;
          display: flex;
          flex-direction: column;
          border-right: 1px solid rgba(255,255,255,0.15);
        }

        .bareis-row {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 4vw;
          border-bottom: 1px solid rgba(255,255,255,0.15);
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
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 600;
          font-size: clamp(20px, 2.5vw, 32px);
          color: #FFFFFF;
          margin: 0;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .bareis-row-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(26, 29, 33, 0.55);
          transition: all 0.3s ease;
        }

        .bareis-row:hover .bareis-row-icon, .bareis-row.active .bareis-row-icon {
          border-color: #FFFFFF;
          background-color: #1A1D21;
        }

        .bareis-row-mark-img {
          width: 26px;
          height: 26px;
          object-fit: contain;
          display: block;
        }

        .bareis-row.active .bareis-row-mark-img {
          width: 28px;
          height: 28px;
        }

        .bareis-right {
          width: 60%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4vw 6vw;
          transition: background-color 0.5s ease;
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
          align-items: stretch;
          flex: 1;
          min-height: 0;
          padding: 0 0 8px;
        }

        .xos-folder-hint {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          font-size: clamp(15px, 2vw, 18px);
          font-weight: 700;
          color: #01001f;
          text-align: center;
          line-height: 1.45;
          padding: 0 8px 16px;
          flex-shrink: 0;
        }

        .xos-folder-hint .xos-do-not-strike {
          text-decoration: line-through;
          text-decoration-thickness: 2px;
          text-decoration-color: #0e56fa;
          opacity: 0.85;
          margin: 0 0.2em;
        }

        .xos-folder-spacer {
          flex: 1;
          min-height: 16px;
        }

        .xos-folder-footer {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          padding-top: 8px;
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
        <div className="section-divider-line" />
        <h2 className="section-divider-text">
          <span style={{ color: "#01001F" }}>More things</span> <span style={{ color: "#0E56FA" }}>about me...</span>
        </h2>
        <div className="section-divider-line" />
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
                <img
                  className="bareis-row-mark-img"
                  src="/xos/project-x-mark.png"
                  alt=""
                  width={28}
                  height={28}
                />
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
          <div
            className={`right-content-wrapper${activeIndex === 0 ? " xos-right-folder" : ""}`}
          >
            {activeIndex !== 0 && activeStep.title ? (
              <h3 className="right-title" style={{ color: activeStep.textColor }}>
                {activeStep.title}
              </h3>
            ) : null}
            {activeIndex === 0 ? (
              <div className="xos-folder-stage">
                <p className="xos-folder-hint">
                  Sensitive content,{" "}
                  <span className="xos-do-not-strike" aria-label="DO NOT (crossed out)">
                    DO NOT
                  </span>{" "}
                  OPEN!
                </p>
                <div className="xos-folder-spacer" aria-hidden="true" />
                <div className="xos-folder-footer">
                  <Folder
                    size={1.15}
                    color="#0E56FA"
                    items={WHO_I_AM_FOLDER_PAPERS}
                    className="xos-member-folder"
                  />
                </div>
              </div>
            ) : (
              <div className="right-desc" style={{ color: activeStep.textColor }}>
                {activeStep.desc}
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
