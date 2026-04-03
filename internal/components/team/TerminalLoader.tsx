"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+<>?";

interface TerminalLoaderProps {
  onComplete: () => void;
  fullScreen?: boolean;
}

export function TerminalLoader({ onComplete, fullScreen = false }: TerminalLoaderProps) {
  const [text, setText] = useState("SYS.CONNECT...      ");
  const [stage, setStage] = useState<"decrypt" | "granted" | "done">("decrypt");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let interval: ReturnType<typeof setInterval>;
    let timeout: ReturnType<typeof setTimeout>;
    
    if (stage === "decrypt") {
      let ticks = 0;
      interval = setInterval(() => {
        setText(
          Array.from({length: 15})
            .map(() => CHARS[Math.floor(Math.random() * CHARS.length)])
            .join("")
        );
        ticks++;
        if (ticks > 25) { // ~1.25s runtime
          clearInterval(interval);
          setStage("granted");
          setText("ACCESS GRANTED.");
        }
      }, 50);
    } else if (stage === "granted") {
      timeout = setTimeout(() => {
        setStage("done");
        onComplete();
      }, 1500);
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [stage, onComplete]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {stage !== "done" && (
        <motion.div
           initial={{ opacity: 1 }}
           exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
           transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
           className={`${fullScreen ? "fixed" : "absolute"} inset-0 z-[100] flex items-center justify-center bg-[#01001F] outline outline-1 outline-white/10`}
        >
          {/* Scanline overlay for cyber aesthetic */}
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none" />
          
          <div 
            className={`font-mono text-xl sm:text-2xl md:text-4xl tracking-[0.25em] md:tracking-[0.4em] font-black relative z-10 text-center px-4 transition-colors duration-200 ${
              stage === "granted" ? "text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]" : "text-[#17CAFA] drop-shadow-[0_0_15px_rgba(23,202,250,0.8)]"
            }`}
          >
             {text}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
