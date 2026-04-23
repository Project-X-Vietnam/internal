"use client";

import { useEffect, useRef, useState } from "react";

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
    bg: "#e0e7ff",
    tilt: 10,
  },
];

export default function MyPicSection() {
  const [fanProgress, setFanProgress] = useState(0);
  const fanWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFanScroll = () => {
      const wrapper = fanWrapperRef.current;
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      const wrapperH = wrapper.offsetHeight;
      const vh = window.innerHeight;
      const scrolled = -rect.top;
      const totalScrollable = wrapperH - vh;
      if (totalScrollable <= 0) return;
      setFanProgress(Math.max(0, Math.min(1, scrolled / totalScrollable)));
    };
    window.addEventListener("scroll", handleFanScroll, { passive: true });
    handleFanScroll();
    return () => window.removeEventListener("scroll", handleFanScroll);
  }, []);

  return (
    <>
      <style>{`
        .fan-wrapper {
          position: relative;
          height: calc(100vh + 2 * 90vh); /* adjusted for 2 cards */
          background: transparent;
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
          width: 100%;
          max-width: 860px;
          margin: 0 auto 40px;
          padding: 0;
          display: block;
        }
        /* .fan-tag and .fan-title not needed globally with the inline layout anymore but left for safety */

        .fan-stage {
          position: relative;
          width: 100%;
          height: 420px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }
        .fan-card {
          position: absolute;
          bottom: 0;
          left: 50%;
          width: clamp(260px, 25vw, 320px);
          min-height: 380px;
          border-radius: 24px;
          padding: 24px 20px;
          border: 1.5px solid rgba(15,23,42,0.1);
          box-shadow: 0 16px 40px rgba(0,0,0,0.15);
          display: flex;
          flex-direction: column;
          gap: 12px;
          transform-origin: bottom center;
          transition: transform 0.12s ease-out, opacity 0.12s ease-out;
          will-change: transform, opacity;
        }
        .fan-card-tag {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #1e293b;
        }
        .fan-card-title {
          font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 800;
          font-size: 22px;
          color: #0f172a;
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
        }

        @media (max-width: 900px) {
          .fan-stage { height: 320px; }
          .fan-card { width: 220px; min-height: 280px; }
        }
      `}</style>
      
      <div className="fan-wrapper" ref={fanWrapperRef}>
        <div className="fan-sticky-scene">
          <div className="fan-header">
            <div style={{ marginBottom: 0 }}>
            <div style={{
              display: "inline-block",
              background: "#2563eb",
              padding: "12px 28px",
              borderRadius: 0,
              transform: "rotate(-3deg)",
              boxShadow: "5px 8px 20px rgba(0,0,0,0.22), 3px 5px 12px rgba(37,99,235,0.35)",
              transformOrigin: "left center",
            }}>
              <h2 style={{
                fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(24px, 3vw, 40px)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "#ffffff",
                margin: 0,
                lineHeight: 1.1,
                whiteSpace: "nowrap",
              }}>
                My Pictures
              </h2>
            </div>
          </div>
          </div>

          <div className="fan-stage">
            {MY_PICS.map((card, i) => {
              const N = MY_PICS.length;
              const slotSize = 1 / N;
              // fanFactor drives horizontal spread when passing 70% bounds
              const fanFactor = Math.max(0, Math.min(1, (fanProgress - 0.70) / 0.30));
              const cardW = 320; 
              const spread = cardW * 0.95; 
              
              // Exactly 2 cards, mapped symmetrically from center 
              const targetX = (i === 0 ? -1 : 1) * spread * 0.5;
              const translateX = fanFactor * targetX;

              const slotStart = i * slotSize;
              const cardProgress = Math.max(0, Math.min(1, (fanProgress - slotStart) / slotSize));
              const ease = 1 - Math.pow(1 - cardProgress, 3);
              const translateY = (1 - ease) * 110; 

              const rotate = card.tilt;
              const zIndex = cardProgress > 0.5 ? i + 1 : 0;

              return (
                <div
                  key={i}
                  className="fan-card"
                  style={{
                    backgroundColor: card.bg,
                    marginLeft: `-${cardW / 2}px`,
                    zIndex,
                    opacity: cardProgress > 0.05 ? 1 : 0,
                    transform: `translateX(${translateX}px) translateY(${translateY}%) rotate(${rotate}deg)`,
                  }}
                >
                  <span className="fan-card-tag">Photo</span>
                  <h3 className="fan-card-title">{card.title}</h3>
                  <div className="fan-card-desc">
                    <img src={card.img} alt={card.title} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
