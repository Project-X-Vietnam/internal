"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import IntroAnimation from "@/components/IntroAnimation";
import { Typewriter } from "@/components/ui/typewriter-text";
import { GridPattern } from "@/components/ui/grid-pattern";
import { cn } from "@/lib/utils";

const WelcomeMessage = ({ onComplete }: { onComplete: () => void }) => {
  // Automatically transition after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {},
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.5 }
    }
  };

  const titleVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };

  const subtitleVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 2,
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden pointer-events-none"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
        <motion.h1
          className="text-4xl md:text-3xl lg:text-6xl font-bold leading-tight mb-6 text-foreground tracking-tight"
          variants={titleVariants}
        >
          Thank you for choosing to be a part of <span className="text-gradient-animated">Project X 2026 Team</span>
        </motion.h1>
        <motion.p
          className="text-xl md:text-xl text-muted-foreground font-medium"
          variants={subtitleVariants}
        >
          We're genuinely glad you're here
        </motion.p>
      </div>
    </motion.div>
  );
};

const InteractiveQuestion = ({ onComplete }: { onComplete: () => void }) => {
  const [thoughts, setThoughts] = useState("");
  const [showSecondPart, setShowSecondPart] = useState(false);

  const handleSubmit = () => {
    // Navigate immediately for better UX
    onComplete();

    // Fire-and-forget submission to Google Sheets
    const submitData = async () => {
      const scriptURL =
        "https://script.google.com/macros/s/AKfycbxw_Qo_PFjq5S5uPImbhncQ4rVLoCU2LQE3_qRLsnbOo-Pha324w-AWnXRRbJIVfIvS/exec";

      const formData = new FormData();
      formData.append("thoughts", thoughts);

      console.log("Submitting to Google Sheets (background)...", { thoughts });

      try {
        await fetch(scriptURL, {
          method: "POST",
          body: formData,
          mode: "no-cors",
        });
        console.log("Submission sent (opaque response expected)");
      } catch (error) {
        console.error("Error submitting to Google Sheet:", error);
      }
    };

    submitData();
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {},
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.5 }
    }
  };

  const labelVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 1.0,
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };

  const questionVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 1.5,
        duration: 0.5,
      }
    }
  };

  const inputVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 5,
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
        <div className="mb-10">
          <motion.p 
            className="text-primary text-xl md:text-xl text-muted-foreground font-medium tracking-widest mb-6"
            variants={labelVariants}
          >
            Before we move forward…
          </motion.p>

          <motion.div 
            className="text-3xl md:text-5xl font-bold leading-tight text-foreground max-w-3xl mx-auto"
            variants={questionVariants}
          >
            <Typewriter
              text="How are you feeling about this "
              delay={1500}
              speed={80}
              cursor=""
              onFinished={() => setShowSecondPart(true)}
              hideCursorOnFinish={true}
            />
            {showSecondPart && (
              <span className="text-gradient-animated">
                <Typewriter
                  text="upcoming path?"
                  delay={0}
                  speed={80}
                  cursor="|"
                />
              </span>
            )}
          </motion.div>
        </div>
        <motion.div
          className="w-full max-w-xl mx-auto text-center"
          variants={inputVariants}
        >
          <textarea
            rows={3}
            className="w-full p-6 text-lg text-foreground bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl resize-none placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all shadow-sm hover:shadow-md"
            placeholder="Share your thoughts with us..."
            value={thoughts}
            onChange={(e) => setThoughts(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            disabled={!thoughts.trim()}
            className={`px-10 py-4 mt-8 text-lg font-semibold rounded-full transition-all duration-300 ${
              thoughts.trim()
                ? "bg-white text-slate-900 shadow-lg hover:shadow-xl hover:translate-y-[-2px] hover:scale-105 cursor-pointer"
                : "bg-white/50 text-slate-400 cursor-not-allowed"
            }`}
          >
            Continue →
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function Home() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showInteractiveQuestion, setShowInteractiveQuestion] = useState(false);

  // Check if user has already completed intro - redirect to /welcome
  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem("pxv-intro-seen");
    if (hasSeenIntro) {
      router.replace("/welcome");
    }
  }, [router]);

  // Theme detection
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
    }
  }, []);

  // Handle intro completion
  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
    setShowWelcome(true);
  }, []);

  const handleWelcomeComplete = useCallback(() => {
    setShowWelcome(false);
    setShowInteractiveQuestion(true);
  }, []);

  const handleQuestionComplete = useCallback(() => {
    sessionStorage.setItem("pxv-intro-seen", "true");
    setShowInteractiveQuestion(false);
    // Navigate to welcome page
    router.push("/welcome");
  }, [router]);

  // Keyboard shortcut to skip intro
  useEffect(() => {
    if (!showIntro && !showWelcome) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
        e.preventDefault();
        if (showIntro) {
          handleIntroComplete();
        } else if (showWelcome) {
          handleWelcomeComplete();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showIntro, showWelcome, handleIntroComplete, handleWelcomeComplete]);

  return (
    <div className={isDark ? "dark" : ""}>
      {/* Persistent Background Pattern for Intro/Welcome/InteractiveQuestion */}
      <AnimatePresence>
        {(showIntro || showWelcome || showInteractiveQuestion) && (
          <motion.div
            className="fixed inset-0 z-40 overflow-hidden bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <GridPattern
              squares={[
                [4, 4],
                [5, 1],
                [8, 2],
                [5, 3],
                [5, 5],
                [10, 10],
                [12, 15],
                [15, 10],
                [10, 15],
                [15, 10],
                [10, 15],
                [15, 10],
              ]}
              className={cn(
                "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
                "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Intro Animation */}
      <AnimatePresence mode="wait">
        {showIntro && (
          <IntroAnimation onComplete={handleIntroComplete} />
        )}
        {showWelcome && (
          <WelcomeMessage onComplete={handleWelcomeComplete} />
        )}
        {showInteractiveQuestion && (
          <InteractiveQuestion onComplete={handleQuestionComplete} />
        )}
      </AnimatePresence>
    </div>
  );
}
