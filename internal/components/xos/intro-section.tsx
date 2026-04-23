"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, animate, AnimatePresence, useTransform } from "framer-motion";

// ─── Icon SVG ────────────────────────────────────────────────────────────────

const IconSVG = () => (
  <svg width="24" height="24" viewBox="0 0 250 250" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M125 47.0824L146.823 68.9055C148.145 70.2271 150.202 70.4679 151.794 69.4834L226.996 23.0041L205.173 1.18102C203.851 -0.140613 201.794 -0.381396 200.202 0.603142L125 47.0824Z" fill="#17CAFA"/>
    <path d="M202.917 125L181.094 103.177C179.773 101.856 179.532 99.7982 180.516 98.2063L226.996 23.0042L248.819 44.8272C250.14 46.1489 250.381 48.2062 249.397 49.7981L202.917 125Z" fill="#17CAFA"/>
    <path d="M202.917 125L181.094 146.823C179.773 148.145 179.532 150.202 180.516 151.794L226.996 226.996L248.819 205.173C250.14 203.852 250.381 201.794 249.397 200.202L202.917 125Z" fill="#0E56FA"/>
    <path d="M125 202.918L146.823 181.095C148.145 179.773 150.202 179.532 151.794 180.517L226.996 226.996L205.173 248.819C203.851 250.141 201.794 250.382 200.202 249.397L125 202.918Z" fill="#0E56FA"/>
    <path d="M125.001 202.915L103.178 181.092C101.856 179.77 99.7987 179.529 98.2069 180.514L23.0047 226.993L44.8278 248.816C46.1494 250.138 48.2068 250.379 49.7986 249.394L125.001 202.915Z" fill="#0E56FA"/>
    <path d="M47.0826 124.997L68.9056 146.82C70.2272 148.142 70.468 150.199 69.4835 151.791L23.0042 226.993L1.18116 205.17C-0.140475 203.849 -0.381259 201.791 0.603279 200.199L47.0826 124.997Z" fill="#0E56FA"/>
    <path d="M47.0826 124.997L68.9056 103.174C70.2272 101.853 70.468 99.7953 69.4835 98.2035L23.0042 23.0013L1.18116 44.8244C-0.140475 46.146 -0.381259 48.2034 0.603279 49.7952L47.0826 124.997Z" fill="#0E56FA"/>
    <path d="M125.001 47.0798L103.178 68.9028C101.856 70.2244 99.7987 70.4652 98.2069 69.4807L23.0047 23.0014L44.8278 1.18102C46.1494 -0.140613 48.2068 -0.381396 49.7986 0.603142L125.001 47.0824V47.0798Z" fill="#0E56FA"/>
  </svg>
);

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
        {", when I'm overstimulated"}
      </span>
      <span style={{ margin: "0 45px", display: "inline-flex", alignItems: "center" }}><IconSVG /></span>
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

// Clean pastel blue
const CARD_GRADIENT = "#dbeafe";

const CARD_DATA: CardDatum[] = [
  { field: "Role",       val: "Operations Member · xOS",              bg: CARD_GRADIENT, accent: "rgba(15,23,42,0.65)" },
  { field: "University", val: "National Economics University (NEU)",   bg: CARD_GRADIENT, accent: "rgba(15,23,42,0.65)" },
  { field: "DOB",        val: "30 / 02 / 2005",                        bg: CARD_GRADIENT, accent: "rgba(15,23,42,0.65)" },
  { field: "Email",      val: "chau@gmail.com",                        bg: CARD_GRADIENT, accent: "rgba(15,23,42,0.65)" },
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
      ? `0 20px 40px -10px rgba(15,23,42,0.15)` 
      : `0 4px 16px rgba(15,23,42,0.08)`
  );

  return (
    <motion.div
      animate={{ scale, opacity, y: yOffset, rotate: rot }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      style={{
        x,
        rotateY: rotateY,
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
          fontSize: 17, fontWeight: 700, color: "#0f172a",
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
  fontSize: "clamp(32px, 4vw, 40px)", color: "#52525b",
} as const;

function RotatingValue() {
  const [idx, setIdx] = useState(0);
  const ghostRef = useRef<HTMLSpanElement>(null);
  const [boxW, setBoxW] = useState(0);

  // Measure ghost width whenever the word changes
  useEffect(() => {
    if (ghostRef.current) setBoxW(ghostRef.current.offsetWidth + 4);
  }, [idx]);
  useEffect(() => {
    if (ghostRef.current) setBoxW(ghostRef.current.offsetWidth + 4);
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

      {/* Transparent container — width transitions smoothly when word changes */}
      <div
        style={{
          width: boxW || "auto",
          minWidth: 80,
          transition: "width 0.28s cubic-bezier(.4,0,.2,1)",
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
                  className="font-bold tracking-tight"
                  style={{ display: "inline-block", ...FONT_STYLE }}
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
    <div className="font-sans">
      <section style={{
        background: "transparent",
        paddingTop: 72,
        borderBottom: "1px solid rgba(15,23,42,0.06)",
      }}>
        <div style={{ paddingTop: 18, paddingBottom: 18 }}>
          <Marquee />
        </div>
      </section>
      <section style={{ background: "transparent", padding: "80px 48px 0" }}>
        <div style={{
          maxWidth: 1120, margin: "0 auto",
          display: "flex", gap: 72, alignItems: "flex-start", flexWrap: "wrap",
        }}>

          {/* ── Left: Intro ── */}
          <div style={{ flex: 1.1, minWidth: 300 }}>
            <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
              <div 
                className="font-medium tracking-tighter"
                style={{
                  fontSize: "clamp(52px,7vw,88px)",
                  lineHeight: 1.1,
                  paddingBottom: "0.15em",
                  paddingTop: "0.05em",
                  marginBottom: 20,
                  whiteSpace: "nowrap",
                  background: "linear-gradient(to right, #0E56FA, #0E56FA, #17CAFA)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                Ngọc Châu
              </div>

              {/* Core value inline */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center" }}>
                <div style={{
                  fontSize: "clamp(20px, 3vw, 24px)", fontWeight: 400, color: "#52525b",
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
              drag or click to shuffle
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
