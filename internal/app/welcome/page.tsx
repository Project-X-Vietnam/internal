"use client";

import { useState, useEffect, startTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { fireCornerConfetti } from "@/lib/confetti.utils";
import Timeline from "@/components/ui/timeline-component";
import { ProductCard } from "@/components/ui/cards-1";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Highlight } from "@/components/ui/hero-highlight";
import HeroVideoDialog from "@/components/ui/hero-video-dialog";

export default function WelcomePage() {
  const [isDark, setIsDark] = useState(false);
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

  // Fire confetti on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      fireCornerConfetti();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={isDark ? "dark" : ""}>
      {/* Main Content */}
      <motion.div 
        className="min-h-screen transition-colors duration-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
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
            <p className={`body-large max-w-3xl mx-auto mb-10 ${isDark ? "text-white/60" : "text-slate-600"}`}>
              You now become member of a <Highlight className="ml-1 mr-1">community of innovators, entrepreneurs, and tech leaders</Highlight> shaping the next generation of Vietnamese startups and digital transformation.
            </p>
          </motion.div>
        </div>
      </AuroraBackground>

      {/* Founder's Message Section */}
      <section className={`py-20 md:py-28 ${isDark ? "bg-[#0A0F1A]" : "bg-slate-50"}`}>
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center"
          >
            <h2 className="section-label mb-4 text-[#0E56FA]">
              From Our President
            </h2>
            <h3 className={`heading-section mb-8 ${isDark ? "text-white" : "text-pxv-dark"}`}>
              To the next generation of Project X
            </h3>

            <div className={`font-display prose prose-lg max-w-none ${isDark ? "prose-invert" : ""} text-base md:text-lg text-justify mb-8 space-y-4`}>
              <p>
                Hi everyone,
              </p>
              <p>
                I'm <strong>Liam Lee</strong>, President of Project X Vietnam. I'm excited to have you with us this year.
              </p>
              <div className="relative my-6 pl-5 pr-5 py-4 border-l-4 border-primary/70 bg-primary/5 dark:bg-primary/10 rounded-r-lg">
                <p className="mb-3">
                  Through years of participating, working, and learning across different organizations like Project X Vietnam, I've come to believe that <strong>the first touchpoint in any journey is one of the most important moments</strong> you'll experience.
                </p>
                <p className="mb-0 text-slate-600 dark:text-slate-300">
                  It's the moment where you start forming beliefs about the community you've entered. It's where you begin to sense whether this is a place you can <em>trust</em>, whether you can <em>speak honestly</em>, whether your <em>effort will matter</em>, and whether <em>growth is actually possible</em> here.
                </p>
              </div>
              <p>
                That's why our core team wanted to make this onboarding moment <strong>intentional</strong>. We didn't want it to feel transactional, rushed, or purely informational. As a tech organization, we believe technology should not only scale processes — but also <strong>create meaning, reflection, and connection</strong>.
              </p>
              <p>
                <em><strong>This page, and this message, are part of that intention.</strong></em>
              </p>
              <p>
                Before going further, I invite you to watch a short video - <em>one of my favorite</em>.
              </p>
              <p>
                It's a short but powerful snippet from <em>someone</em> whose journey has fueled my passion for technology — and strengthened my belief in <strong>the incredible potential of young people</strong>.
              </p>
            </div>

            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl mb-10">
              <HeroVideoDialog
                className="block dark:hidden"
                animationStyle="from-center"
                videoSrc="https://www.youtube.com/embed/QYAnJ_QyCQg?si=xiNp_U9FpHsoYnyG"
                thumbnailSrc="/assets/thumbnail.png"
                thumbnailAlt="Hero Video"
              />
              <HeroVideoDialog
                className="hidden dark:block"
                animationStyle="from-center"
                videoSrc="https://www.youtube.com/embed/QYAnJ_QyCQg?si=xiNp_U9FpHsoYnyG"
                thumbnailSrc="/assets/thumbnail.png"
                thumbnailAlt="Hero Video"
              />
            </div>

            <div className={`font-display prose prose-lg max-w-none ${isDark ? "prose-invert" : ""} text-base md:text-lg text-justify space-y-4`}>
              <p>
                Yes, the "someone" in the video is none other than <strong>Steve Jobs</strong> — a remarkable innovator who went beyond pure science to bring human-centered, accessible technology to the world. His work didn't just create products; it inspired <em>ambition</em>, <em>curiosity</em>, and <em>belief</em>.
              </p>
              <p>
                Many people we know today — Elon Musk, Mark Zuckerberg, Jeff Bezos — once found their spark in Steve's ideas.
              </p>
              <p>
                After watching the video, some of you may feel an immediate resonance, perhaps seeing parts of yourself reflected in it. And if you don't, <strong>that's completely okay</strong>. Not everyone experiences clarity at the same time. For many people, meaning doesn't arrive in a single moment — it unfolds slowly, through experience, failure, and reflection. That gradual discovery is what makes the idea of <em>"life"</em> feel deep and personal.
              </p>
              <div className="py-6 flex items-center gap-4">
                <div className="flex-1 h-px bg-slate-300 dark:bg-white/10"></div>
                <span className="text-slate-400 dark:text-slate-500 text-sm font-medium">Brief journey of my own</span>
                <div className="flex-1 h-px bg-slate-300 dark:bg-white/10"></div>
              </div>
              <p>
                For a long time, <strong>I believed that technology was for "special people."</strong>
              </p>
              <p>
                I admired it. I talked about it. I followed trends and ideas. But I didn't truly build anything, because deep down, I believed I didn't belong. I told myself I wasn't technical enough, not smart enough, not the "type" of person who could succeed in this space. So I stayed at a distance — interested, but inactive.
              </p>
              <p>
                <strong>My university years changed that.</strong>
              </p>
              <p>
                Being surrounded by driven, curious peers forced me to confront my own excuses. I stepped out of my comfort zone and started learning technology from its roots — slowly, imperfectly, and often through failure. I taught myself how to code. I reached out to people far better than me. I pushed my network, without knowing if it would ever convert into anything meaningful.
              </p>
              <p>
                Over time, through humbling experiences, I realized something important: <strong>no one starts special</strong>. People become capable by starting honestly, staying consistent, and allowing themselves to learn.
              </p>
              <div className="relative my-6 pl-5 pr-5 py-4 border-l-4 border-primary/70 bg-primary/5 dark:bg-primary/10 rounded-r-lg">
                <p className="mb-0">
                  I'm not here to say I'm a tech leader. I'm here because I want people like my past self to reach clarity faster, with better guidance, and with fewer unnecessary doubts.
                </p>
              </div>
              <div className="py-6 flex items-center gap-4">
                <div className="flex-1 h-px bg-slate-300 dark:bg-white/10"></div>
                <span className="text-slate-400 dark:text-slate-500 text-sm font-medium">Project X Vietnam</span>
                <div className="flex-1 h-px bg-slate-300 dark:bg-white/10"></div>
              </div>
              <p>
                That belief is also why I joined Project X Vietnam — and why I chose to step up further after experiencing the <strong>Summer Fellowship Program 2024</strong>. At first, I thought PJX was mainly a bridge: connecting young people to companies, internships, and opportunities. But after living through the experience, I realized that stopping there would be a mistake.
              </p>
              <p>
                <strong>Project X Vietnam should not be a purely transactional program.</strong> It should not end once summer ends. It should not measure success only by placements or short-term outcomes.
              </p>
              <div className="relative my-6 pl-5 pr-5 py-4 border-l-4 border-primary/70 bg-primary/5 dark:bg-primary/10 rounded-r-lg">
                <p className="mb-0">
                  Instead, PJX should be a <strong>career enabler</strong> — one that empowers you with <em>knowledge</em>, <em>mindset</em>, <em>network</em>, and <em>community</em> across multiple stages of your tech journey. A place where learning compounds. Where relationships last. Where growth continues even when no one is watching.
                </p>
              </div>
              <div className="py-6 flex items-center gap-4">
                <div className="flex-1 h-px bg-slate-300 dark:bg-white/10"></div>
                <span className="text-slate-400 dark:text-slate-500 text-sm font-medium">And...</span>
                <div className="flex-1 h-px bg-slate-300 dark:bg-white/10"></div>
              </div>
              <p>
                As we work toward our mission of <strong>empowering the next generation of tech youth</strong>, our goal doesn't exclude the members; we want to help you grow, create, and eventually become the roots of a strong, future-facing tech community.
              </p>
              <p>
                It's a privilege if you already know what you love doing at this stage of your life. And if you don't, Project X Vietnam is meant to be a <strong>safe space to explore</strong> — to try new roles, take on new perspectives, and look at your work from different angles. Through experience and reflection, the path ahead will gradually become clearer.
              </p>
              <p>
                So I encourage you to embrace your time at Project X Vietnam as an opportunity — to try, to meet new people, to reflect often, and most importantly, to <strong>stay curious and keep learning</strong>. Keep creating dots along the way. Trust that one day, those dots will connect.
              </p>
              <p>
                And when you finally discover what you truly love, I promise this will be a community that does its very best to support you and help you move forward.
              </p>
              <p className="text-center mt-8">
                So, as Steve once said:
              </p>
              <p className="text-center text-xl md:text-2xl font-semibold italic">
                "Stay hungry. Stay foolish."
              </p>
              <p className="text-center text-xl md:text-2xl font-bold mt-8">
                Welcome to Project X Vietnam.
              </p>
              <div className="mt-12 text-center">
                <p className={`font-bold text-lg ${isDark ? "text-white" : "text-pxv-dark"}`}>Liam Lee</p>
                <p className={`${isDark ? "text-white/60" : "text-slate-500"}`}>President, Project X Vietnam</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PJX Masterplan Section */}
      <section className={`py-20 md:py-28 ${isDark ? "bg-[#020818]" : "bg-white"}`}>
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.5 }}
            className="text-center mb-8"
          >
            <h2 className="section-label mb-4 text-[#0E56FA]">Project X Masterplan</h2>
            <h3 className={`heading-section ${isDark ? "text-white" : "text-pxv-dark"}`}>Our journey together</h3>
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
          <h2 className="section-label mb-4 text-[#0E56FA]">Member Journey</h2>
          <h3 className={`heading-section ${isDark ? "text-white" : "text-pxv-dark"}`}>
            How You'll Grow With Us
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
              key={phase.title}
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
      <section className="py-24 md:py-32 bg-gradient-to-b from-slate-50 to-white dark:from-[#020818] dark:to-[#030d24] transition-colors duration-500 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.5 }}
            className="text-center mb-20"
          >
            <h2 className="section-label mb-4 text-[#0E56FA]">Working Culture</h2>
            <h3 className="heading-section text-pxv-dark dark:text-white transition-colors duration-500 mb-6">
              What We Value
            </h3>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Our core principles that drive everything we do together
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
            {[
              {
                title: "Eager to learn",
                category: "Growth Mindset",
                description: "We move fast and learn hard. Every challenge is an opportunity to grow, and we embrace the discomfort that comes with stretching beyond our limits.",
                image: "/assets/pjx1.jpg",
                icon: "🚀"
              },
              {
                title: "Innovative",
                category: "Creativity",
                description: "We refuse to settle for mediocre. Creativity isn't just encouraged—it's expected. We push boundaries and challenge the status quo.",
                image: "/assets/pjx2.jpg",
                icon: "💡"
              },
              {
                title: "Supportive",
                category: "Teamwork",
                description: "We hustle, but we hustle together. No one gets left behind. We lift each other up and celebrate wins as a team.",
                image: "/assets/pjx3.jpg",
                icon: "🤝"
              },
              {
                title: "Resilient",
                category: "Perseverance",
                description: "We push through chaos with grace. When things get tough, we get tougher. Setbacks are just setups for comebacks.",
                image: "/assets/pjx4.jpg",
                icon: "💪"
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.15 }}
                viewport={{ once: true, amount: 0.3 }}
                className="group relative"
              >
                <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
                  {/* Large image with overlay */}
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img
                      src={value.image}
                      alt={value.title}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    
                    {/* Floating icon badge */}
                    <div className="absolute top-6 left-6 h-14 w-14 rounded-2xl bg-white/90 dark:bg-black/50 backdrop-blur-md flex items-center justify-center text-2xl shadow-lg">
                      {value.icon}
                    </div>
                    
                    {/* Category badge */}
                    <div className="absolute bottom-6 left-6">
                      <span className="inline-block px-4 py-1.5 rounded-full bg-primary/90 text-white text-xs font-bold uppercase tracking-wider">
                        {value.category}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content area */}
                  <div className="p-8">
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-primary transition-colors duration-300">
                      {value.title}
                    </h3>
                    <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

     {/* Ready Section - Optimized CTA */}
    <section className="relative py-28 md:py-36 bg-gradient-cta text-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
      </div>
      
      <div className="container relative mx-auto px-6 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Eyebrow text for context */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, amount: 0.5 }}
            className="text-blue-200 text-sm md:text-base font-medium tracking-wide uppercase mb-6"
          >
            One step away from something amazing
          </motion.p>
          
          {/* Main headline - larger, more impactful */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true, amount: 0.5 }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          >
            Ready to start this journey{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
              together?
            </span>
          </motion.h2>
          
          {/* Supporting copy - value reinforcement */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true, amount: 0.5 }}
            className="text-lg md:text-xl text-blue-100/80 mb-10 max-w-xl mx-auto"
          >
            You're now part of something extraordinary. Let's get you set up and ready to make an impact.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true, amount: 0.5 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <button
              onClick={openMemberHubPopup}
              className="px-10 py-4 text-lg font-bold text-[#0E56FA] bg-white rounded-full shadow-xl hover:shadow-white/20 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50 transition-all duration-300"
            >
              I'm ready
            </button>
            <button
              onClick={openMemberHubPopup}
              className="px-10 py-4 text-lg font-bold text-white border-2 border-white/80 rounded-full hover:bg-white/10 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50 transition-all duration-300"
            >
              I'm super ready
            </button>
          </motion.div>
        </div>
      </div>
    </section>

