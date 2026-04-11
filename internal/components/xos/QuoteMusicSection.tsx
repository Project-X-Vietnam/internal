"use client";

// ─── Marquee only (theme song player removed) ─────────────────────────────────

function Marquee() {
  const item = (
    <span style={{
      whiteSpace: "nowrap", fontSize: 17, fontWeight: 700,
      color: "rgba(255,255,255,0.45)", paddingRight: 72, letterSpacing: "0.02em",
    }}>
      {"Yipee — or "}
      <span style={{ color: "#60a5fa" }}>meo</span>
      {", when I\u2019m overstimulated \u00a0\u2736\u00a0 "}
    </span>
  );

  return (
    <div style={{ overflow: "hidden" }}>
      <div style={{ display: "flex", width: "max-content", animation: "xos-mq 26s linear infinite" }}>
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

// ─── Main Component ───────────────────────────────────────────────────────────

export default function QuoteMusicSection() {
  return (
    // paddingTop:72 clears the fixed navbar (72px tall)
    <section style={{
      background: "#0d1117",
      paddingTop: 72,
      borderBottom: "1px solid rgba(255,255,255,0.05)",
    }}>
      <div style={{ paddingTop: 18, paddingBottom: 18 }}>
        <Marquee />
      </div>
    </section>
  );
}
