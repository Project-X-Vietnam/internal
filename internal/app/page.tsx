"use client";

import { useState, useEffect, useCallback, startTransition } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { fireCornerConfetti } from "@/lib/confetti.utils";
import IntroAnimation from "@/components/IntroAnimation";
import { Typewriter } from "@/components/ui/typewriter-text";
import Timeline from "@/components/ui/timeline-component";
import { ProductCard } from "@/components/ui/cards-1";
import { GridPattern } from "@/components/ui/grid-pattern";
import { cn } from "@/lib/utils";

const WelcomeMessage = ({ onComplete }: { onComplete: () => void }) => {
  // Automatically transition after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 5000); // Increased to 5s to accommodate the new delay

    return () => clearTimeout(timer);
  }, [onComplete]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        // No staggerChildren, we control timing manually
      },
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
        delay: 2, // 2-second delay after the component appears
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
          className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-foreground tracking-tight"
          variants={titleVariants}
        >
          Thank you for choosing to be a part of <span className="text-gradient-animated">Project X 2026 Team</span>.
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl text-muted-foreground font-medium"
          variants={subtitleVariants}
        >
          We’re genuinely glad you’re here.
        </motion.p>
      </div>
    </motion.div>
  );
};

const InteractiveQuestion = ({ onComplete }: { onComplete: () => void }) => {
  const [thoughts, setThoughts] = useState("");

  const handleSubmit = () => {
    // Navigate immediately for better UX
    onComplete();

    // Fire-and-forget submission to Google Sheets
    // This runs in the background while the user moves to the next screen
    const submitData = async () => {
      // Updated URL from your latest deployment
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
      transition: {
        // No stagger, we control timing manually in children
      },
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
        delay: 1.0, // 1s delay before "Before we move forward"
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
        delay: 1.5, // Fade in container slightly before typing starts
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
        delay: 5, // Reduced delay to appear right after typing
        duration: 0.4, // Faster fade-in
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
            className="text-primary text-sm md:text-base font-bold uppercase tracking-widest mb-6"
            variants={labelVariants}
          >
            Before we move forward…
          </motion.p>
          <motion.div 
            className="text-3xl md:text-5xl font-bold leading-tight text-foreground"
            variants={questionVariants}
          >
            <Typewriter
              text="How are you feeling about this upcoming path?"
              delay={1500}
              speed={80}
            />
          </motion.div>
        </div>
        <motion.div
          className="w-full max-w-xl mx-auto text-center"
          variants={inputVariants}
        >
          <textarea
            rows={3}
            className="w-full p-6 text-lg text-foreground bg-slate-50/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl resize-none placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all shadow-sm hover:shadow-md"
            placeholder="Share your thoughts with us..."
            value={thoughts}
            onChange={(e) => setThoughts(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            className="btn btn-primary px-10 py-4 mt-8 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl hover:translate-y-[-2px] hover:scale-105 transition-all duration-300"
          >
            Continue →
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Full logo with "Project X" text
function Logo({ className = "h-8", variant = "full" }: { className?: string; variant?: "full" | "icon" }) {
  if (variant === "icon") {
    return (
      <Image
        src="/favicon.svg"
        alt="Project X"
        width={32}
        height={32}
        className={className}
      />
    );
  }
  
  return (
    <Image
      src="/preview_icon.png"
      alt="Project X Vietnam"
      width={200}
      height={50}
      className={className}
      priority
    />
  );
}

export default function Home() {
  const [isDark, setIsDark] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showInteractiveQuestion, setShowInteractiveQuestion] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showMemberHubPopup, setShowMemberHubPopup] = useState(false);

  const openMemberHubPopup = () => setShowMemberHubPopup(true);
  const closeMemberHubPopup = () => setShowMemberHubPopup(false);


  // Check if intro should be shown (once per session)
  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem("pxv-intro-seen");
    if (hasSeenIntro) {
      startTransition(() => {
        setShowIntro(false);
        setIsLoaded(true);
        // Fire confetti immediately if intro is skipped
        setTimeout(() => {
          fireCornerConfetti();
        }, 500);
      });
    }
  }, []);

  // Theme detection
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      startTransition(() => {
        setIsDark(true);
      });
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
    setIsLoaded(true);
    // Fire confetti after intro completes
    setTimeout(() => {
      fireCornerConfetti();
    }, 500);
  }, []);

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

  const toggleTheme = () => {
    setIsDark((prev) => {
      const newValue = !prev;
      localStorage.setItem("theme", newValue ? "dark" : "light");
      return newValue;
    });
  };

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


      {/* Main Content */}
      <motion.div 
        className="min-h-screen transition-colors duration-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-colors duration-500 ${
          isDark
            ? "bg-[#020818]/80 border-white/10"
            : "bg-white/70 border-slate-100/50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="group">
            <Logo className="h-12 w-auto transition-transform group-hover:scale-[1.02]" />
          </Link>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className={`text-sm font-medium transition-colors ${
                isDark ? "text-white/60 hover:text-primary" : "text-slate-600 hover:text-primary"
              }`}
            >
              About
            </a>
            <a
              href="#"
              className={`text-sm font-medium transition-colors ${
                isDark ? "text-white/60 hover:text-primary" : "text-slate-600 hover:text-primary"
              }`}
            >
              Programs
            </a>
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? "bg-white/10 hover:bg-primary/20 text-white"
                  : "bg-slate-100 hover:bg-primary/10 text-slate-600"
              }`}
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <button className="btn btn-primary px-6 py-2.5 text-sm">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className={`min-h-screen pt-32 md:pt-40 pb-20 relative overflow-hidden ${
          isDark ? "bg-[#020818]" : "bg-gradient-hero-light"
        }`}
      >
        {/* Background Decorations */}
        {isDark && (
          <>
            <div className="absolute inset-0 bg-gradient-hero-dark" />
            <motion.div
              className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl bg-primary/20"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl bg-pxv-cyan/20"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
            />
          </>
        )}

        <div className="max-w-6xl mx-auto px-6 md:px-8 relative z-10">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <span
              className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border backdrop-blur-sm ${
                isDark
                  ? "bg-primary/10 border-primary/30"
                  : "bg-gradient-to-r from-primary/5 via-pxv-cyan/5 to-primary/5 border-primary/15"
              }`}
            >
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-sm font-medium text-primary">Now Accepting Applications</span>
            </span>
          </motion.div>

          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className={`heading-hero mb-6 ${isDark ? "text-white" : "text-pxv-dark"}`}>
              <span>Building the Future of </span>
              <span className="text-gradient-animated">Vietnam Tech Ecosystem.</span>
            </h1>
            <p className={`body-large max-w-2xl mx-auto mb-10 ${isDark ? "text-white/60" : "text-slate-600"}`}>
              You now become member of a community of innovators, entrepreneurs, and tech leaders shaping the next generation of Vietnamese startups and digital transformation.
            </p>

            {/* CTA Buttons - Removed */}
          </motion.div>        </div>
       </section>

      {/* Founder's Message Section */}
      <section className={`py-20 md:py-28 ${isDark ? "bg-[#0A0F1A]" : "bg-slate-50"}`}>
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            className="grid md:grid-cols-5 gap-12 md:gap-16 items-center"
          >
            <div className="md:col-span-2 relative aspect-square md:aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/assets/liam-lee.png"
                alt="Liam Lee, President of Project X Vietnam"
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
            <div className="md:col-span-3 text-left">
              <h2 className={`heading-section mb-6 ${isDark ? "text-white" : "text-pxv-dark"}`}>
                A Message from Our President
              </h2>
              <div className={`prose prose-lg max-w-none ${isDark ? "prose-invert" : ""} text-base md:text-lg text-justify`}>
                <p>
                  Welcome to the next chapter of your journey. At Project X, we're not just building projects; we're building people. We believe in the power of Vietnamese talent to shape the future of technology, and we're thrilled to have you with us.
                </p>
                <p>
                  This is a place for you to be bold, to experiment, and to grow. We provide the challenges and the support system; you bring the passion and the drive. Together, we will create a lasting impact on Vietnam's tech ecosystem and beyond.
                </p>
              </div>
              <div className="mt-8">
                <p className={`font-bold text-lg ${isDark ? "text-white" : "text-pxv-dark"}`}>Liam Lee</p>
                <p className={`${isDark ? "text-white/60" : "text-slate-500"}`}>President, Project X Vietnam</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PJX MTP Timeline Section */}
      <section className={`py-20 md:py-28 ${isDark ? "bg-[#020818]" : "bg-white"}`}>
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.5 }}
            className="text-center mb-8"
          >
            <h2 className="section-label mb-4">PJX MTP</h2>
            <h3 className={`heading-section ${isDark ? "text-white" : "text-pxv-dark"}`}>Our Journey</h3>
          </motion.div>

          <Timeline
            items={[
              {
                date: "Jan 17",
                title: "1st All-hands Meeting",
                description: "Kick off the year by aligning on our vision, goals, and roadmap for the upcoming season."
              },
              {
                date: "Jan 18 - Jan 28",
                title: "Department Meeting & Training",
                description: "Deep dive into specialized training sessions and departmental planning to prepare for execution."
              },
              {
                date: "Feb 19 - Mar 13",
                title: "Summer Fellowship Program Recruitment",
                description: "Launch our nationwide search for the most promising young talents to join the Summer Fellowship."
              },
              {
                date: "Mar 20 - Mar 22",
                title: "SFP Round 1 Activities",
                description: "Engage candidates in initial challenges to assess their potential and cultural fit."
              },
              {
                date: "Apr 4 - Apr 11",
                title: "SFP Round 2 Activities",
                description: "Conduct in-depth assessments and group activities to identify the top performers."
              },
              {
                date: "Jun 12 - Jun 27",
                title: "SFP Application & Interview",
                description: "Finalize the selection process with comprehensive interviews for shortlisted candidates."
              },
              {
                date: "Jul 1",
                title: "Fellow Final List",
                description: "Announce the official cohort of Summer Fellows who will embark on this transformative journey."
              },
              {
                date: "Jul 9 - Aug 22",
                title: "Summer Fellowship Program",
                description: "Execute the core 6-week intensive program focused on innovation, leadership, and impact."
              },
            ]}
          />
        </div>
      </section>

    {/* Member Journey Section */}
    <section className={`py-20 md:py-28 ${isDark ? "bg-[#0A0F1A]" : "bg-slate-50"}`}>
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="section-label mb-4">Member Journey</h2>
          <h3 className={`heading-section ${isDark ? "text-white" : "text-pxv-dark"}`}>
            How You’ll Grow With Us
          </h3>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Finding your footing",
              category: "Phase 1",
              description: "Observing, asking questions, and learning how things work.",
              image: "/assets/pjx5.jpg",
              href: "#"
            },
            {
              title: "Trying & learning",
              category: "Phase 2",
              description: "Taking small ownership, making mistakes, and getting feedback.",
              image: "/assets/pjx6.jpg",
              href: "#"
            },
            {
              title: "Contributing with confidence",
              category: "Phase 3",
              description: "Owning parts of the work, helping others, and seeing your impact.",
              image: "/assets/pjx7.jpg",
              href: "#"
            },
          ].map((phase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.15 }}
              viewport={{ once: true, amount: 0.5 }}
              className="h-full"
            >
              <ProductCard
                imageUrl={phase.image}
                title={phase.title}
                category={phase.category}
                description={phase.description}
                href={phase.href}
                className="h-full"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>

     {/* Working Culture Section */}
      <section className="py-20 md:py-28 bg-white dark:bg-[#020818] transition-colors duration-500">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="section-label mb-4">Working Culture</h2>
            <h3 className="heading-section text-pxv-dark dark:text-white transition-colors duration-500">
              What We Value
            </h3>
          </motion.div>

    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        {
          title: "Eager to learn",
          category: "Growth Mindset",
          description: "We do fast and learn hard",
          image: "/assets/pjx1.jpg",
          href: "#"
        },
        {
          title: "Innovative",
          category: "Creativity",
          description: "We are not settle for mediocre",
          image: "/assets/pjx2.jpg",
          href: "#"
        },
        {
          title: "Supportive",
          category: "Teamwork",
          description: "We hustle but together",
          image: "/assets/pjx3.jpg",
          href: "#"
        },
        {
          title: "Resilient",
          category: "Perseverance",
          description: "We push it through chaos",
          image: "/assets/pjx4.jpg",
          href: "#"
        },
      ].map((value, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <ProductCard
            imageUrl={value.image}
            title={value.title}
            category={value.category}
            description={value.description}
            href={value.href}
            className="h-full"
          />
        </motion.div>
      ))}
    </div>
  </div>
