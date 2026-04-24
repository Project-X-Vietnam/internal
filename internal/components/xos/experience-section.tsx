"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

// ─── Types & Data ─────────────────────────────────────────────────────────────

interface BentoItem {
  id:   string;
  title: string;
  body:  string;
  shortBody?: string;
  tag?:  string;
  gridColumn?: string;
  gridRow?:    string;
}

const ITEMS: BentoItem[] = [
  {
    id: "bc0",
    title: "Organizations /\nSide quests",
    shortBody: "Involved in music and arts communities.",
    body:  "Volunteer — Vietnam Youth Music Institution\n\nVolunteer — Hanoi Grapevine",
    tag:   "Volunteering",
    gridColumn: "span 4",
    gridRow: "span 2",
  },
  {
    id: "bc3",
    title: "Work experience",
    shortBody: "A sneak peek into my professional journey.",
    body:  "ABCDEF",
    tag:   "Professional",
    gridColumn: "span 8",
    gridRow: "span 2",
  },
  {
    id: "bc2",
    title: "Hidden tool",
    shortBody: "Tools you've never heard of.",
    body:  "If it's something people haven't heard of then I don't think I have any — yet!",
    tag:   "Unknown",
    gridColumn: "span 9",
    gridRow: "span 1",
  },
  {
    id: "bc1",
    title: "Courses",
    shortBody: "Building technical foundations.",
    body:  "Microsoft Power BI Data Analyst — Datapot",
    tag:   "Analytics",
    gridColumn: "span 3",
    gridRow: "span 1",
  },
];

// ─── Animation constants ───────────────────────────────────────────────────────

const GLOW_RGB        = "59,130,246";     // vibrant blue for light mode
const SPOTLIGHT_R     = 450;              // wider radius spotlight for softer falloff
const TILT_MAX        = 12;
const MAGNET_MAX      = 10;
const EDGE_REACH      = 300;
const RING_PX         = 9;                // 6px border glow
const NUM_STARS       = 15;               // less stars for a cleaner look

// ─── Individual Bento Card ────────────────────────────────────────────────────

interface BentoCardProps {
  item: BentoItem;
  gridMouseRef: React.MutableRefObject<{ x: number; y: number; active: boolean }>;
  onClick: () => void;
}

