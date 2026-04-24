"use client";
import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { MemberCard } from "./MemberCard";
import { MemberModal } from "./MemberModal";
import { DOMCircularGallery } from "../DOMCircularGallery";
import { mockMembers, Member, SectionType } from "@/lib/members";

const SECTIONS: SectionType[] = ["Core Team", "Growth", "Product", "Operations", "Partnerships"];

const DraggableOrb = ({ className, coreColor, glowColor, size = "w-[400px] h-[400px]" }: { className: string, coreColor: string, glowColor: string, size?: string }) => {
  const duration = useMemo(() => Math.random() * 4 + 6, []);
  const delay = useMemo(() => Math.random() * 2, []);

  return (
    <motion.div
      drag
      dragConstraints={{ left: -2000, right: 2000, top: -3000, bottom: 3000 }}
      dragElastic={0.4}
      className={`absolute rounded-full cursor-grab active:cursor-grabbing ${size} flex items-center justify-center ${className}`}
      style={{
        pointerEvents: "auto",
        touchAction: "none",
        zIndex: 5,
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9, cursor: "grabbing" }}
    >
      <motion.div
        className="w-full h-full rounded-full absolute pointer-events-none"
        animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.9, 1.1, 0.9] }}
        transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
        style={{
          background: `radial-gradient(circle at center, ${coreColor} 0%, ${glowColor} 40%, transparent 70%)`,
          filter: "blur(30px)",
        }}
      />
    </motion.div>
  );
};

const SECTION_SUBTITLES: Record<SectionType, string> = {
  "Core Team": "They reply in Business Days. To each other.",
  "Growth": "Somehow turn memes into customers. Consistently.",
  "Product": "What they ship vs. what they promised: choose one.",
  "Operations": "The reason the office still has electricity.",
  "Partnerships": "Professional LinkedIn stalkers. The good kind.",
};

function TiltedHeading({ children }: { children: React.ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-100, 0, 100], [45, 15, -15]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-100, 0, 100], [-45, -15, 15]), { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <div style={{ perspective: 1000 }} className="inline-block relative z-20 hover:z-30">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative px-6 py-3 md:px-8 md:py-4 bg-[#0E56FA] transform -skew-x-6 cursor-crosshair shadow-[0_10px_30px_-10px_rgba(14,86,250,0.6)] pointer-events-auto"
      >
        <motion.h2
          style={{ translateZ: 40 }}
          className="text-3xl md:text-5xl font-medium tracking-tighter text-white uppercase drop-shadow-md whitespace-nowrap"
        >
          {children}
        </motion.h2>
      </motion.div>
    </div>
  );
}

const AnimatedSection = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 40 }}
      whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`py-12 relative z-10 w-full max-w-7xl mx-auto pointer-events-none ${className}`}
    >
      {children}
    </motion.div>
  );
};

// Per-section carousel
function SectionCarousel({ members, onSelect }: { members: Member[]; onSelect: (m: Member) => void }) {
  const cards = members.map((member, i) => (
    <motion.div
      key={member.id}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
      className="w-full h-full"
    >
      <MemberCard member={member} onClick={() => onSelect(member)} />
    </motion.div>
  ));

  return (
    <div className="w-full relative pointer-events-auto -mx-6 md:mx-0">
      <DOMCircularGallery bend={3}>
        {cards}
      </DOMCircularGallery>
    </div>
  );
}

