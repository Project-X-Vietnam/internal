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
import { AuroraBackground } from "@/components/ui/aurora-background";
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
          className="text-4xl md:text-3xl lg:text-6xl font-bold leading-tight mb-6 text-foreground tracking-tight"
          variants={titleVariants}
        >
          Thank you for choosing to be a part of <span className="text-gradient-animated">Project X 2026 Team</span>
        </motion.h1>
        <motion.p
          className="text-xl md:text-xl text-muted-foreground font-medium"
          variants={subtitleVariants}
        >
          We’re genuinely glad you’re here
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
}

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
  const [showThankYouPopup, setShowThankYouPopup] = useState(false);

  const openMemberHubPopup = () => setShowMemberHubPopup(true);
  const closeMemberHubPopup = () => setShowMemberHubPopup(false);
  const closeThankYouPopup = () => setShowThankYouPopup(false);

  const handleMemberHubFinish = () => {
    setShowMemberHubPopup(false);
    setShowThankYouPopup(true);
    fireCornerConfetti();
  };


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

      {/* Hero Section */}
      <AuroraBackground className="min-h-screen pt-32 md:pt-40 pb-20 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 md:px-8 relative z-10">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className={`heading-hero mb-6 ${isDark ? "text-white" : "text-pxv-dark"}`}>
              <span>Building the Future of </span>
              <span className="text-gradient-animated">Vietnam Tech Ecosystem</span>
            </h1>
            <p className={`body-large max-w-2xl mx-auto mb-10 ${isDark ? "text-white/60" : "text-slate-600"}`}>
              You now become member of a community of innovators, entrepreneurs, and tech leaders shaping the next generation of Vietnamese startups and digital transformation.
            </p>

            {/* CTA Buttons - Removed */}
          </motion.div>
        </div>
      </AuroraBackground>

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
          onClick={handleMemberHubFinish}
          className={`btn btn-outline px-8 py-3 text-base w-full mt-4 ${
            isDark
              ? "border-white/20 text-white hover:bg-white/10"
              : "border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          I have finished
        </button>
      </motion.div>
    </div>
  )}
</AnimatePresence>

{/* Thank You Popup */}
<AnimatePresence>
  {showThankYouPopup && (
    <div
      className="fixed inset-0 flex items-start justify-center pt-20 bg-black/60 backdrop-blur-sm"

      onClick={closeThankYouPopup}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
        className={`relative p-6 md:p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center overflow-hidden ${
          isDark ? "bg-[#0A0F1A] border border-white/10" : "bg-white"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background decorative elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pxv-cyan/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
          className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-tr from-primary to-pxv-cyan flex items-center justify-center text-white shadow-lg shadow-primary/20 ring-4 ring-white dark:ring-white/5"
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>

        <h3 className={`text-3xl font-bold mb-6 tracking-tight leading-tight ${isDark ? "text-white" : "text-pxv-dark"}`}>
          <span className="text-gradient-animated">
            Lets build and grind together!
          </span>
        </h3>

        <div className="space-y-4">
          <div className={`p-1 rounded-2xl bg-gradient-to-br from-primary/20 via-pxv-cyan/20 to-primary/20`}>
            <div className={`p-4 rounded-xl backdrop-blur-sm ${isDark ? "bg-black/40" : "bg-white/60"}`}>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                Made with ❤️ by Ops Team
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${isDark ? "bg-white/10" : "bg-slate-100"}`}>
                    <span className="text-lg">G</span>
                  </div>
                  <span className={`text-sm font-medium ${isDark ? "text-white" : "text-pxv-dark"}`}>Giangle</span>
                </div>
                <div className={`h-8 w-px ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${isDark ? "bg-white/10" : "bg-slate-100"}`}>
                    <span className="text-lg">M</span>
                  </div>
                  <span className={`text-sm font-medium ${isDark ? "text-white" : "text-pxv-dark"}`}>Minhthu</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <p className={`text-sm leading-relaxed ${isDark ? "text-white/70" : "text-slate-600"}`}>
              Want to learn more about our mission?
              <a 
                href="https://www.projectxvietnam.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block mt-1 font-medium text-primary hover:text-primary/80 hover:underline transition-all"
              >
                projectxvietnam.org
              </a>
            </p>
          </div>
        </div>

        <button
          onClick={closeThankYouPopup}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
            isDark
              ? "text-white/30 hover:bg-white/10 hover:text-white"
              : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          }`}
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </motion.div>
    </div>
  )}
</AnimatePresence>

      </motion.div>
    </div>
  );
}
