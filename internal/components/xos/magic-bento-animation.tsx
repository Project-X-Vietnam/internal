"use client";

import { useRef, useEffect, useState, useCallback, MouseEvent } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface BentoCardData {
  title: string;
  description: string;
  label: string;
  color?: string;
  /** Optional: icon or emoji rendered above label */
  icon?: React.ReactNode;
  /** Optional: span columns (1-4). Default: 1 */
  colSpan?: 1 | 2 | 3 | 4;
  /** Optional: span rows (1-2). Default: 1 */
  rowSpan?: 1 | 2;
}

interface BentoCardGridProps {
  cards: BentoCardData[];
  glowColor?: string;          // RGB triple, e.g. "37, 99, 235"
  particleCount?: number;
  spotlightRadius?: number;
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableBorderGlow?: boolean;
  enableTilt?: boolean;
  enableMagnetism?: boolean;
  clickEffect?: boolean;
}

// ─── Individual Card ─────────────────────────────────────────────────────────

function BentoCard({
  card,
  glowColor,
  particleCount,
  textAutoHide,
  enableStars,
  enableBorderGlow,
  enableTilt,
  enableMagnetism,
  clickEffect,
}: {
  card: BentoCardData;
  glowColor: string;
  particleCount: number;
  textAutoHide: boolean;
  enableStars: boolean;
  enableBorderGlow: boolean;
  enableTilt: boolean;
  enableMagnetism: boolean;
  clickEffect: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  // Generate stars once
  const stars = useRef(
    Array.from({ length: 14 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      opacity: Math.random() * 0.7 + 0.2,
      delay: `${Math.random() * 3}s`,
      dur: `${Math.random() * 2 + 2}s`,
    }))
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      const content = contentRef.current;
      const border = borderRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (enableBorderGlow && border) {
        border.style.maskImage = `radial-gradient(300px circle at ${x}px ${y}px, black 0%, transparent 100%)`;
        (border.style as any).webkitMaskImage = `radial-gradient(300px circle at ${x}px ${y}px, black 0%, transparent 100%)`;
      }

      if (enableTilt) {
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotX = (y - cy) / 12;
        const rotY = (cx - x) / 12;
        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      }

      if (enableMagnetism && content) {
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        content.style.transform = `translate(${(x - cx) / 10}px, ${(y - cy) / 10}px)`;
      }
    },
    [enableBorderGlow, enableTilt, enableMagnetism]
  );

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    const content = contentRef.current;
    const border = borderRef.current;
    if (card) card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
    if (content) content.style.transform = "translate(0, 0)";
    if (border) {
      border.style.maskImage = "none";
      (border.style as any).webkitMaskImage = "none";
    }
  }, []);

  const handleClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!clickEffect || !particlesRef.current || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      for (let i = 0; i < particleCount; i++) {
        const p = document.createElement("div");
        p.style.cssText = `
          position:absolute;left:${x}px;top:${y}px;width:5px;height:5px;
          border-radius:50%;background:rgba(${glowColor},0.85);
          pointer-events:none;z-index:30;
          transition:transform 0.6s ease-out,opacity 0.6s ease-out;
        `;
        particlesRef.current.appendChild(p);
        const angle = (Math.PI * 2 * i) / particleCount;
        const vel = 40 + Math.random() * 50;
        requestAnimationFrame(() => {
          p.style.transform = `translate(${Math.cos(angle) * vel}px, ${Math.sin(angle) * vel}px) scale(0)`;
          p.style.opacity = "0";
        });
        setTimeout(() => p.remove(), 700);
      }
    },
    [clickEffect, particleCount, glowColor]
  );

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        position: "relative",
        background: card.color ?? "#0f172a",
        borderRadius: "1rem",
        padding: "1.5rem",
        minHeight: "12rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.08)",
        cursor: "pointer",
        transition: "transform 0.12s ease-out, box-shadow 0.3s ease",
        gridColumn: card.colSpan ? `span ${card.colSpan}` : undefined,
        gridRow: card.rowSpan ? `span ${card.rowSpan}` : undefined,
      }}
      onMouseEnter={(e) => {
        if (cardRef.current)
          cardRef.current.style.boxShadow = `0 0 30px rgba(${glowColor},0.15)`;
      }}
    >
      {/* Border glow layer */}
      {enableBorderGlow && (
        <div
          ref={borderRef}
          style={{
            position: "absolute",
            inset: "-1px",
            borderRadius: "1rem",
            background: `radial-gradient(circle at center, rgba(${glowColor},0.9) 0%, transparent 70%)`,
            padding: "1px",
            pointerEvents: "none",
            zIndex: 10,
            opacity: 1,
          }}
        />
      )}

      {/* Stars */}
      {enableStars && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.35 }}>
          {stars.current.map((s) => (
            <span
              key={s.id}
              style={{
                position: "absolute",
                left: s.left,
                top: s.top,
                width: s.size,
                height: s.size,
                borderRadius: "50%",
                background: `rgba(${glowColor}, ${s.opacity})`,
                animation: `mbStarFloat ${s.dur} ${s.delay} ease-in-out infinite alternate`,
              }}
            />
          ))}
        </div>
      )}

      {/* Particle burst container */}
      <div ref={particlesRef} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />

      {/* Content */}
      <div
        ref={contentRef}
        style={{ position: "relative", zIndex: 5, transition: "transform 0.2s ease-out" }}
      >
        {card.icon && (
          <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{card.icon}</div>
        )}
        <div
          style={{
            fontSize: "0.7rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: `rgba(${glowColor}, 0.9)`,
            marginBottom: "0.5rem",
            fontWeight: 700,
          }}
        >
          {card.label}
        </div>
        <h3
          style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "white",
            marginBottom: "0.4rem",
            fontFamily: "'Inter Tight', sans-serif",
            lineHeight: 1.2,
          }}
        >
          {card.title}
        </h3>
        <p
          style={{
            fontSize: "0.88rem",
            color: "#94a3b8",
            lineHeight: 1.6,
            opacity: textAutoHide ? 0 : 1,
            transition: "opacity 0.3s ease",
          }}
          className="mb-card-desc"
        >
          {card.description}
        </p>
      </div>

      <style>{`
        @keyframes mbStarFloat {
          from { transform: translate(-4px,-4px) scale(0.8); }
          to   { transform: translate(4px, 4px)  scale(1.3); }
        }
        div:hover .mb-card-desc { opacity: 1 !important; }
      `}</style>
    </div>
  );
}

