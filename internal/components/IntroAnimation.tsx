"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface IntroAnimationProps {
  onComplete: () => void;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [phase, setPhase] = useState<"ambient" | "logo" | "text" | "tagline" | "reveal">("ambient");

  useEffect(() => {
    // Extended cinematic timeline
    const timers = [
      setTimeout(() => setPhase("logo"), 600),      // Ambient → Logo
      setTimeout(() => setPhase("text"), 2200),     // Logo → Text
      setTimeout(() => setPhase("tagline"), 3800),  // Text → Tagline
      setTimeout(() => setPhase("reveal"), 5200),   // Tagline → Reveal
      setTimeout(() => onComplete(), 6200),         // Complete
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const handleSkip = () => {
    onComplete();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: "#020818" }}
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* Deep ambient background layers */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#020818] via-[#030a1a] to-[#020818]" />
          
          {/* Animated grain overlay */}
          <motion.div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
        </motion.div>

        {/* Primary gradient orb - large, slow */}
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(14,86,250,0.25) 0%, rgba(14,86,250,0) 70%)",
            filter: "blur(80px)",
          }}
          initial={{ opacity: 0, scale: 0.3, x: "-30%", y: "-20%" }}
          animate={{
            opacity: [0, 0.6, 0.4],
            scale: [0.3, 1.2, 1],
            x: ["-30%", "-10%", "-15%"],
            y: ["-20%", "0%", "-5%"],
          }}
          transition={{ duration: 5, ease: "easeOut" }}
        />

        {/* Secondary cyan orb */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(23,202,250,0.2) 0%, rgba(23,202,250,0) 70%)",
            filter: "blur(60px)",
          }}
          initial={{ opacity: 0, scale: 0.3, x: "40%", y: "30%" }}
          animate={{
            opacity: [0, 0.5, 0.35],
            scale: [0.3, 1.1, 0.95],
            x: ["40%", "20%", "25%"],
            y: ["30%", "10%", "15%"],
          }}
          transition={{ duration: 5, ease: "easeOut", delay: 0.5 }}
        />

        {/* Accent orb */}
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(14,86,250,0.15) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
          initial={{ opacity: 0, x: "-50%", y: "50%" }}
          animate={{
            opacity: [0, 0.4, 0.3],
            x: ["-50%", "-40%", "-45%"],
            y: ["50%", "40%", "45%"],
          }}
          transition={{ duration: 4, ease: "easeOut", delay: 1 }}
        />

        {/* Main content container */}
        <div className="relative z-10 flex flex-col items-center px-8">
          {/* Logo container with glow */}
          <motion.div
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* Logo glow effect */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={phase !== "ambient" ? { opacity: [0, 0.8, 0.5], scale: [0.5, 1.3, 1.1] } : {}}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              <div
                className="w-40 h-40 md:w-52 md:h-52 rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(14,86,250,0.4) 0%, transparent 70%)",
                  filter: "blur(30px)",
                }}
              />
            </motion.div>

            {/* Logo mark */}
            <motion.div
              initial={{ opacity: 0, scale: 0.3, rotate: -180, filter: "blur(20px)" }}
              animate={
                phase !== "ambient"
                  ? {
                      opacity: 1,
                      scale: phase === "reveal" ? 0.85 : 1,
                      rotate: 0,
                      filter: "blur(0px)",
                      y: phase === "reveal" ? -30 : 0,
                    }
                  : {}
              }
              transition={{
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1],
                scale: { duration: 0.6 },
                y: { duration: 0.8 },
              }}
            >
              <Image
                src="/favicon.svg"
                alt="Project X"
                width={180}
                height={180}
                className="w-32 h-32 md:w-44 md:h-44"
                priority
              />
            </motion.div>
          </motion.div>

          {/* Text reveal - Simple fade */}
          <motion.h1
            className="mt-10 text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center tracking-tight"
            style={{ fontFamily: "var(--font-body), 'Plus Jakarta Sans', sans-serif" }}
            initial={{ opacity: 0, y: 15 }}
            animate={
              phase === "text" || phase === "tagline" || phase === "reveal"
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 15 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Project X Vietnam
          </motion.h1>

          {/* Tagline */}
          <motion.div
            className="mt-6 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={
              phase === "tagline" || phase === "reveal"
                ? { opacity: 1, y: 0 }
                : {}
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.p
              className="text-white/50 text-center text-base md:text-lg font-medium"
              style={{ fontFamily: "'Plus Jakarta Sans', var(--font-sans), sans-serif" }}
              initial={{ opacity: 0 }}
              animate={
                phase === "tagline" || phase === "reveal"
                  ? { opacity: 1 }
                  : {}
              }
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              Welcome aboard
            </motion.p>
          </motion.div>

        </div>

        {/* Skip button */}
        <motion.button
          onClick={handleSkip}
          className="absolute bottom-12 right-12 px-5 py-2.5 text-sm text-white/30 hover:text-white/60 transition-all duration-300 flex items-center gap-2 group rounded-full border border-white/10 hover:border-white/20 hover:bg-white/5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          aria-label="Skip intro animation"
        >
          Skip intro
          <svg
            className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </motion.button>

        {/* Keyboard hint */}
        <motion.div
          className="absolute bottom-12 left-12 flex items-center gap-3 text-xs text-white/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <span>Press</span>
          <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded text-white/30 font-mono">
            Space
          </kbd>
          <span>to skip</span>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-pxv-cyan to-primary"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 6, ease: "linear" }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
