"use client";

import { useEffect, useRef, useCallback } from "react";

// ─── Types & Data ─────────────────────────────────────────────────────────────

interface BentoItem {
  id:   string;
  icon: string;
  title: string;
  body:  string;
  tag?:  string;
  gridColumn?: string;
  gridRow?:    string;
}

const ITEMS: BentoItem[] = [
  {
    id: "bc0",
    icon:  "💬",
    title: "Organizations / Side quests / Competitions",
    body:  "Volunteer — Vietnam Youth Music Institution\n\nVolunteer — Hanoi Grapevine",
    tag:   "Volunteering",
    gridRow: "span 2",
  },
  {
    id: "bc1",
    icon:  "😌",
    title: "Courses",
    body:  "Microsoft Power BI Data Analyst — Datapot",
    tag:   "Data & Analytics",
  },
  {
    id: "bc2",
    icon:  "📋",
    title: "A tool most people haven't heard of",
    body:  "If it's something people haven't heard of then I don't think I have any.",
  },
  {
    id: "bc3",
    icon:  "🤝",
    title: "Work experience",
    body:  "ABCDEF",
    tag:   "Professional",
    gridColumn: "2",
    gridRow: "2 / 4",
  },
];

// ─── Animation constants ───────────────────────────────────────────────────────

const GLOW_RGB        = "0,100,255";    // rich electric blue
const SPOTLIGHT_R     = 360;            // wide radius spotlight
const TILT_MAX        = 12;
const MAGNET_MAX      = 10;
const EDGE_REACH      = 300;
const RING_PX         = 8;              // thicker border glow
const NUM_STARS       = 15;             // less stars for a cleaner look

// ─── Individual Bento Card ────────────────────────────────────────────────────

interface BentoCardProps {
  item: BentoItem;
  gridMouseRef: React.MutableRefObject<{ x: number; y: number; active: boolean }>;
}

