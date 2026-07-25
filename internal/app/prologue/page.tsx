"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PROLOGUE_LINES } from "@/lib/prologue";

export default function ProloguePage() {
  const router = useRouter();
  const [visibleLines, setVisibleLines] = useState(0);
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    if (visibleLines < PROLOGUE_LINES.length) {
      const delay = visibleLines === 0 ? 800 : 2200;
      const timer = setTimeout(() => setVisibleLines((v) => v + 1), delay);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setShowContinue(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [visibleLines]);

  return (
    <div className="min-h-screen bg-warm-bg text-warm-text flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-6">
        <p className="font-heading text-sm tracking-[0.2em] text-warm-text-muted text-center mb-8">
          CLASSIFIED — INVESTIGATION BRIEFING
        </p>

        <div className="space-y-5 min-h-[60vh]">
          {PROLOGUE_LINES.slice(0, visibleLines).map((line, i) => (
            <p
              key={i}
              className="text-base md:text-lg text-warm-text leading-relaxed animate-[fade-in_0.8s_ease-out]"
              style={{
                fontStyle: i === 3 || i === 10 ? "italic" : "normal",
                color: i === 10 ? "#5C3D2E" : undefined,
                fontWeight: i === 10 ? 600 : 400,
              }}
            >
              {line}
            </p>
          ))}
        </div>

        {showContinue && (
          <div className="text-center pt-8 animate-[fade-in_0.8s_ease-out]">
            <button
              onClick={() => router.push("/hub")}
              className="px-8 py-3 bg-warm-btn text-warm-bg font-semibold rounded-lg hover:bg-warm-btn-hover transition-colors"
            >
              Enter the tower
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