{/* Member Hub Popup */}
<AnimatePresence>
  {showMemberHubPopup && (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={closeMemberHubPopup}
      role="dialog"
      aria-modal="true"
      onKeyDown={(e) => e.key === 'Escape' && closeMemberHubPopup()}
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
          className={`text-xl font-bold mb-4 ${
            isDark ? "text-white" : "text-pxv-dark"
          }`}
        >
          Filling here to join our family
        </h3>
        
        <p className={`text-sm mb-6 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          Please complete the registration form, then confirm below to proceed.
        </p>

        <div className="flex flex-col gap-3">
          <a
            href="https://docs.google.com/spreadsheets/d/1kImFje3miKjdJnlpRIleFkO_4hZRXszvVK1OkoDScEk/edit?gid=0#gid=0"
            target="_blank"
            rel="noopener noreferrer"
            className="group btn bg-[#0E56FA] hover:bg-[#0E56FA]/90 text-white px-8 py-3.5 text-base w-full flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-200"
          >
            <span>Member Info Hub</span>
            <svg className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          <button
            onClick={handleMemberHubFinish}
            className={`group btn px-8 py-3.5 text-base w-full flex items-center justify-center gap-2 border transition-all duration-200 ${
              isDark
                ? "border-white/10 text-slate-300 hover:border-white/30 hover:bg-white/5 hover:text-white"
                : "border-slate-200 text-slate-600 hover:border-blue-200 hover:bg-blue-50/50 hover:text-blue-600"
            }`}
          >
            <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity">
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span>I have finished</span>
          </button>
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>

{/* Thank You Popup */}
<AnimatePresence>
  {showThankYouPopup && (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={closeThankYouPopup}
      role="dialog"
      aria-modal="true"
      onKeyDown={(e) => e.key === 'Escape' && closeThankYouPopup()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
        className={`relative p-6 md:p-8 pt-12 rounded-3xl shadow-2xl max-w-sm w-full text-center overflow-hidden ${
          isDark ? "bg-[#0A0F1A] border border-white/10" : "bg-white"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background decorative elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pxv-cyan/10 rounded-full blur-3xl pointer-events-none" />

        <h3 className={`text-3xl font-bold mb-6 tracking-tight leading-tight ${isDark ? "text-white" : "text-pxv-dark"}`}>
          <span className="text-gradient-animated">
            Lets build and grind together!
          </span>
        </h3>

        <div className="space-y-4">
          <div className={`p-1 rounded-2xl bg-gradient-to-br from-primary/20 via-pxv-cyan/20 to-primary/20`}>
            <div className={`p-6 rounded-xl backdrop-blur-sm ${isDark ? "bg-black/40" : "bg-white/60"}`}>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">
                Made with ❤️ by Ops Head
              </p>
              <div className="flex items-center justify-center gap-6">
                <div className="flex flex-col items-center group">
                  <div className="relative w-16 h-16 mb-3 transition-transform duration-300 group-hover:scale-110">
                    <Image
                      src="/assets/giang.jpg"
                      alt="Giangle"
                      fill
                      className="rounded-full object-cover border-2 border-white dark:border-white/10 shadow-md"
                    />
                  </div>
                  <span className={`text-sm font-semibold ${isDark ? "text-white" : "text-pxv-dark"}`}>Giangle</span>
                </div>
                
                <div className={`h-12 w-px ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
                
                <div className="flex flex-col items-center group">
                  <div className="relative w-16 h-16 mb-3 transition-transform duration-300 group-hover:scale-110">
                    <Image
                      src="/assets/thu.jpg"
                      alt="Minhthu"
                      fill
                      className="rounded-full object-cover border-2 border-white dark:border-white/10 shadow-md"
                    />
                  </div>
                  <span className={`text-sm font-semibold ${isDark ? "text-white" : "text-pxv-dark"}`}>Minhthu</span>
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