export function TeamSection() {
  const [isUnlocked, setIsUnlocked] = useState(true);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredMembers = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return mockMembers.filter(m =>
      m.name.toLowerCase().includes(query) ||
      m.personalityLine.toLowerCase().includes(query) ||
      m.askMeAbout.toLowerCase().includes(query) ||
      m.topic30Min.toLowerCase().includes(query) ||
      m.section.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <section className="min-h-screen bg-white text-zinc-900 px-6 md:px-12 lg:px-20 py-24 md:py-32 selection:bg-[#0E56FA] selection:text-white relative overflow-hidden font-sans">
      {/* Persistent Background Elements (Grid) */}
      <div className={`fixed inset-0 overflow-hidden pointer-events-none z-0 transition-opacity duration-1000 ${isUnlocked ? "opacity-100" : "opacity-0"}`}>
        {/* Full Page Grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(14, 86, 250, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(14, 86, 250, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Scrollable Background Elements (Draggable Orbs) */}
      <div className={`absolute inset-0 overflow-hidden pointer-events-none z-0 transition-opacity duration-1000 ${isUnlocked ? "opacity-100" : "opacity-0"}`}>
        {/* Spread out unpredictably, pushed towards the edges to avoid centering */}

        {/* Near Top (Hero) */}
        <DraggableOrb className="top-[-2%] -left-[10%]" coreColor="rgba(14,86,250,0.8)" glowColor="rgba(14,86,250,0.3)" size="w-[600px] h-[600px]" />
        <DraggableOrb className="top-[5%] -right-[5%]" coreColor="rgba(23,202,250,0.6)" glowColor="rgba(23,202,250,0.15)" size="w-[300px] h-[300px]" />

        {/* 15% - 30% */}
        <DraggableOrb className="top-[18%] -left-[15%]" coreColor="rgba(23,202,250,0.7)" glowColor="rgba(23,202,250,0.2)" size="w-[800px] h-[800px]" />
        <DraggableOrb className="top-[25%] left-[80%]" coreColor="rgba(14,86,250,0.6)" glowColor="rgba(14,86,250,0.15)" size="w-[350px] h-[350px]" />
        <DraggableOrb className="top-[32%] -right-[15%]" coreColor="rgba(9,36,170,0.8)" glowColor="rgba(9,36,170,0.3)" size="w-[600px] h-[600px]" />

        {/* 40% - 60% */}
        <DraggableOrb className="top-[45%] -left-[5%]" coreColor="rgba(14,86,250,0.5)" glowColor="rgba(14,86,250,0.1)" size="w-[350px] h-[350px]" />
        <DraggableOrb className="top-[52%] right-[10%]" coreColor="rgba(14,86,250,0.8)" glowColor="rgba(14,86,250,0.2)" size="w-[200px] h-[200px]" />
        <DraggableOrb className="top-[60%] -right-[20%]" coreColor="rgba(23,202,250,0.6)" glowColor="rgba(23,202,250,0.15)" size="w-[700px] h-[700px]" />

        {/* 70% - 100% */}
        <DraggableOrb className="top-[72%] -left-[20%]" coreColor="rgba(9,36,170,0.7)" glowColor="rgba(9,36,170,0.2)" size="w-[900px] h-[900px]" />
        <DraggableOrb className="top-[80%] left-[10%]" coreColor="rgba(23,202,250,0.7)" glowColor="rgba(23,202,250,0.2)" size="w-[250px] h-[250px]" />
        <DraggableOrb className="top-[90%] -right-[10%]" coreColor="rgba(14,86,250,0.7)" glowColor="rgba(14,86,250,0.2)" size="w-[500px] h-[500px]" />
        <DraggableOrb className="top-[95%] left-[40%]" coreColor="rgba(23,202,250,0.8)" glowColor="rgba(23,202,250,0.3)" size="w-[450px] h-[450px]" />
      </div>

      <motion.div
        key={isUnlocked ? "ready" : "locked"}
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: isUnlocked ? 1 : 0, filter: isUnlocked ? "blur(0px)" : "blur(10px)" }}
        transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
        className={isUnlocked ? "pointer-events-none" : "pointer-events-none"}
      >

        {/* Hero header */}
        <AnimatedSection className="mb-10 md:mb-16 flex flex-col items-center text-center relative z-20">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-medium tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#0E56FA] via-[#0E56FA] to-[#17CAFA]">
            Meet the Crew.
          </h1>
          <p className="text-xl md:text-3xl text-zinc-600 font-normal mb-12">
            Find your light. Find your people.
          </p>

          {/* Search */}
          <div className="relative w-full max-w-xl mx-auto group pointer-events-auto">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-zinc-400 group-focus-within:text-[#17CAFA] transition-colors" />
            </div>
            <input
              type="text"
              className="w-full bg-blue-50/50 border border-[#0E56FA]/20 rounded-full py-4 md:py-5 pl-14 pr-6 text-zinc-900 text-lg placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0E56FA] focus:border-transparent transition-all shadow-xl backdrop-blur-md"
              placeholder="Search people, interests, ideas..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </AnimatedSection>

        {/* Sections */}
        <div className="relative z-20">
          {SECTIONS.map(section => {
            const sectionMembers = filteredMembers.filter(m => m.section === section);
            if (sectionMembers.length === 0) return null;

            return (
              <AnimatedSection key={section} className="mb-10 md:mb-16">
                {/* Section heading */}
                <div className="flex items-center gap-6 mb-3">
                  <TiltedHeading>{section}</TiltedHeading>
                  <div className="h-px flex-1 max-w-xs bg-gradient-to-r from-[#0E56FA]/30 via-[#0E56FA]/10 to-transparent ml-4" />
                </div>
                <p className="text-base text-zinc-600 font-normal tracking-wide mb-8 pl-1 select-none relative z-20">
                  {SECTION_SUBTITLES[section]}
                </p>

                {/* Carousel */}
                <SectionCarousel
                  members={sectionMembers}
                  onSelect={m => setSelectedMember(m)}
                />
              </AnimatedSection>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredMembers.length === 0 && (
          <AnimatedSection className="text-center py-32 relative z-20">
            <div className="w-24 h-24 rounded-full bg-[#0E56FA]/10 flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-zinc-500" />
            </div>
            <p className="text-2xl text-zinc-500 font-medium tracking-tight">
              No crew members found matching your search.
            </p>
          </AnimatedSection>
        )}
      </motion.div>

      {/* Modal */}
      <MemberModal
        isOpen={!!selectedMember}
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </section>
  );
}
