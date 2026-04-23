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
          {/* Base gradient only */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#020818] via-[#030a1a] to-[#020818]" />

          {/* Animated grain overlay */}
          <motion.div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
        </motion.div>

        {/* Main content container */}
        <div className="relative z-10 flex flex-col items-center px-8">
          {/* Logo container */}
          <motion.div
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
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
              <div className="flex flex-col items-center justify-center gap-1 md:gap-2">
                <div className="text-2xl md:text-4xl font-bold tracking-tight text-[#0E56FA]">
                  Project
                </div>
                <svg 
                  className="w-24 h-24 md:w-32 md:h-32"
                  viewBox="0 0 250 250" fill="none" xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M125 47.0824L146.823 68.9055C148.145 70.2271 150.202 70.4679 151.794 69.4834L226.996 23.0041L205.173 1.18102C203.851 -0.140613 201.794 -0.381396 200.202 0.603142L125 47.0824Z" fill="#17CAFA"/>
                  <path d="M202.917 125L181.094 103.177C179.773 101.856 179.532 99.7982 180.516 98.2063L226.996 23.0042L248.819 44.8272C250.14 46.1489 250.381 48.2062 249.397 49.7981L202.917 125Z" fill="#17CAFA"/>
                  <path d="M202.917 125L181.094 146.823C179.773 148.145 179.532 150.202 180.516 151.794L226.996 226.996L248.819 205.173C250.14 203.852 250.381 201.794 249.397 200.202L202.917 125Z" fill="#0E56FA"/>
                  <path d="M125 202.918L146.823 181.095C148.145 179.773 150.202 179.532 151.794 180.517L226.996 226.996L205.173 248.819C203.851 250.141 201.794 250.382 200.202 249.397L125 202.918Z" fill="#0E56FA"/>
                  <path d="M125.001 202.915L103.178 181.092C101.856 179.77 99.7987 179.529 98.2069 180.514L23.0047 226.993L44.8278 248.816C46.1494 250.138 48.2068 250.379 49.7986 249.394L125.001 202.915Z" fill="#0E56FA"/>
                  <path d="M47.0826 124.997L68.9056 146.82C70.2272 148.142 70.468 150.199 69.4835 151.791L23.0042 226.993L1.18116 205.17C-0.140475 203.849 -0.381259 201.791 0.603279 200.199L47.0826 124.997Z" fill="#0E56FA"/>
                  <path d="M47.0826 124.997L68.9056 103.174C70.2272 101.853 70.468 99.7953 69.4835 98.2035L23.0042 23.0013L1.18116 44.8244C-0.140475 46.146 -0.381259 48.2034 0.603279 49.7952L47.0826 124.997Z" fill="#0E56FA"/>
                  <path d="M125.001 47.0798L103.178 68.9028C101.856 70.2244 99.7987 70.4652 98.2069 69.4807L23.0047 23.0014L44.8278 1.18102C46.1494 -0.140613 48.2068 -0.381396 49.7986 0.603142L125.001 47.0824V47.0798Z" fill="#0E56FA"/>
                </svg>
              </div>
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
