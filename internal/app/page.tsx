"use client";

import { useState, useEffect, useCallback, startTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { fireCornerConfetti } from "@/lib/confetti.utils";
import IntroAnimation from "@/components/IntroAnimation";

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
  const [isLoaded, setIsLoaded] = useState(false);

  // Check if intro should be shown (once per session)
  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem("pxv-intro-seen");
    if (hasSeenIntro) {
      startTransition(() => {
        setShowIntro(false);
        setIsLoaded(true);
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
    sessionStorage.setItem("pxv-intro-seen", "true");
    setShowIntro(false);
    setIsLoaded(true);
    // Fire confetti after intro completes
    setTimeout(() => {
      fireCornerConfetti();
    }, 500);
  }, []);

  // Keyboard shortcut to skip intro
  useEffect(() => {
    if (!showIntro) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
        e.preventDefault();
        handleIntroComplete();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showIntro, handleIntroComplete]);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const newValue = !prev;
      localStorage.setItem("theme", newValue ? "dark" : "light");
      return newValue;
    });
  };

  return (
    <>
      {/* Intro Animation */}
      <AnimatePresence mode="wait">
        {showIntro && (
          <IntroAnimation onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div 
        className={`min-h-screen transition-colors duration-500 ${isDark ? "dark" : ""}`}
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
              Building the Future of{" "}
              <span className="text-gradient-animated">Vietnam&apos;s Tech</span>{" "}
              Ecosystem
            </h1>
            <p className={`body-large max-w-2xl mx-auto mb-10 ${isDark ? "text-white/60" : "text-slate-600"}`}>
              Join a community of innovators, entrepreneurs, and tech leaders shaping the next generation of Vietnamese startups and digital transformation.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-primary px-8 py-4 text-base group">
                Apply Now
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <button
                className={`btn px-8 py-4 text-base border ${
                  isDark
                    ? "border-white/20 text-white hover:bg-white/10"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`section-padding ${isDark ? "bg-[#0a0f1a]" : "bg-slate-50"}`}>
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <p className="section-label mb-4">What We Offer</p>
            <h2 className={`heading-section ${isDark ? "text-white" : "text-pxv-dark"}`}>
              Comprehensive Support for Your Journey
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                ),
                title: "Mentorship",
                description: "Connect with industry leaders and experienced entrepreneurs who guide your growth.",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: "Community",
                description: "Join a vibrant network of like-minded individuals passionate about innovation.",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Resources",
                description: "Access exclusive tools, workshops, and resources to accelerate your success.",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group p-6 rounded-xl text-center transition-all duration-300 ${
                  isDark
                    ? "bg-white/5 hover:bg-white/10 border border-white/10"
                    : "bg-white hover:bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110 ${
                    isDark ? "bg-primary/20 text-primary" : "bg-primary/10 text-primary"
                  }`}
                >
                  {feature.icon}
                </div>
                <h3 className={`font-semibold text-lg mb-2 ${isDark ? "text-white" : "text-pxv-dark"}`}>
                  {feature.title}
                </h3>
                <p className={`text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`section-padding ${isDark ? "bg-[#020818]" : "bg-white"}`}>
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "500+", label: "Members" },
              { value: "50+", label: "Mentors" },
              { value: "100+", label: "Events" },
              { value: "$2M+", label: "Funding Raised" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                  {stat.value}
                </div>
                <div className={`text-sm font-medium ${isDark ? "text-white/60" : "text-slate-600"}`}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-cta py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial-primary opacity-50" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-6 md:px-8 text-center relative z-10"
        >
          <h2 className="heading-section text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="body-large text-white/70 mb-10 max-w-2xl mx-auto">
            Join Project X Vietnam today and become part of a community that&apos;s shaping the future of technology in Vietnam.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn bg-white text-primary hover:bg-white/90 px-8 py-4 text-base font-semibold group">
              Apply Now
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <button className="btn border border-white/30 text-white hover:bg-white/10 px-8 py-4 text-base">
              Contact Us
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className={`py-12 border-t ${isDark ? "bg-[#020818] border-white/10" : "bg-white border-slate-100"}`}>
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link href="/" className="block">
              <Logo className="h-10 w-auto" />
            </Link>
            <p className={`text-sm ${isDark ? "text-white/40" : "text-slate-400"}`}>
              © 2025 Project X Vietnam. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                aria-label="LinkedIn"
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? "bg-white/10 hover:bg-primary/20 text-white/60 hover:text-primary"
                    : "bg-slate-100 hover:bg-primary/10 text-slate-500 hover:text-primary"
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
          </a>
          <a
                href="mailto:info.projectxvietnam@gmail.com"
                aria-label="Email"
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? "bg-white/10 hover:bg-primary/20 text-white/60 hover:text-primary"
                    : "bg-slate-100 hover:bg-primary/10 text-slate-500 hover:text-primary"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
      </motion.div>
    </>
  );
}