// ─── Grid ─────────────────────────────────────────────────────────────────────

export default function MagicBentoAnimation({
  cards,
  glowColor = "37, 99, 235",
  particleCount = 12,
  spotlightRadius = 320,
  textAutoHide = true,
  enableStars = true,
  enableBorderGlow = true,
  enableTilt = true,
  enableMagnetism = true,
  clickEffect = true,
}: BentoCardGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const move = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (isMobile || !spotlightRef.current) return;
      const s = spotlightRef.current;
      s.style.left = `${e.clientX - spotlightRadius}px`;
      s.style.top = `${e.clientY - spotlightRadius}px`;
      s.style.opacity = "1";
    },
    [isMobile, spotlightRadius]
  );

  const leave = useCallback(() => {
    if (spotlightRef.current) spotlightRef.current.style.opacity = "0";
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={move}
      onMouseLeave={leave}
      style={{ position: "relative", userSelect: "none" }}
    >
      {/* Global spotlight */}
      {!isMobile && (
        <div
          ref={spotlightRef}
          style={{
            position: "fixed",
            width: spotlightRadius * 2,
            height: spotlightRadius * 2,
            borderRadius: "50%",
            pointerEvents: "none",
            zIndex: 200,
            opacity: 0,
            transition: "opacity 0.3s",
            background: `radial-gradient(circle, rgba(${glowColor},0.12) 0%, transparent 70%)`,
            mixBlendMode: "screen",
          }}
        />
      )}

      {/* Card grid */}
      <div
        style={{
          display: "grid",
          gap: "0.6rem",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridAutoRows: "12rem",
        }}
      >
        {cards.map((card, i) => (
          <BentoCard
            key={i}
            card={card}
            glowColor={glowColor}
            particleCount={particleCount}
            textAutoHide={textAutoHide}
            enableStars={enableStars}
            enableBorderGlow={enableBorderGlow}
            enableTilt={enableTilt}
            enableMagnetism={enableMagnetism}
            clickEffect={clickEffect}
          />
        ))}
      </div>
    </div>
  );
}
