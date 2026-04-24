"use client";

import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Plus_Jakarta_Sans } from "next/font/google";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { AmbientAudio } from "@/components/AmbientAudio";
import { ChevronRight, ChevronLeft } from "lucide-react";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const AnimatedSlide = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className={`absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10 w-full h-full overflow-y-auto ${className}`}
    >
      <div className="my-auto flex flex-col items-center justify-center w-full max-w-7xl relative">
          {children}
      </div>
    </motion.div>
  );
};

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
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", damping: 15, stiffness: 100 } },
    hidden: { opacity: 0, y: 20, filter: "blur(5px)", transition: { type: "spring", damping: 15, stiffness: 100 } },
  };

  if (shouldReduceMotion) return <span className={`${className} ${spanClassName}`}>{text}</span>;

  return (
    <motion.div
      style={{ display: "inline-flex", flexWrap: "wrap", justifyContent: "center" }}
      variants={container}
      initial="hidden"
      animate="visible"
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
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden flex justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] left-[-20%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-[#17CAFA]/60 via-[#0E56FA]/30 to-transparent blur-[90px]"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-[40%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tl from-[#0E56FA]/70 via-[#17CAFA]/40 to-transparent blur-[80px]"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.9, 1.2, 0.9] }}
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
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const totalSteps = 7;

  useEffect(() => {
    const handleInteraction = () => setHasInteracted(true);
    window.addEventListener("click", handleInteraction, { once: true });
    window.addEventListener("touchstart", handleInteraction, { once: true });
    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, []);

  const nextStep = () => setCurrentStep(s => Math.min(totalSteps - 1, s + 1));
  const prevStep = () => setCurrentStep(s => Math.max(0, s - 1));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextStep();
      if (e.key === "ArrowLeft") prevStep();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleExplore = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isExiting) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const scrollX = window.scrollX || document.documentElement.scrollLeft;
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    setVortexPos({
      x: `${rect.left + scrollX + rect.width / 2}px`,
      y: `${rect.top + scrollY + rect.height / 2}px`,
    });

    setIsExiting(true);

    setTimeout(() => {
      setShowLogo(true);
    }, 1200);

    setTimeout(() => {
      router.push("/xos/team");
    }, 3000);
  };

  const slides = [
    <AnimatedSlide key="0">
      <motion.h1
         initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
         animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
         transition={{ duration: 1, ease: "easeOut" }}
         className={`${jakarta.className} text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight mb-6 mt-8`}
       >
         <motion.span
           className="inline-block pb-3 bg-clip-text text-transparent bg-gradient-to-r from-[#0E56FA] via-[#17CAFA] to-[#0E56FA] bg-[length:200%_auto]"
           animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
           transition={{ duration: 5, ease: "linear", repeat: Infinity }}
         >
           Welcome to xOS.
         </motion.span>
       </motion.h1>
       <motion.p
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ delay: 1, duration: 1 }}
         className="text-xl md:text-2xl text-zinc-600 font-medium max-w-2xl leading-relaxed"
       >
         A place for people, not just profiles.
       </motion.p>
    </AnimatedSlide>,

    <AnimatedSlide key="1">
      <div className="text-2xl md:text-4xl text-zinc-800 font-medium max-w-3xl leading-snug">
         <FlowText text="You’ve probably seen names, roles, and LinkedIn bios before." />
       </div>
       <motion.div
         initial={{ clipPath: "inset(0 100% 0 0)" }}
         animate={{ clipPath: "inset(0 0% 0 0)" }}
         transition={{ delay: 0.8, duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
         className="mt-6 inline-block bg-[#0E56FA] text-white px-4 py-1.5 text-2xl md:text-4xl font-medium rounded-sm"
       >
         But people are always more than that.
       </motion.div>
    </AnimatedSlide>,

    <AnimatedSlide key="2">
       <GradientCircleLights />
       <div className="text-xl md:text-3xl text-zinc-700 font-medium max-w-4xl leading-relaxed text-balance">
         <FlowText text="Behind every title here is a light — someone figuring things out, building something on the side, or simply trying to do meaningful work with people they connect with." />
       </div>
    </AnimatedSlide>,

    <AnimatedSlide key="3">
       <div className="text-2xl md:text-4xl text-zinc-700 font-medium max-w-3xl leading-relaxed">
         <FlowText text="This is where Project X" />
         <motion.span
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 1.2, duration: 0.8 }}
           className="text-transparent bg-clip-text bg-gradient-to-r from-[#17CAFA] to-[#0E56FA] font-medium mt-2 block"
         >
           hits a little different.
         </motion.span>
       </div>
    </AnimatedSlide>,

    <AnimatedSlide key="4">
       {/* Ambient cyan glow */}
       <motion.div 
          animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-[#17CAFA]/10 blur-[120px] rounded-full pointer-events-none -z-10"
       />
       <div className="text-3xl md:text-5xl text-zinc-900 font-medium max-w-4xl leading-tight relative z-10">
         <FlowText text="So go ahead —" />
         <br />
         <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.8, duration: 1 }}
           className="text-[#17CAFA] mt-4 block"
         >
           <FlowText text="follow the lights, open profiles, and see where they lead." />
         </motion.div>
       </div>
    </AnimatedSlide>,

    <AnimatedSlide key="5">
       <div className="text-2xl md:text-4xl text-zinc-600 font-medium max-w-3xl leading-relaxed space-y-4 flex flex-col items-center">
         <FlowText text="You might find a co-founder." />
         <FlowText text="You might find a friend." />
         <motion.span
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 1.5, duration: 0.8 }}
           className="text-zinc-900 font-medium mt-4 block"
         >
           You might just find someone who gets it.
         </motion.span>
       </div>
    </AnimatedSlide>,

    <AnimatedSlide key="6">
       {/* Softer, more elegant blinking glow */}
       <motion.div 
          animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[1000px] h-[500px] bg-gradient-to-b from-[#17CAFA]/10 via-[#0E56FA]/5 to-transparent blur-[140px] rounded-[100%] pointer-events-none -z-10"
       />

       <h2 className={`${jakarta.className} text-5xl md:text-7xl lg:text-9xl font-semibold tracking-tighter leading-none mb-16 relative z-10`}>
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
         className="group relative inline-flex items-center justify-center px-10 py-5 bg-white border border-[#0E56FA]/30 text-[#0E56FA] font-medium rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_-5px_#0E56FA] focus:outline-none focus:ring-4 focus:ring-[#0E56FA]/50"
       >
         <div className="absolute inset-0 bg-gradient-to-r from-[#0E56FA] to-[#17CAFA] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
         <span className="relative z-10 text-lg tracking-wide group-hover:text-white transition-colors duration-300">Explore xOS</span>
       </a>

       <div className="mt-24 max-w-2xl border-l-2 border-[#17CAFA]/30 pl-8 text-left relative">
         <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-32 h-32 bg-[#17CAFA]/10 blur-3xl rounded-full z-0 pointer-events-none" />
         <p className="relative z-10 text-lg md:text-xl text-zinc-600 font-medium italic leading-relaxed">
           "Surround yourself with people who challenge you, teach you, and push
           you to be your best self."
         </p>
         <p
           className={`${jakarta.className} relative z-10 mt-6 text-sm font-medium text-zinc-500 uppercase tracking-widest`}
         >
           — Bill Gates
         </p>
       </div>
    </AnimatedSlide>
  ];

  return (
    <main className="bg-white text-zinc-900 h-[100dvh] w-full selection:bg-[#0E56FA] selection:text-white font-sans relative overflow-hidden flex items-center justify-center">
      
      <motion.div
        animate={{ opacity: hasInteracted ? 0 : 0.6 }}
        transition={{ duration: 1 }}
        className="fixed top-8 right-8 z-[100] text-sm text-zinc-500 pointer-events-none tracking-widest"
      >
        Click anywhere / Press Arrow Keys
      </motion.div>

      {/* Navigation Arrows */}
      <AnimatePresence>
        {currentStep > 0 && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={prevStep}
            className="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 z-[100] p-4 flex items-center justify-center text-[#0A369D] hover:text-[#0E56FA] opacity-70 hover:opacity-100 transition-all group"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-8 h-8 md:w-12 md:h-12 group-hover:-translate-x-2 transition-transform duration-300" strokeWidth={1.5} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {currentStep < totalSteps - 1 && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onClick={nextStep}
            className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-[100] p-4 flex items-center justify-center text-[#0A369D] hover:text-[#0E56FA] opacity-70 hover:opacity-100 transition-all group"
            aria-label="Next slide"
          >
            <ChevronRight className="w-8 h-8 md:w-12 md:h-12 group-hover:translate-x-2 transition-transform duration-300" strokeWidth={1.5} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Progress tracking dots */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3">
         {slides.map((_, i) => (
            <button 
              key={i}
              onClick={() => setCurrentStep(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === currentStep ? "bg-[#0E56FA] scale-125" : "bg-zinc-300 hover:bg-zinc-400"}`}
              aria-label={`Go to slide ${i + 1}`}
            />
         ))}
      </div>

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
        className="w-full h-full relative"
      >
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-[#0E56FA]/15 to-transparent blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-tl from-[#17CAFA]/15 to-transparent blur-[120px]" />
          <div className="absolute top-[40%] left-[30%] w-[60vw] h-[20vw] rounded-[100%] bg-[#0E56FA]/10 blur-[150px] -rotate-45" />
        </div>

        <AnimatePresence mode="wait">
          {slides[currentStep]}
        </AnimatePresence>
      </motion.div>

      {showLogo && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center justify-center gap-2 md:gap-4"
          >
            <div className="text-4xl md:text-6xl font-bold tracking-tight text-[#0E56FA]" style={{ fontFamily: "var(--font-sans), 'Plus Jakarta Sans', sans-serif" }}>
              Project
            </div>
            <svg 
              className="w-32 h-32 md:w-48 md:h-48"
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
          </motion.div>
        </motion.div>
      )}
      <AmbientAudio isExiting={isExiting} />
    </main>
  );
}
