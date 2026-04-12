"use client";

import React from "react";

// Sticky step panels — alternating background colours
const STICKY_STEPS = [
  { step: "Step 1", label: "talk to us", title: "Who do you dream of becoming one day?", desc: "I actually don't dream of becoming anyone else but the best version of myself. I dream of being true, being alive, being imperfect, being whoever I am. As long as I'm the version that's better than my yesterday self, that's cool enough.", bg: "#EBF5FF", accent: "#60a5fa" },
  { step: "Step 2", label: "we build defences", title: "What topic could you give a 30-minute talk about with zero preparation?", desc: "If I have to talk about something for 30 minutes then I guess it would be about dogs. I remember most of the breeds' names, and how they look. Shitzu? You name it. Doberman? You name it. Chow chows, Border Collie, English Dachshund... yipee", bg: "#EBF5FF", accent: "#60a5fa" },
  { step: "Step 3", label: "quarterly reporting", title: "Something you are currently obsessed with?", desc: "Maybe not obsessed but captivated by flowers. Love them. I feel like flowers carry more than just beauty, they also hold many other values about imperfection, instability, humility and quietness", bg: "#EBF5FF", accent: "#60a5fa" },
  { step: "Step 4", label: "your taxes sorted", title: "What are you probably doing when nobody is watching?", desc: "Talking to my dog about my existential crisis or any other minor issue in life.", bg: "#EBF5FF", accent: "#60a5fa" },
  { step: "Step 5", label: "talk to us", title: "What can people ask you for help with?", desc: "If possible, I can give you some tips on how to: Work with children, Build easy dashboard using PowerBI + AI, Deliver a speech using your humour, body and voice ", bg: "#EBF5FF", accent: "#60a5fa" },
  { step: "Step 6", label: "we build defences", title: "What are you currently building or exploring?", desc: "I'm exploring career paths, which I can definitely learn from by hearing stories from different people and also experiencing them myself. Hope you guys can give me some of your own stories about your career life<3", bg: "#EBF5FF", accent: "#60a5fa" },
];

export default function DetailSection() {
  return (
    <>
      <style>{`
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
          .sticky-step-inner { grid-template-columns: 1fr; padding: 0 32px; gap: 32px; }
          .sticky-step-right { display: none; }
        }
      `}</style>
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
                  <h2 className={`sticky-step-title\${isDark ? " light" : ""}`}>
                    {s.title}
                  </h2>
                  <p className={`sticky-step-desc\${isDark ? " light" : ""}`}>
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
    </>
  );
}
