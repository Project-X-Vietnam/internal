"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

export const AmbientAudio = ({ isExiting }: { isExiting?: boolean }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const MAX_VOL = 0.3;

  const startAudio = () => {
    if (!audioRef.current) return;
    
    setHasInteracted(true);
    // Don't change isMuted here, it defaults to false
    
    if (isMuted) return;

    audioRef.current.volume = 0;
    audioRef.current.loop = true;
    audioRef.current.play().then(() => {
      // Cross-fade in smoothly over ~1.5 seconds if successful
      let vol = 0;
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = setInterval(() => {
        if (vol < MAX_VOL) {
          vol += 0.01;
          if (audioRef.current) audioRef.current.volume = Math.min(vol, MAX_VOL);
        } else {
          if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        }
      }, 50);
    }).catch((e) => {
      console.log("Audio play blocked by browser. Waiting for interaction.", e);
      // Do NOT set isMuted to true. We want the UI to show it as "ON" by default.
    });
  };

  useEffect(() => {
    // Attempt to start audio immediately on mount
    startAudio();
    
    const handleInteraction = () => {
        if (audioRef.current && audioRef.current.paused && !isMuted) {
            audioRef.current.play().catch(() => {});
            audioRef.current.volume = MAX_VOL;
        }
    };
    
    // Listen for global user interaction to overcome autoplay block
    window.addEventListener("click", handleInteraction, { once: true });
    window.addEventListener("scroll", handleInteraction, { once: true });
    window.addEventListener("wheel", handleInteraction, { once: true });
    window.addEventListener("mousemove", handleInteraction, { once: true });
    window.addEventListener("touchstart", handleInteraction, { once: true });
    
    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("scroll", handleInteraction);
      window.removeEventListener("wheel", handleInteraction);
      window.removeEventListener("mousemove", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, [isMuted]);

  // Handle smooth fade out when page is exiting
  useEffect(() => {
    if (isExiting && audioRef.current && !isMuted) {
      let vol = audioRef.current.volume;
      
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = setInterval(() => {
        if (vol > 0.02) {
          vol -= 0.01;
          if (audioRef.current) audioRef.current.volume = Math.max(vol, 0);
        } else {
          if (audioRef.current) {
            audioRef.current.volume = 0;
            audioRef.current.pause();
          }
          if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        }
      }, 50);
    }
  }, [isExiting, isMuted]);

  const toggleMute = () => {
    if (!audioRef.current) return;
    
    if (isMuted) {
        setIsMuted(false);
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        audioRef.current.volume = 0;
        audioRef.current.play().catch(() => {});
        
        // Quick fade-in for manual toggle
        let vol = 0;
        fadeIntervalRef.current = setInterval(() => {
            if (vol < MAX_VOL) {
              vol += 0.05;
              if (audioRef.current) audioRef.current.volume = Math.min(vol, MAX_VOL);
            } else {
              if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
            }
        }, 50);

    } else {
        setIsMuted(true);
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        
        // Quick fade-out for manual toggle
        let vol = audioRef.current.volume;
        fadeIntervalRef.current = setInterval(() => {
            if (vol > 0.05) {
              vol -= 0.05;
              if (audioRef.current) audioRef.current.volume = Math.max(vol, 0);
            } else {
              if (audioRef.current) {
                audioRef.current.volume = 0;
                audioRef.current.pause();
              }
              if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
            }
        }, 50);
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/audio/ambient.mp3" preload="auto" />
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: hasInteracted ? 1 : 0 }}
        onClick={(e) => {
          e.stopPropagation();
          toggleMute();
        }}
        className="fixed bottom-8 right-8 z-[110] p-3.5 bg-black/20 hover:bg-[#0E56FA]/20 rounded-full backdrop-blur-xl border border-white/10 hover:border-[#0E56FA]/50 transition-all duration-300 text-white/50 hover:text-white"
        aria-label="Toggle ambient sound"
        style={{ pointerEvents: hasInteracted ? "auto" : "none" }}
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </motion.button>
    </>
  );
};
