"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Github, Twitter, Linkedin } from "lucide-react";
import { Member } from "@/lib/members";

interface MemberModalProps {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MemberModal({ member, isOpen, onClose }: MemberModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && member && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 pointer-events-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#01001F]/80 pointer-events-auto"
            aria-hidden="true"
          />

          {/* Modal Content - Deck Card Style */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-5xl h-full max-h-[90vh] bg-[#0A0A0A] border border-white/10 rounded-[2rem] overflow-hidden flex flex-col pointer-events-auto shadow-[0_20px_60px_-15px_rgba(14,86,250,0.3)] perspective-[1000px]"
          >
            <div className="relative flex flex-col md:flex-row w-full h-full">
              
              {/* Close Button Mobile & Desktop */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 md:top-6 md:right-6 z-50 p-2.5 rounded-full bg-black/40 hover:bg-[#0E56FA] transition-colors backdrop-blur-md flex items-center justify-center group border border-white/20"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-white/90 group-hover:text-white transition-colors" />
              </button>

              <div className="w-full md:w-[45%] h-72 md:h-full relative shrink-0">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] md:from-black/60 to-transparent z-10" />
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute bottom-6 left-6 z-20 hidden md:block">
                   <h2 className="text-4xl font-extrabold text-white tracking-tight mb-1">{member.name}</h2>
                   <p className="text-[#17CAFA] font-medium text-lg uppercase tracking-wide">{member.section}</p>
                   <div className="flex gap-3 mt-5">
                      {member.links?.linkedin && <a href={member.links.linkedin} className="p-2.5 bg-white/10 rounded-full hover:bg-[#0E56FA] transition-colors backdrop-blur-sm"><Linkedin className="w-4 h-4 text-white" /></a>}
                      {member.links?.github && <a href={member.links.github} className="p-2.5 bg-white/10 rounded-full hover:bg-[#0E56FA] transition-colors backdrop-blur-sm"><Github className="w-4 h-4 text-white" /></a>}
                      {member.links?.twitter && <a href={member.links.twitter} className="p-2.5 bg-white/10 rounded-full hover:bg-[#0E56FA] transition-colors backdrop-blur-sm"><Twitter className="w-4 h-4 text-white" /></a>}
                   </div>
                </div>
              </div>

              {/* Right: Deep Profile Content */}
              <div className="p-8 md:p-12 flex flex-col overflow-y-auto w-full md:w-[55%] text-zinc-300 relative [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
                
                <div className="md:hidden mb-8 mt-2 relative z-20">
                   <h2 className="text-3xl font-extrabold text-white tracking-tight mb-1">{member.name}</h2>
                   <p className="text-[#17CAFA] font-medium uppercase tracking-wide text-sm">{member.section}</p>
                   <div className="flex gap-3 mt-4">
                      {member.links?.linkedin && <a href={member.links.linkedin} className="p-2 bg-white/10 rounded-full hover:bg-[#0E56FA] transition-colors"><Linkedin className="w-4 h-4 text-white" /></a>}
                      {member.links?.github && <a href={member.links.github} className="p-2 bg-white/10 rounded-full hover:bg-[#0E56FA] transition-colors"><Github className="w-4 h-4 text-white" /></a>}
                      {member.links?.twitter && <a href={member.links.twitter} className="p-2 bg-white/10 rounded-full hover:bg-[#0E56FA] transition-colors"><Twitter className="w-4 h-4 text-white" /></a>}
                   </div>
                </div>

                {/* Data Grid */}
                <div className="space-y-8 relative z-20">
                  
                  <Section title="Quote I live by">
                    <p className="text-xl font-medium italic text-white border-l-2 border-[#0E56FA] pl-5 py-1">
                      {member.quote}
                    </p>
                  </Section>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <Section title="University">
                      <p className="text-zinc-200 font-medium">{member.university}</p>
                    </Section>
                    <Section title="One thing that represents me">
                      <p className="text-zinc-200 font-medium">{member.representsMe}</p>
                    </Section>
                  </div>

                  <div className="h-px w-full bg-gradient-to-r from-[#17CAFA]/30 to-transparent my-6" />

                  <Section title="Currently building">
                    <div className="bg-[#0E56FA]/10 p-4 rounded-xl border border-[#0E56FA]/20 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-[#0E56FA]" />
                      <p className="text-zinc-200 font-medium">{member.currentlyBuilding}</p>
                    </div>
                  </Section>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <Section title="A topic I can talk about for 30 mins">
                      <p className="text-zinc-300">{member.topic30Min}</p>
                    </Section>
                    <Section title="Ask me for help with">
                      <p className="text-zinc-300">{member.askMeAbout}</p>
                    </Section>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <Section title="Obsessed with right now">
                      <p className="text-zinc-300">{member.obsessedWith}</p>
                    </Section>
                    <Section title="What I do when no one's watching">
                      <p className="text-zinc-300">{member.whenNoOneWatching}</p>
                    </Section>
                  </div>

                  <Section title="Work Experience & Projects">
                    <p className="text-zinc-300 leading-relaxed">
                      {member.experience}
                    </p>
                  </Section>

                  <div className="h-px w-full bg-white/5 my-6" />

                  <Section title="My Core Values">
                    <div className="flex flex-wrap gap-2 mt-2">
                      {member.coreValues.split(",").map((val, idx) => (
                        <span key={idx} className="px-4 py-1.5 bg-white/5 text-zinc-300 text-sm font-medium rounded-full border border-white/10 shadow-sm">
                          {val.trim()}
                        </span>
                      ))}
                    </div>
                  </Section>

                </div>
                
                <div className="pb-10" />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="flex flex-col gap-2">
    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{title}</h4>
    {children}
  </div>
);
