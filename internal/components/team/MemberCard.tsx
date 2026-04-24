"use client";
import React, { useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";
import { Inter_Tight } from "next/font/google";
import { Member } from "@/lib/members";

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

interface MemberCardProps {
  member: Member;
  onClick: () => void;
}

export function MemberCard({ member, onClick }: MemberCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Springs for smooth 3D tilt recovery
  const rotateX = useSpring(0, { stiffness: 300, damping: 30, mass: 0.5 });
  const rotateY = useSpring(0, { stiffness: 300, damping: 30, mass: 0.5 });
  
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setMousePos({
      x: (mouseX / width) * 100,
      y: (mouseY / height) * 100,
    });

    const rY = ((mouseX / width) - 0.5) * 20; 
    const rX = ((mouseY / height) - 0.5) * -20;

    rotateX.set(rX);
    rotateY.set(rY);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    setIsHovering(false);
  };

  return (
    <div
      className={`relative perspective-[1200px] w-full cursor-pointer group ${interTight.className}`}
      onClick={onClick}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={handleMouseLeave}
        animate={{
          scale: isHovering ? 1.05 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
        style={{ 
          rotateX, 
          rotateY, 
          transformStyle: "preserve-3d" 
        }}
        className="relative w-full aspect-[3/4] md:aspect-[4/5] overflow-visible rounded-[2rem] pointer-events-auto group"
      >
        {/* Inner wrapper for image and background with overflow-hidden */}
        <div className="absolute inset-0 w-full h-full rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#17CAFA] via-[#0E56FA] to-[#4338CA] border border-white/20 shadow-[0_20px_50px_-15px_rgba(14,86,250,0.5)]">
          
          {/* Subtle soft glow behind the torn paper for separation */}
          <div className="absolute inset-x-8 bottom-0 top-[20%] bg-white/50 blur-[40px] z-0 pointer-events-none transition-opacity duration-700 opacity-60 group-hover:opacity-100" />
          
          {/* Organic Scrap Paper shadow shape (Irregular torn polygon) */}
          <div 
             className="absolute inset-x-4 bottom-2 h-[60%] bg-[#FDFBF7] z-0 transition-transform duration-700 ease-in-out group-hover:scale-105" 
             style={{ 
               clipPath: "polygon(5% 2%, 15% 5%, 30% 1%, 45% 7%, 60% 0%, 75% 8%, 92% 3%, 98% 20%, 94% 40%, 100% 60%, 93% 85%, 85% 98%, 70% 92%, 50% 100%, 35% 94%, 20% 98%, 8% 90%, 2% 70%, 6% 50%, 0% 30%, 8% 15%)",
               backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E\")"
             }} 
          />

          {/* Profile Image (Transparent Background Cutout) */}
          <div className="absolute inset-x-0 bottom-0 h-[65%] z-10 transition-transform duration-700 ease-in-out group-hover:scale-[1.03]">
            <img
              src={member.imageUrl}
              alt={member.name}
              className="w-full h-full object-contain object-bottom transition-all duration-700 ease-in-out drop-shadow-[0_8px_15px_rgba(0,0,0,0.15)] group-hover:drop-shadow-[0_15px_25px_rgba(0,0,0,0.25)] brightness-105 contrast-105"
            />
          </div>

          {/* Top Gradient for text readability - seamlessly blends with the masked image */}
          <div className="absolute top-0 left-0 w-full h-[35%] bg-gradient-to-b from-[#0E56FA] via-[#0E56FA]/60 to-transparent z-20 pointer-events-none" />

          {/* Smooth light sweep / shine streak on hover */}
          <motion.div
            animate={{ x: isHovering ? '300%' : '-150%' }}
            initial={{ x: '-150%' }}
            transition={{ 
              repeat: isHovering ? Infinity : 0, 
              duration: 2, 
              ease: "easeInOut",
              repeatDelay: 0.5
            }}
            className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[30deg] z-20 pointer-events-none mix-blend-overlay"
          />

          {/* Soft ambient edge glow vignette */}
          <div className="absolute inset-0 z-30 pointer-events-none shadow-[inset_0_0_50px_rgba(14,86,250,0.8)] rounded-[2rem] transition-opacity duration-700 opacity-60 group-hover:opacity-100" />
        </div>

        {/* Content Layer with Parallax Depth (At the TOP, outside the overflow-hidden container) */}
        <div className="absolute inset-0 z-30 w-full flex flex-col justify-start pt-10 px-6 items-center pointer-events-none text-center" style={{ transformStyle: "preserve-3d" }}>
          <motion.h3
            style={{ transform: "translateZ(50px)" }}
            className="font-sans text-[30px] font-semibold tracking-[-0.01em] text-white/90 drop-shadow-[0_4px_10px_rgba(0,0,0,1)] leading-tight"
          >
            {member.name}
          </motion.h3>

          <motion.p
            style={{ transform: "translateZ(30px)" }}
            className="font-sans text-[14px] font-normal tracking-[0.02em] text-white/60 mt-[6px] drop-shadow-[0_2px_5px_rgba(0,0,0,1)]"
          >
            {member.quote || member.personalityLine}
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
