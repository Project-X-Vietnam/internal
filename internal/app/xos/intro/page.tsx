"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Plus_Jakarta_Sans } from "next/font/google";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { AmbientAudio } from "@/components/AmbientAudio";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  display: "swap",
});

const AnimatedSection = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 40 }}
      whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`py-24 flex flex-col items-center justify-center text-center px-6 relative z-10 ${className.includes('min-h-') ? className : `min-h-[65vh] ${className}`}`}
    >
      {children}
    </motion.div>
  );
};

// Extracted word-by-word reveal component for "Flow Text" effect
const FlowText = ({ text, className = "", spanClassName = "" }: { text: string; className?: string, spanClassName?: string }) => {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring" as const,
        damping: 15,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(5px)",
      transition: {
        type: "spring" as const,
        damping: 15,
        stiffness: 100,
      },
    },
  };

  if (shouldReduceMotion) {
    return <span className={`${className} ${spanClassName}`}>{text}</span>;
  }

  // Removed overflow:hidden because it severely clips letters with descenders (g, y, p)
  // Removed bg-clip-text text-transparent from outer container because framer-motion transform breaks webkit clipping context
  return (
    <motion.div
      style={{ display: "inline-flex", flexWrap: "wrap", justifyContent: "center" }}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-15%" }}
      className={className}
    >
      {words.map((word, index) => (
        <motion.span variants={child} style={{ marginRight: "0.25em" }} className={spanClassName} key={index}>
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

const GradientCircleLights = () => {
  return (
    <div className="absolute top-[0%] left-0 w-full h-[150vh] pointer-events-none -z-10 overflow-visible flex justify-center">
      {/* Large Gradient Circles */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: [0.3, 0.7, 0.3], scale: [0.9, 1.1, 0.9] }}
        viewport={{ once: false, margin: "10%" }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] left-[-20%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-[#17CAFA]/60 via-[#0E56FA]/30 to-transparent blur-[90px]"
      />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.05, 1] }}
        viewport={{ once: false, margin: "10%" }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-[40%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tl from-[#0E56FA]/70 via-[#17CAFA]/40 to-transparent blur-[80px]"
      />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: [0.3, 0.8, 0.3], scale: [0.9, 1.2, 0.9] }}
        viewport={{ once: false, margin: "10%" }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-[70%] left-[10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-tr from-[#17CAFA]/50 via-[#0E56FA]/20 to-transparent blur-[100px]"
      />
    </div>
  );
};

export default function XOSIntroPage() {
  const [isExiting, setIsExiting] = useState(false);
  const [vortexPos, setVortexPos] = useState({ x: "50%", y: "50%" });
  const [showLogo, setShowLogo] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleInteraction = () => setHasInteracted(true);
    window.addEventListener("click", handleInteraction, { once: true });
    window.addEventListener("touchstart", handleInteraction, { once: true });
    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, []);

  const handleExplore = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isExiting) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const scrollX = window.scrollX || document.documentElement.scrollLeft;
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    // Set the vortex center directly to the button's coordinates
    setVortexPos({
      x: `${rect.left + scrollX + rect.width / 2}px`,
      y: `${rect.top + scrollY + rect.height / 2}px`,
    });

    setIsExiting(true);

    // After vortex effect, show the logo
    setTimeout(() => {
      setShowLogo(true);
    }, 1200);

    // Finally, navigate
    setTimeout(() => {
      router.push("/xos/team");
    }, 3000);
  };

  return (
    <main className="bg-[#01001F] text-white min-h-screen selection:bg-[#0E56FA] selection:text-white pb-32 font-sans relative overflow-hidden">
      
      <motion.div
        animate={{ opacity: hasInteracted ? 0 : 0.6 }}
        transition={{ duration: 1 }}
        className="fixed top-8 right-8 z-[100] text-sm text-zinc-400 pointer-events-none tracking-widest"
      >
        Click anywhere
      </motion.div>

      {/* Content wrapper for the vortex effect */}
      <motion.div
        animate={isExiting ? {
          scale: 0,
          opacity: 0,
          filter: "blur(10px)",
        } : {
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
        }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        style={{ transformOrigin: `${vortexPos.x} ${vortexPos.y}` }}
        className="w-full relative"
      >
        {/* Background Gradient Mesh - Modern feel */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-[#0E56FA]/15 to-transparent blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-tl from-[#17CAFA]/15 to-transparent blur-[120px]" />
          <div className="absolute top-[40%] left-[30%] w-[60vw] h-[20vw] rounded-[100%] bg-[#0E56FA]/10 blur-[150px] -rotate-45" />
        </div>

      {/* S1: Hero Section */}
      <AnimatedSection className="min-h-[100vh]">
        <motion.h1
          initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          className={`${jakarta.className} text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6 mt-8`}
        >
          <motion.span
            className="inline-block pb-3 bg-clip-text text-transparent bg-gradient-to-r from-white via-[#17CAFA] to-[#0E56FA] bg-[length:200%_auto]"
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 5, ease: "linear", repeat: Infinity }}
          >
            Welcome to xOS.
          </motion.span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          viewport={{ once: true }}
          className="text-xl md:text-2xl text-zinc-400 font-medium max-w-2xl leading-relaxed"
        >
          A place for people, not just profiles.
        </motion.p>
      </AnimatedSection>

      {/* S2 */}
      <AnimatedSection>
        <div className="text-2xl md:text-4xl text-zinc-200 font-medium max-w-3xl leading-snug">
          <FlowText text="You’ve probably seen names, roles, and LinkedIn bios before." />
        </div>
        <motion.div
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          whileInView={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{ delay: 0.8, duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, margin: "-10%" }}
          className="mt-6 inline-block bg-[#0E56FA] text-white px-4 py-1.5 text-2xl md:text-4xl font-medium rounded-sm"
        >
          But people are always more than that.
        </motion.div>
      </AnimatedSection>

      {/* S3 */}
      <AnimatedSection>
        <GradientCircleLights />
        <div className="text-xl md:text-3xl text-zinc-300 font-medium max-w-4xl leading-relaxed text-balance">
          <FlowText text="Behind every title here is a light — someone figuring things out, building something on the side, or simply trying to do meaningful work with people they connect with." />
        </div>
      </AnimatedSection>

      {/* S4 */}
      <AnimatedSection>
        <div className="text-2xl md:text-4xl text-zinc-300 font-medium max-w-3xl leading-relaxed">
          <FlowText text="This is where Project X" />
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-transparent bg-clip-text bg-gradient-to-r from-[#17CAFA] to-[#0E56FA] font-bold mt-2 block"
          >
            hits a little different.
          </motion.span>
        </div>
      </AnimatedSection>

      {/* S5 */}
      <AnimatedSection>
        <div className="text-3xl md:text-5xl text-white font-medium max-w-4xl leading-tight">
          <FlowText text="So go ahead —" />
          <br />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            viewport={{ once: true }}
            className="text-[#17CAFA] mt-4 block"
          >
            <FlowText text="follow the lights, open profiles, and see where they lead." />
          </motion.div>
        </div>
      </AnimatedSection>

      {/* S6 */}
      <AnimatedSection>
        <div className="text-2xl md:text-4xl text-zinc-400 font-medium max-w-3xl leading-relaxed space-y-4 flex flex-col">
          <FlowText text="You might find a co-founder." />
          <FlowText text="You might find a friend." />
          <motion.span
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-white font-semibold mt-4 block"
          >
            You might just find someone who gets it.
          </motion.span>
        </div>
      </AnimatedSection>

      {/* S7 & Final Section (Combined for closer spacing) */}
      <AnimatedSection className="min-h-[65vh] py-16 mt-8 pb-32">
        <h2 className={`${jakarta.className} text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter leading-none mb-16`}>
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#0E56FA] to-[#17CAFA]">
            Good people.
          </span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-tr from-[#17CAFA] to-[#0E56FA]">
            Real energy.
          </span>
        </h2>

        <a
          href="/xos/team"
          onClick={handleExplore}
          className="group relative inline-flex items-center justify-center px-10 py-5 bg-[#01001F] border border-[#0E56FA]/50 text-white font-semibold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_-5px_#0E56FA] focus:outline-none focus:ring-4 focus:ring-[#0E56FA]/50"
        >
          {/* Subtle gradient hover background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0E56FA] to-[#17CAFA] opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="relative z-10 text-lg tracking-wide">Explore xOS</span>
        </a>

        <div className="mt-24 max-w-2xl border-l-2 border-[#17CAFA]/30 pl-8 text-left relative">
          {/* Background glow behind quote */}
          <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-32 h-32 bg-[#17CAFA]/10 blur-3xl rounded-full z-0 pointer-events-none" />
          <p className="relative z-10 text-lg md:text-xl text-zinc-400 font-medium italic leading-relaxed">
            "Surround yourself with people who challenge you, teach you, and push
            you to be your best self."
          </p>
          <p
            className={`${jakarta.className} relative z-10 mt-6 text-sm font-bold text-zinc-500 uppercase tracking-widest`}
          >
            — Bill Gates
          </p>
        </div>
      </AnimatedSection>
      </motion.div>

      {/* Project X Logo Reveal Overlay */}
      {showLogo && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#01001F]"
        >
          <motion.img 
            initial={{ scale: 0.9 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            src="/xos-logo-transparent.png" 
            alt="Project X" 
            className="w-72 h-72 md:w-[28rem] md:h-[28rem] object-contain drop-shadow-[0_0_80px_rgba(23,202,250,0.6)]"
          />
        </motion.div>
      )}
      <AmbientAudio isExiting={isExiting} />
    </main>
  );
}