function BentoCard({ item, gridMouseRef, onClick }: BentoCardProps) {
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
      borderEl.style.opacity = Math.min(1.0, globalI * 1.5).toFixed(3);

      rafGrid.current = requestAnimationFrame(gridTick);
    }
    rafGrid.current = requestAnimationFrame(gridTick);
    return () => cancelAnimationFrame(rafGrid.current);
  }, [gridMouseRef]);

  // ── Click ripple ──────────────────────────────────────────────────────────
  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    onClick();
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
  }, [onClick]);

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
      className="xos-card-wrapper"
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
          background: `radial-gradient(circle 420px at var(--sx,50%) var(--sy,50%), rgba(29,78,216,1) 0%, rgba(${GLOW_RGB},0.6) 25%, rgba(${GLOW_RGB},0.2) 65%, transparent 100%)`,
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
          background: "transparent",
          borderRadius: 24,
          padding: 24,
          position: "relative",
          overflow: "hidden",
          cursor: "pointer",
          transformStyle: "preserve-3d",
          willChange: "transform",
          height: "100%",
          border: "1px solid rgba(15,23,42,0.08)",
        }}
      >
        {/* Surface spotlight */}
        <div
          ref={spotRef}
          style={{
            position: "absolute", inset: 0, borderRadius: 22,
            pointerEvents: "none", zIndex: 1, opacity: 0,
            background: `radial-gradient(circle ${SPOTLIGHT_R}px at var(--sx,50%) var(--sy,50%), rgba(${GLOW_RGB},0.15) 0%, rgba(${GLOW_RGB},0.05) 50%, transparent 100%)`,
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
        <div className="xos-bc-content" style={{ position: "relative", zIndex: 4, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, color: "#0f172a", lineHeight: 1.35, whiteSpace: "pre-line" }}>
              {item.title}
            </div>
            {item.shortBody && (
              <div className="xos-short-body" style={{ fontSize: 14, color: "rgba(15,23,42,0.55)", marginTop: 8, lineHeight: 1.4 }}>
                {item.shortBody}
              </div>
            )}
          </div>
          <div>
            {item.tag && (
              <div style={{
                display: "inline-block",
                background: `rgba(${GLOW_RGB},0.1)`, color: "#2563eb",
                fontSize: 12, fontWeight: 600, padding: "5px 14px", borderRadius: 20,
                border: `1px solid rgba(${GLOW_RGB},0.3)`,
              }}>
                {item.tag}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Section ──────────────────────────────────────────────────────────────

function TiltedHeading({ children }: { children: React.ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-100, 0, 100], [45, 15, -15]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-100, 0, 100], [-45, -15, 15]), { stiffness: 150, damping: 20 });

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
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative px-6 py-3 md:px-8 md:py-4 bg-[#0E56FA] transform -skew-x-6 cursor-crosshair shadow-[0_10px_30px_-10px_rgba(14,86,250,0.6)] pointer-events-auto"
      >
        <motion.h2
          style={{ translateZ: 40 }}
          className="text-3xl md:text-5xl font-medium tracking-tighter text-white uppercase drop-shadow-md whitespace-nowrap"
        >
          {children}
        </motion.h2>
      </motion.div>
    </div>
  );
}

export default function ExperienceSection() {
  const gridMouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -9999, y: -9999, active: false });
  const [selectedItem, setSelectedItem] = useState<BentoItem | null>(null);

  const handleGridMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    gridMouseRef.current = { x: e.clientX, y: e.clientY, active: true };
  }, []);

  const handleGridMouseLeave = useCallback(() => {
    gridMouseRef.current = { x: -9999, y: -9999, active: false };
  }, []);

  return (
    <section className="font-sans" style={{ background: "transparent", padding: "40px 48px 80px" }}>
      <style>{`
        /* No explicit card height, inherits perfectly from grid-auto-rows */
        .xos-card .xos-short-body {
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .xos-card:hover .xos-short-body {
          opacity: 1;
          transform: translateY(0);
        }
        @keyframes xos-rip { 
          from { transform: scale(0); opacity: 1; }
          to   { transform: scale(5); opacity: 0; } 
        }
        @media (max-width: 900px) {
          .xos-bento-grid {
            grid-template-columns: 1fr 1fr !important;
            grid-auto-rows: 200px !important;
          }
          .xos-card-wrapper {
            grid-column: span 1 !important;
            grid-row: span 1 !important;
          }
        }
        @media (max-width: 600px) {
          .xos-bento-grid {
            grid-template-columns: 1fr !important;
            grid-auto-rows: 160px !important;
          }
        }
      `}</style>

      {/* Grid container with restricted width to perfectly center the cards leaving side empty space */}
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        {/* Section Title — TeamSection style */}
        <div style={{ marginBottom: 48, display: "flex", alignItems: "flex-start" }}>
          <TiltedHeading>
            My Archives
          </TiltedHeading>
        </div>

        {/* Bento grid */}
        <div
          className="xos-bento-grid"
          onMouseMove={handleGridMouseMove}
          onMouseLeave={handleGridMouseLeave}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gridAutoRows: "136px",
            gap: 24,
          }}
        >
          {ITEMS.map(item => (
            <BentoCard key={item.id} item={item} gridMouseRef={gridMouseRef} onClick={() => setSelectedItem(item)} />
          ))}
        </div>
      </div>

      {/* Pop-up Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.5)",
              backdropFilter: "blur(8px)",
              padding: 24,
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#ffffff",
                border: "1px solid rgba(15,23,42,0.1)",
                borderRadius: 24,
                padding: 40,
                maxWidth: 480,
                width: "100%",
                boxShadow: "0 24px 60px rgba(0,0,0,0.12)",
              }}
            >
              {selectedItem.tag && (
                <div style={{
                  display: "inline-block", marginBottom: 16,
                  background: `rgba(${GLOW_RGB},0.1)`, color: "#2563eb",
                  fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 20,
                  border: `1px solid rgba(${GLOW_RGB},0.3)`,
                }}>
                  {selectedItem.tag}
                </div>
              )}
              <h3 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", marginBottom: 20, lineHeight: 1.2, whiteSpace: "pre-line" }}>
                {selectedItem.title}
              </h3>
              <div style={{ fontSize: 15, color: "rgba(15,23,42,0.65)", lineHeight: 1.7, whiteSpace: "pre-line" }}>
                {selectedItem.body}
              </div>
              
              <button
                onClick={() => setSelectedItem(null)}
                style={{
                  marginTop: 32, padding: "10px 24px", borderRadius: 8,
                  background: "#2563eb", border: "none", color: "#fff", cursor: "pointer",
                  fontSize: 14, fontWeight: 600,
                }}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