function BentoCard({ item, gridMouseRef }: BentoCardProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardRef    = useRef<HTMLDivElement>(null);
  const borderRef  = useRef<HTMLDivElement>(null);    // cursor-chase border ring (OUTSIDE card)
  const spotRef    = useRef<HTMLDivElement>(null);    // surface spotlight (INSIDE card)
  const canvasRef  = useRef<HTMLCanvasElement>(null); // star particles (INSIDE card)

  const starsRef   = useRef<{ x:number;y:number;r:number;a:number;da:number;dx:number;dy:number;vx:number;vy:number }[]>([]);
  const localMouse = useRef({ x: -9999, y: -9999 });
  const rafBody    = useRef(0);
  const rafGrid    = useRef(0);

  // ── Star particle canvas ──────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    function resize() {
      const card = cardRef.current;
      if (!card || !canvas) return;
      canvas.width  = card.offsetWidth;
      canvas.height = card.offsetHeight;
    }

    starsRef.current = Array.from({ length: NUM_STARS }, () => ({
      x:  Math.random() * 400, y: Math.random() * 300,
      r:  Math.random() * 2 + 0.5,
      a:  Math.random(),
      da: (Math.random() - 0.5) * 0.012,
      dx: (Math.random() - 0.5) * 0.2,
      dy: (Math.random() - 0.5) * 0.2,
      vx: 0, vy: 0,
    }));

    resize();
    const ro = new ResizeObserver(resize);
    if (cardRef.current) ro.observe(cardRef.current);

    function tick() {
      if (!canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const lm = localMouse.current;

      starsRef.current.forEach(s => {
        // Mouse attraction (magnetism for stars)
        if (lm.x > -999) {
          const ddx = lm.x - s.x, ddy = lm.y - s.y;
          const dist = Math.sqrt(ddx * ddx + ddy * ddy) || 1;
          if (dist < 140) { s.vx += (ddx / dist) * 0.8; s.vy += (ddy / dist) * 0.8; }
        }
        s.vx *= 0.86; s.vy *= 0.86;
        s.x += s.dx + s.vx * 0.08;
        s.y += s.dy + s.vy * 0.08;
        s.a += s.da;
        if (s.a > 1 || s.a < 0) s.da *= -1;
        if (s.x < 0) s.x = canvas.width;
        if (s.x > canvas.width) s.x = 0;
        if (s.y < 0) s.y = canvas.height;
        if (s.y > canvas.height) s.y = 0;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${GLOW_RGB},${Math.max(0, Math.min(1, s.a * 0.8))})`;
        ctx.fill();
      });
      rafBody.current = requestAnimationFrame(tick);
    }
    tick();

    return () => { cancelAnimationFrame(rafBody.current); ro.disconnect(); };
  }, []);

  // ── Grid-level mouse → spotlight + border ring + edge shadow ─────────────
  useEffect(() => {
    function gridTick() {
      const gm  = gridMouseRef.current;
      const card = cardRef.current;
      const spot = spotRef.current;
      const borderEl = borderRef.current;

      if (!card || !spot || !borderEl) {
        rafGrid.current = requestAnimationFrame(gridTick);
        return;
      }

      if (!gm.active) {
        spot.style.opacity    = "0";
        borderEl.style.opacity = "0";
        rafGrid.current = requestAnimationFrame(gridTick);
        return;
      }

      // Card-relative cursor coordinates
      const rect = card.getBoundingClientRect();
      const cx = gm.x - rect.left;
      const cy = gm.y - rect.top;
      const w  = rect.width, h = rect.height;

      // Set CSS vars for radial gradients
      spot.style.setProperty("--sx", `${cx}px`);
      spot.style.setProperty("--sy", `${cy}px`);
      borderEl.style.setProperty("--sx", `${cx + RING_PX}px`);
      borderEl.style.setProperty("--sy", `${cy + RING_PX}px`);

      // Global proximity (distance from cursor to nearest point on card)
      const nearX = Math.max(0, Math.min(w, cx));
      const nearY = Math.max(0, Math.min(h, cy));
      const dist  = Math.sqrt((cx - nearX) ** 2 + (cy - nearY) ** 2);
      const globalI = Math.max(0, 1 - dist / SPOTLIGHT_R);

      spot.style.opacity     = (globalI * 0.85).toFixed(3);
      borderEl.style.opacity = Math.min(0.9, globalI * 1.2).toFixed(3);

      rafGrid.current = requestAnimationFrame(gridTick);
    }
    rafGrid.current = requestAnimationFrame(gridTick);
    return () => cancelAnimationFrame(rafGrid.current);
  }, [gridMouseRef]);

  // ── Click ripple ──────────────────────────────────────────────────────────
  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const r = card.getBoundingClientRect();
    const rip = document.createElement("div");
    rip.style.cssText = `
      position:absolute;border-radius:50%;
      background:rgba(${GLOW_RGB},0.5);
      width:80px;height:80px;transform:scale(0);pointer-events:none;
      left:${e.clientX - r.left - 40}px;top:${e.clientY - r.top - 40}px;
      animation:xos-rip 0.55s ease-out forwards;z-index:10;
    `;
    card.appendChild(rip);
    setTimeout(() => rip.remove(), 600);
  }, []);

  // ── 3-D tilt + magnetism ──────────────────────────────────────────────────
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const r  = card.getBoundingClientRect();
    const cx = e.clientX - r.left, cy = e.clientY - r.top;
    localMouse.current = { x: cx, y: cy };
  }, []);

  const handleMouseLeave = useCallback(() => {
    localMouse.current = { x: -9999, y: -9999 };
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{ position: "relative", gridColumn: item.gridColumn, gridRow: item.gridRow }}
    >
      {/* Dynamic cursor border ring (OUTSIDE overflow hidden) */}
      <div
        ref={borderRef}
        style={{
          position: "absolute",
          inset: -RING_PX,
          borderRadius: 22 + RING_PX,
          pointerEvents: "none",
          zIndex: 6,
          opacity: 0,
          background: `radial-gradient(circle 240px at var(--sx,50%) var(--sy,50%), rgba(${GLOW_RGB},1), rgba(${GLOW_RGB},0.08) 35%, transparent 60%)`,
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: RING_PX,
          transition: "opacity 0.2s ease-out",
        } as React.CSSProperties}
      />

      {/* Actual card */}
      <div
        ref={cardRef}
        className="xos-card"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{
          background: "#060A14", // Matte black / charcoal
          borderRadius: 22,
          padding: 32,
          position: "relative",
          overflow: "hidden",
          cursor: "pointer",
          transformStyle: "preserve-3d",
          willChange: "transform",
          height: "100%",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Surface spotlight */}
        <div
          ref={spotRef}
          style={{
            position: "absolute", inset: 0, borderRadius: 22,
            pointerEvents: "none", zIndex: 1, opacity: 0,
            background: `radial-gradient(circle ${SPOTLIGHT_R}px at var(--sx,50%) var(--sy,50%), rgba(${GLOW_RGB},0.12), transparent 70%)`,
            transition: "opacity 0.2s ease-out",
          } as React.CSSProperties}
        />

        {/* Star canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute", inset: 0, borderRadius: 22,
            pointerEvents: "none", zIndex: 2,
            opacity: 0.85,
          }}
        />

        {/* Content */}
        <div className="xos-bc-content" style={{ position: "relative", zIndex: 4 }}>
          <span style={{ fontSize: 24, display: "block", marginBottom: 16 }}>{item.icon}</span>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 10, lineHeight: 1.4 }}>
            {item.title}
          </div>
          <div className="xos-bc-body" style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, whiteSpace: "pre-line" }}>
            {item.body}
          </div>
          {item.tag && (
            <div className="xos-bc-tag" style={{
              display: "inline-block", marginTop: 14,
              background: `rgba(${GLOW_RGB},0.15)`, color: "#93c5fd",
              fontSize: 11, fontWeight: 600, padding: "4px 13px", borderRadius: 20,
              border: `1px solid rgba(${GLOW_RGB},0.3)`,
            }}>
              {item.tag}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Section ──────────────────────────────────────────────────────────────

export default function ExperienceBentoSection() {
  const gridMouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -9999, y: -9999, active: false });

  const handleGridMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    gridMouseRef.current = { x: e.clientX, y: e.clientY, active: true };
  }, []);

  const handleGridMouseLeave = useCallback(() => {
    gridMouseRef.current = { x: -9999, y: -9999, active: false };
  }, []);

  return (
    <section style={{ background: "#0d1117", padding: "40px 48px 80px" }}>
      <style>{`
        .xos-card .xos-bc-body {
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .xos-card:hover .xos-bc-body {
          opacity: 1;
          transform: translateY(0);
        }
        .xos-card .xos-bc-tag {
          opacity: 0;
          transform: translateY(4px);
          transition: opacity 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) 0.08s, transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) 0.08s;
        }
        .xos-card:hover .xos-bc-tag {
          opacity: 1;
          transform: translateY(0);
        }
        @keyframes xos-rip { 
          from { transform: scale(0); opacity: 1; }
          to   { transform: scale(5); opacity: 0; } 
        }
      `}</style>

      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        {/* Bridge label */}
        <div style={{
          display: "flex", alignItems: "center", gap: 14, marginBottom: 36,
        }}>
          <div style={{
            width: 28, height: 1,
            background: "rgba(255,255,255,0.15)",
          }} />
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "3px",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.28)",
          }}>
            My Experience
          </div>
          <div style={{
            flex: 1, height: 1,
            background: "rgba(255,255,255,0.06)",
          }} />
        </div>

        {/* Bento grid */}
        <div
          onMouseMove={handleGridMouseMove}
          onMouseLeave={handleGridMouseLeave}
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr",
            gap: 20,
          }}
        >
          {ITEMS.map(item => (
            <BentoCard key={item.id} item={item} gridMouseRef={gridMouseRef} />
          ))}
        </div>
      </div>
    </section>
  );
}
