"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, animate, AnimatePresence, useTransform } from "framer-motion";

// ─── Marquee ──────────────────────────────────────────────────────────────────

function Marquee() {
  const item = (
    <span style={{
      display: "inline-flex", alignItems: "center",
      whiteSpace: "nowrap", fontSize: 22, fontWeight: 700,
      color: "rgba(15,23,42,0.5)", letterSpacing: "0.02em",
      textTransform: "uppercase",
    }}>
      <span>
        {"Yipee — or "}
        <span style={{ color: "#3b82f6" }}>meo</span>
        {", when I’m overstimulated"}
      </span>
      <span style={{ margin: "0 45px" }}>{`\u2727`}</span>
    </span>
  );

  return (
    <div style={{ overflow: "hidden" }}>
      <div style={{ display: "flex", width: "max-content", animation: "xos-mq 45s linear infinite" }}>
        {Array(10).fill(null).map((_, i) => <span key={i}>{item}</span>)}
      </div>
      <style>{`
        @keyframes xos-mq {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

// ─── Card data (Operations Member added as first card) ────────────────────────

interface CardDatum {
  field: string;
  val: string;
  bg: string;
  accent: string;
}

const CARD_DATA: CardDatum[] = [
  { field: "Role",       val: "Operations Member · xOS",              bg: "#1a2540", accent: "#93c5fd" },
  { field: "University", val: "National Economics University (NEU)",   bg: "#162035", accent: "#60a5fa" },
  { field: "DOB",        val: "30 / 02 / 2005",                        bg: "#1a2540", accent: "#7dd3fc" },
  { field: "Email",      val: "chau@gmail.com",                        bg: "#162035", accent: "#93c5fd" },
];

// Fixed randomized resting rotations (-2 to +2 degrees)
const CARD_ROTS = [-2, 1, -1.5, 2];

// ─── Spring-physics Send-to-Back Stack ───────────────────────────────────────

interface StackCardProps {
  card: CardDatum;
  cardIdx: number;
  posInOrder: number;
  N: number;
  x: any;
  sendToBack: (i: number) => void;
}

function StackCard({ card, cardIdx, posInOrder, N, x, sendToBack }: StackCardProps) {
  const isFront = posInOrder === N - 1;
  const stepsFromFront = N - 1 - posInOrder;

  const scale   = 1 - stepsFromFront * 0.05;
  const opacity = Math.max(0.4, 1 - stepsFromFront * 0.18);
  const yOffset = stepsFromFront * 12;
  const rot     = isFront ? 0 : CARD_ROTS[posInOrder % CARD_ROTS.length];

  // 3D Peel on drag (pulling left flips right edge forward)
  // Distance dictates the degree of tilt
  const rotateY = useTransform(x, [-150, 0, 150], [18, 0, -18]);

  // Parallax ambient shadow (moves opposite to card drag direction to simulate depth light)
  const shadowX = useTransform(x, [-150, 0, 150], [30, 0, -30]);
  const combinedShadow = useTransform(
    shadowX, 
    (sx) => isFront 
      ? `0 16px 48px rgba(0,0,0,0.5), ${sx}px 25px 60px rgba(0,60,255,0.15)` 
      : `0 4px 16px rgba(0,0,0,0.3)`
  );

  return (
    <motion.div
      animate={{ scale, opacity, y: yOffset, rotate: rot }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      style={{
        x,
        rotateY: rotateY,
        border: "1px solid rgba(255,255,255,0.07)", // No dynamic highlights
        boxShadow: combinedShadow,
        position: "absolute",
        top: 0,
        left: 0,
        width: 200,
        height: 200,
        borderRadius: 18,
        background: card.bg,
        padding: "22px 28px",
        zIndex: posInOrder,
        cursor: isFront ? "grab" : "default",
        touchAction: "none",
        willChange: "transform",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 8,
        transformStyle: "preserve-3d",
      }}
      drag={isFront ? "x" : false}
      dragElastic={0.7}
      whileDrag={{ cursor: "grabbing" }}
      onDragEnd={(_, info) => {
        if (Math.abs(info.velocity.x) > 300 || Math.abs(info.offset.x) > 80) {
          sendToBack(cardIdx);
        } else {
          animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
        }
      }}
      onClick={() => { if (isFront) sendToBack(cardIdx); }}
    >
      {/* Tint shadow for inactive layers */}
      {!isFront && (
        <div style={{
          position: "absolute", inset: 0, borderRadius: 18,
          background: "rgba(15,23,42,0.15)", pointerEvents: "none"
        }} />
      )}
      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{
          fontSize: 10, fontWeight: 800, textTransform: "uppercase",
          letterSpacing: "0.14em", color: card.accent, marginBottom: 8,
        }}>{card.field}</div>
        <div style={{
          fontSize: 17, fontWeight: 700, color: "#e2e8f0",
          lineHeight: 1.35,
        }}>{card.val}</div>
      </div>
    </motion.div>
  );
}

function SpringStack() {
  const N = CARD_DATA.length;
  // order[N-1] = front card, order[0] = back card
  const [order, setOrder] = useState(() => Array.from({ length: N }, (_, i) => i));

  // One drag motion-value per card (safe: same # of hooks each render)
  const dx0 = useMotionValue(0);
  const dx1 = useMotionValue(0);
  const dx2 = useMotionValue(0);
  const dx3 = useMotionValue(0);
  const dragXs = [dx0, dx1, dx2, dx3];

  function sendToBack(cardIdx: number) {
    // Smoothly animate the card back to center on X
    animate(dragXs[cardIdx], 0, { type: "spring", stiffness: 260, damping: 20 });
    // Move front card → back of visual stack
    setOrder(prev => {
      const without = prev.filter(i => i !== cardIdx);
      return [cardIdx, ...without]; // cardIdx at index 0 = deepest back
    });
  }

  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "relative", width: 200, height: 240, userSelect: "none", margin: "0 auto", perspective: 1000 }}>
        {CARD_DATA.map((card, cardIdx) => {
          const posInOrder = order.indexOf(cardIdx);
          return (
            <StackCard
              key={card.field}
              card={card}
              cardIdx={cardIdx}
              posInOrder={posInOrder}
              N={N}
              x={dragXs[cardIdx]}
              sendToBack={sendToBack}
            />
          );
        })}
      </div>
    </div>
  );
}

// ─── Rotating Value — character-stagger slide animation ──────────────────────

const CORE_VALUES = ["Fun", "Alivee", "True"];
const FONT_STYLE = {
  fontSize: 32, fontWeight: 900,
  fontFamily: "'Inter Tight', sans-serif",
  letterSpacing: "-0.5px",
} as const;

function RotatingValue() {
  const [idx, setIdx] = useState(0);
  const ghostRef = useRef<HTMLSpanElement>(null);
  const [boxW, setBoxW] = useState(0);

  // Measure ghost width whenever the word changes
  useEffect(() => {
    if (ghostRef.current) setBoxW(ghostRef.current.offsetWidth + 56);
  }, [idx]);
  useEffect(() => {
    if (ghostRef.current) setBoxW(ghostRef.current.offsetWidth + 56);
  }, []);

  // Cycle every 2.5 s — no external hidden flag needed; AnimatePresence handles sequencing
  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % CORE_VALUES.length), 2500);
    return () => clearInterval(id);
  }, []);

  const chars = CORE_VALUES[idx].split("");

  return (
    <div style={{ display: "inline-block", position: "relative" }}>
      {/* Invisible ghost — only used for width measurement */}
      <span
        ref={ghostRef}
        aria-hidden="true"
        style={{
          position: "absolute", visibility: "hidden", pointerEvents: "none",
          whiteSpace: "nowrap", ...FONT_STYLE,
        }}
      >
        {CORE_VALUES[idx]}
      </span>

      {/* Blue rectangle — width transitions smoothly when word changes */}
      <div
        style={{
          background: "#2563eb",
          borderRadius: 12,
          width: boxW || "auto",
          minWidth: 80,
          transition: "width 0.28s cubic-bezier(.4,0,.2,1)",
          padding: "10px 28px",
          overflow: "hidden",         // clips chars entering/exiting vertically
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 58,
        }}
      >
        {/*
         * AnimatePresence mode="wait":
         *   → old word's exit animation completes 100% BEFORE new word enters.
         *   → prevents two words being visible simultaneously.
         */}
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            style={{ display: "flex", alignItems: "center" }}
          >
            {chars.map((char, i) => (
              /*
               * Each char has its own overflow:hidden clip box so the
               * slide-from-below / slide-to-above effect is contained
               * precisely per character ("slot machine" look).
               */
              <span
                key={i}
                style={{ overflow: "hidden", display: "inline-block", lineHeight: 1.1 }}
              >
                <motion.span
                  style={{ display: "inline-block", color: "#fff", ...FONT_STYLE }}
                  // Entry: spring from below, stagger per char
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    transition: {
                      type: "spring",
                      stiffness: 280,
                      damping: 24,
                      delay: i * 0.04,
                    },
                  }}
                  // Exit: fast tween upward, stagger per char
                  exit={{
                    y: "-120%",
                    opacity: 0,
                    transition: {
                      duration: 0.18,
                      delay: i * 0.028,
                      ease: "easeIn",
                    },
                  }}
                >
                  {char === " " ? "\u00a0" : char}
                </motion.span>
              </span>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────


export default function IntroSection() {
  return (
    <>
      <section style={{
        background: "#EBF5FF",
        paddingTop: 72,
        borderBottom: "1px solid rgba(15,23,42,0.06)",
      }}>
        <div style={{ paddingTop: 18, paddingBottom: 18 }}>
          <Marquee />
        </div>
      </section>
      <section style={{ background: "#EBF5FF", padding: "80px 48px 0" }}>
        <div style={{
          maxWidth: 1120, margin: "0 auto",
          display: "flex", gap: 72, alignItems: "flex-start", flexWrap: "wrap",
        }}>

          {/* ── Left: Intro ── */}
          <div style={{ flex: 1.1, minWidth: 300 }}>
            <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
              {/* Name */}
              <div style={{
                fontSize: "clamp(52px,7vw,88px)",
                fontWeight: 900, letterSpacing: -3,
                lineHeight: 1, color: "#0f172a",
                marginBottom: 40,
                fontFamily: "'Inter Tight', sans-serif",
                whiteSpace: "nowrap",
              }}>
                Ngọc&nbsp;<span style={{ color: "#3b82f6" }}>Châu</span>
              </div>

              {/* Core value inline */}
              <div style={{ display: "flex", alignItems: "center", gap: 18, justifyContent: "center" }}>
                <div style={{
                  fontSize: 20, fontWeight: 700, color: "#3b82f6",
                  letterSpacing: "-0.01em", whiteSpace: "nowrap",
                }}>
                  My core value
                </div>
                <RotatingValue />
              </div>
            </div>
          </div>

          {/* ── Right: Spring Stack ── */}
          <div style={{ flex: 0.9, minWidth: 380 }}>
            <SpringStack />
            <div style={{
              textAlign: "center", fontSize: 12,
              color: "rgba(15,23,42,0.35)",
              marginTop: 14, letterSpacing: "0.04em",
            }}>
              drag or click to shuffle ✦
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