</section>

     {/* Ready Section */}
<section className={`py-20 ${isDark ? "bg-[#0A0F1A]" : "bg-slate-50"}`}>
  <div className="container mx-auto px-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, amount: 0.5 }}
      className="text-center mb-8"
    >
      <h2 className="text-3xl font-bold">
        Right now, how do you feel about starting this journey?
      </h2>
    </motion.div>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      viewport={{ once: true, amount: 0.5 }}
      className="flex justify-center gap-4"
    >
      <button
        className="btn btn-primary px-8 py-3 text-base"
        onClick={openMemberHubPopup}
      >
        I’m ready
      </button>
      <button
        className="btn btn-outline px-8 py-3 text-base"
        onClick={openMemberHubPopup}
      >
        I’m super ready
      </button>
    </motion.div>
  </div>
</section>

{/* Member Hub Popup */}
<AnimatePresence>
  {showMemberHubPopup && (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={closeMemberHubPopup}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`relative p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center ${
          isDark ? "bg-[#0A0F1A] border border-white/10" : "bg-white"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          className={`text-2xl font-bold mb-4 ${
            isDark ? "text-white" : "text-pxv-dark"
          }`}
        >
          Filling here to join our family
        </h3>
        <a
          href="https://docs.google.com/spreadsheets/d/1kImFje3miKjdJnlpRIleFkO_4hZRXszvVK1OkoDScEk/edit?gid=0#gid=0"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary px-8 py-3 text-base w-full inline-block"
        >
          Member Info Hub
        </a>
        <button
          onClick={closeMemberHubPopup}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
            isDark
              ? "text-white/50 hover:bg-white/10"
              : "text-slate-500 hover:bg-slate-100"
          }`}
          aria-label="Close popup"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </motion.div>
    </div>
  )}
