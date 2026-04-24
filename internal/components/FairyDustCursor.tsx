"use client";

import { useEffect, useRef } from "react";

export function FairyDustCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    class Particle {
      position: { x: number; y: number };
      velocity: { x: number; y: number };
      size: number;
      life: number;
      fill: string;

      angle: number;
      angularVelocity: number;

      constructor(x: number, y: number, color: string) {
        this.position = { x, y };
        // Gentle spread and fall
        this.velocity = {
          x: (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 3),
          y: Math.random() * 3.5,
        };
        this.size = Math.random() * 8 + 4; // 4px to 12px radius (bigger)
        this.life = 0;
        this.fill = color;
        this.angle = Math.random() * Math.PI * 2;
        this.angularVelocity = (Math.random() - 0.5) * 0.8; // Faster spin for bling bling
      }

      update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.life++;
        // Spin the particle
        this.angle += this.angularVelocity;

        // Fade/shrink out effect faster since they are much bigger
        this.size = Math.max(0, this.size - 0.4);
      }

      draw() {
        if (!ctx || this.size <= 0) return;
        ctx.save();

        // Add flashing effect for extra 'bling' based on life
        const flash = 0.6 + 0.4 * Math.sin(this.life * 0.3);
        ctx.globalAlpha = Math.max(0, (this.size / 36) * flash);

        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.angle);

        ctx.shadowBlur = Math.min(40, this.size * 2);
        ctx.shadowColor = this.fill;
        ctx.fillStyle = this.fill;

        // Draw 4-point sparkle star
        ctx.beginPath();
        const s = this.size;
        ctx.moveTo(0, -s);
        ctx.quadraticCurveTo(0, 0, s, 0);
        ctx.quadraticCurveTo(0, 0, 0, s);
        ctx.quadraticCurveTo(0, 0, -s, 0);
        ctx.quadraticCurveTo(0, 0, 0, -s);
        ctx.closePath();

        ctx.fill();
        ctx.restore();
      }
    }

    let particles: Particle[] = [];
    let mouse = { x: 0, y: 0 };
    let lastMouse = { x: 0, y: 0 };
    let hasMoved = false;

    // Use xOS branding colors + pure white and bright neon blues for intense bling
    const colors = ["#0E56FA", "#00F0FF", "#FFFFFF", "#baebfd", "#17CAFA"];

    const addParticles = () => {
      // Don't emit if distance is too small
      const dx = mouse.x - lastMouse.x;
      const dy = mouse.y - lastMouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 1) {
        // More particles for faster movement, cap to a reasonable limit
        const amount = Math.min(20, Math.floor(distance * 0.8));
        for (let i = 0; i < amount; i++) {
          const color = colors[Math.floor(Math.random() * colors.length)];
          const px = lastMouse.x + dx * (i / amount) + (Math.random() * 12 - 6);
          const py = lastMouse.y + dy * (i / amount) + (Math.random() * 12 - 6);

          particles.push(new Particle(px, py, color));
        }
      }

      lastMouse.x = mouse.x;
      lastMouse.y = mouse.y;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!hasMoved) {
        // First move, just set initial without drawing a long line from 0,0
        lastMouse.x = e.clientX;
        lastMouse.y = e.clientY;
        hasMoved = true;
      }
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      addParticles();
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw();

        if (p.size <= 0 || p.position.y > height) {
          particles.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      aria-hidden="true"
    />
  );
}
