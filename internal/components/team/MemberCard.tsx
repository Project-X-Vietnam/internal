"use client";
import React from "react";
import { motion } from "framer-motion";
import { Inter_Tight } from "next/font/google";
import { Member } from "@/lib/members";

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  display: "swap",
});

interface MemberCardProps {
  member: Member;
  onClick: () => void;
}

export function MemberCard({ member, onClick }: MemberCardProps) {
  return (
    <div className={`cursor-pointer group w-full ${interTight.className}`} onClick={onClick}>
      {/* Photo area */}
      <motion.div
        className="relative aspect-[3/4] overflow-hidden bg-zinc-800"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Base image — grayscale */}
        <img
          src={member.imageUrl}
          alt={member.name}
          className="absolute inset-0 w-full h-full object-cover grayscale transition-opacity duration-500 ease-in-out group-hover:opacity-0"
        />

        {/* Hover image — color */}
        <img
          src={member.hoverImageUrl}
          alt={`${member.name} hover`}
          className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100"
        />

        {/* Blue overlay */}
        <div className="absolute inset-0 bg-[#0E56FA] opacity-0 group-hover:opacity-20 transition-opacity duration-500 ease-in-out pointer-events-none" />
      </motion.div>

      {/* Separator */}
      <div className="h-[1px] w-full bg-white mt-4 mb-3" />

      {/* Name + personality line below photo */}
      <div className="space-y-1">
        <h3 className="text-white text-lg md:text-xl font-black tracking-wider uppercase leading-tight">
          {member.name}
        </h3>
        <p className="text-[#a0a0a0] text-xs md:text-sm tracking-wide leading-relaxed">
          {member.personalityLine}
        </p>
      </div>
    </div>
  );
}