</AnimatePresence>

      {/* Footer */}
      <footer className={`py-12 border-t ${isDark ? "bg-[#020818] border-white/10" : "bg-white border-slate-100"}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <Logo className="h-12 w-auto mb-4" />
              <p className={`text-sm ${isDark ? "text-white/50" : "text-slate-500"}`}>
                Building the future of Vietnam's Tech Ecosystem.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:col-span-3">
              <div>
                <h3 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-slate-800"}`}>About</h3>
                <ul className="space-y-3">
                  <li><a href="#" className={`text-sm ${isDark ? "text-white/60 hover:text-primary" : "text-slate-600 hover:text-primary"}`}>Our Mission</a></li>
                  <li><a href="#" className={`text-sm ${isDark ? "text-white/60 hover:text-primary" : "text-slate-600 hover:text-primary"}`}>Team</a></li>
                  <li><a href="#" className={`text-sm ${isDark ? "text-white/60 hover:text-primary" : "text-slate-600 hover:text-primary"}`}>Careers</a></li>
                </ul>
              </div>
              <div>
                <h3 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-slate-800"}`}>Programs</h3>
                <ul className="space-y-3">
                  <li><a href="#" className={`text-sm ${isDark ? "text-white/60 hover:text-primary" : "text-slate-600 hover:text-primary"}`}>Fellowship</a></li>
                  <li><a href="#" className={`text-sm ${isDark ? "text-white/60 hover:text-primary" : "text-slate-600 hover:text-primary"}`}>Workshops</a></li>
                  <li><a href="#" className={`text-sm ${isDark ? "text-white/60 hover:text-primary" : "text-slate-600 hover:text-primary"}`}>Community</a></li>
                </ul>
              </div>
              <div>
                <h3 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-slate-800"}`}>Connect</h3>
                <ul className="space-y-3">
                  <li><a href="#" className={`text-sm ${isDark ? "text-white/60 hover:text-primary" : "text-slate-600 hover:text-primary"}`}>Facebook</a></li>
                  <li><a href="#" className={`text-sm ${isDark ? "text-white/60 hover:text-primary" : "text-slate-600 hover:text-primary"}`}>LinkedIn</a></li>
                  <li><a href="#" className={`text-sm ${isDark ? "text-white/60 hover:text-primary" : "text-slate-600 hover:text-primary"}`}>Contact Us</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className={`mt-8 pt-8 border-t ${isDark ? "border-white/10" : "border-slate-100"} text-center text-sm ${isDark ? "text-white/40" : "text-slate-400"}`}>
            © {new Date().getFullYear()} Project X Vietnam. All rights reserved.
          </div>
        </div>
      </footer>
      </motion.div>
    </div>
  );
}
