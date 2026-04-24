"use client";
import React, { useRef, useEffect, ReactNode } from 'react';

interface DOMCircularGalleryProps {
  children: ReactNode[];
  bend?: number;
}

export function DOMCircularGallery({ children, bend = 3 }: DOMCircularGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let rafId: number;
    
    const update = () => {
      const rect = container.getBoundingClientRect();
      const viewportCenter = rect.left + rect.width / 2;
      const H = rect.width / 2; // Half width of container
      
      const childrenElements = container.children;
      for (let i = 0; i < childrenElements.length; i++) {
        const child = childrenElements[i] as HTMLElement;
        if (child.tagName === 'STYLE' || child.classList.contains('pointer-events-none')) continue;
        
        const childRect = child.getBoundingClientRect();
        const childCenter = childRect.left + childRect.width / 2;
        
        const x = childCenter - viewportCenter;
        
        if (bend === 0) {
          child.style.transform = `translateY(0px) rotateZ(0deg)`;
        } else {
          // Increase the multiplier to make R larger, resulting in a gentler (less) curve.
          const B = Math.abs(bend * 400); 
          const R = (H * H + B * B) / (2 * B);
          const effectiveX = Math.min(Math.abs(x), R - 1);
          
          const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);
          
          // Arch shape: sides move DOWN (positive Y in CSS)
          const y = bend > 0 ? arc : -arc;
          
          // Fan out: left side (x < 0) rotates CCW (negative rotZ).
          const rotRads = bend > 0 
            ? Math.sign(x) * Math.asin(effectiveX / R)
            : -Math.sign(x) * Math.asin(effectiveX / R);
            
          const rotDeg = rotRads * (180 / Math.PI);
          
          child.style.transform = `translateY(${y}px) rotateZ(${rotDeg}deg)`;
        }
      }
      
      rafId = requestAnimationFrame(update);
    };
    
    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [bend]);

  return (
    <div className="w-full relative overflow-visible py-10">
      <div 
        ref={scrollRef} 
        // We remove Tailwind's 'justify-center' to prevent the scroll overflow bug, and use safe center in style
        className="flex overflow-x-auto snap-x snap-mandatory items-center pb-32 pt-32 gap-6 md:gap-8 hide-scrollbar px-6 md:px-12"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          justifyContent: "safe center"
        }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}} />
        
        {children.map((child, i) => (
          <div 
            key={i} 
            className="snap-center shrink-0 w-[70vw] sm:w-[260px] md:w-[300px] flex justify-center"
            style={{ willChange: "transform", transformStyle: "preserve-3d" }}
          >
            <div className="w-full h-full relative">
              {child}
            </div>
          </div>
        ))}
        
      </div>
    </div>
  );
}
