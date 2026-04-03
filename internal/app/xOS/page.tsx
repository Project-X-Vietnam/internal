"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence, useSpring, useTransform, useMotionValue, useScroll, useMotionTemplate, useMotionValueEvent } from "framer-motion";
import ReactBitsTiltedCard from "../../components/TiltedCard";
import { Inter, Syne } from "next/font/google";
import {
  Search,
  Brain,
  ChartSpline,
  Github,
  Globe,
  Linkedin,
  Orbit,
  Sparkles,
  Zap,
  Cpu,
  MonitorSmartphone,
  BookOpenText,
  Lightbulb,
  Facebook,
  X,
  ExternalLink,
  Music3,
  BadgeCheck,
  Disc,
  Play,
  Heart,
  Star,
  MapPin,
  MessageCircle,
  Clock,
  Code,
  Bell,
  ArrowUp
} from "lucide-react";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });
const syne = Syne({ subsets: ["latin"], weight: ["700", "800"], display: "swap" });

// --- TYPES ---
type Department = "Product" | "Operations" | "Growth" | "Partnership" | "Leadership";
type Generation = "Gen 2026" | "Gen 202X";

type Member = {
  id: string;
  name: string;
  role: string;
  department: Department;
  generation: Generation;
  university: string;
  major: string;
  photo: string;
  quote: string;
  profileThemeSong: string;
  youtubeMusicLink: string;
  facebook: string;
  linkedin: string;
  github: string;
  portfolio: string;
  personalWebsite: string;
  workExperience: string[];
  sideQuests: string[];
  courses: string[];
  skillsHelpWith: string[];
  thirtyMinTalkTopic: string;
  hiddenGemTool: string;
  coreValues: string[];
  futureDream: string;
  currentFocus: string;
  obsession: string;
  secretTalent: string;
  doingWhenNobodyWatching: string;
  galleryImage: string;
};

// --- DATA ---
const DEPARTMENTS: Array<Department | "All"> = ["All", "Product", "Operations", "Growth", "Partnership"];
const GENERATIONS: Generation[] = ["Gen 2026", "Gen 202X"];

const FIRST_NAMES = ["Alex", "Leo", "Mia", "Nina", "Oscar", "Zoe", "Ryan", "Ava", "Sam", "Emma"];
const LAST_NAMES = ["Chen", "Kim", "Nguyen", "Smith", "Tran", "Lee", "Patel", "Garcia"];

const generateId = () => Math.random().toString(36).substr(2, 9);

const MOCK_MEMBERS: Member[] = Array.from({ length: 29 }).map((_, i) => {
  const dept = DEPARTMENTS[1 + (i % 4)] as Department; // Distribute into 4 main departments
  const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
  const lastName = LAST_NAMES[i % LAST_NAMES.length];

  return {
    id: generateId(),
    name: `${firstName} ${lastName}`,
    role: i === 0 ? "President" : i === 1 ? "Vice President" : `${dept} Associate`,
    department: i < 2 ? "Leadership" : dept,
    generation: "Gen 2026", // Explicitly setting all to 2026 based on request
    university: "RMIT University",
    major: ["Computer Science", "Digital Marketing", "Design", "Business"][i % 4],
    photo: `https://i.pravatar.cc/600?img=${(i % 60) + 1}`,
    quote: [
      "Building the plane while flying it.",
      "Stay curious, keep shipping.",
      "Design is how it works.",
      "Data > Opinions."
    ][i % 4],
    profileThemeSong: ["Electric Feel", "Löwe", "Breathe Deeper", "Midnight City"][i % 4],
    youtubeMusicLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Safe placeholder
    facebook: "https://facebook.com",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    portfolio: "https://example.com",
    personalWebsite: i % 2 === 0 ? "https://example.com/me" : "",
    workExperience: [
      "Product Intern @ TechCorp",
      "Freelance Designer",
      "Event Lead @ CampusHub"
    ].slice(0, 1 + (i % 3)),
    sideQuests: [
      "Built a daily habit tracker",
      "Won a local UI hackathon",
      "Running a 1k-sub newsletter"
    ].slice(0, 1 + (i % 2)),
    courses: [
      "Design Systems for Beginners",
      "Advanced Database Architecture",
      "Leadership in Tech"
    ].slice(0, 1 + (i % 2)),
    skillsHelpWith: ["Figma Prototyping", "React.js", "Sprint Planning", "Data Viz"].slice(0, 2 + (i % 3)),
    thirtyMinTalkTopic: "Why micro-interactions are the future of UX.",
    hiddenGemTool: ["Raycast", "Linear", "Arc Browser", "Notion AI"][i % 4],
    coreValues: ["Empathy", "Craft", "Speed"].slice(0, 1 + (i % 3)),
    futureDream: "To build products that empower individual creators and redefine how we interact with software every day.",
    currentFocus: "Currently obsessed with micro-interactions and framer-motion.",
    obsession: ["Mechanical keyboards", "Matcha lattes", "Film photography", "Indie games"][i % 4],
    secretTalent: "Can name the exact hex code of most brand blue colors.",
    doingWhenNobodyWatching: "Usually redesigning my personal site for the 5th time this year.",
    galleryImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200"
  };
});

// --- COMPONENTS ---

// 1. Navbar
const Navbar = () => (
  <header className="fixed top-0 inset-x-0 z-50 p-4 pointer-events-none">
    <div className="w-full pointer-events-auto bg-white/70 backdrop-blur-xl px-4 py-3 rounded-2xl border border-slate-200/50 shadow-sm flex items-center justify-between">
      {/* Left side */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#1A2B47] flex items-center justify-center shadow-inner">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className={`${syne.className} font-[800] text-lg tracking-tight text-slate-800`}>xOS</span>
        </div>
        <nav className="hidden sm:flex items-center gap-6">
          <a href="#" className="text-sm font-bold text-slate-800">Home</a>
          <a href="#" className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">Member Hub</a>
        </nav>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <button className="relative w-10 h-10 rounded-full border border-slate-200 bg-white/50 flex items-center justify-center text-slate-600 hover:bg-white hover:text-blue-500 transition-colors">
          <Bell size={18} />
          <div className="absolute top-2.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
        </button>
        <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 border border-slate-200 shadow-sm">
            <img src="https://i.pravatar.cc/150?img=68" alt="Current User" className="w-full h-full object-cover" />
          </div>
          <span className="text-sm font-bold text-slate-800 hidden sm:block mr-2">Dien Duong</span>
        </div>
      </div>
    </div>
  </header>
);

// 2. Click Sparks Context
type Spark = { id: number; x: number; y: number };
const GlobalSparks = () => {
  const [sparks, setSparks] = useState<Spark[]>([]);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const newSpark = { id: Date.now() + Math.random(), x: e.clientX, y: e.clientY };
      setSparks((prev) => [...prev, newSpark]);
      setTimeout(() => {
        setSparks((prev) => prev.filter((s) => s.id !== newSpark.id));
      }, 600);
    };
    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  return (
    <>
      {sparks.map((spark) => (
        <motion.div
          key={spark.id}
          initial={{ opacity: 1, scale: 0, rotate: -45 }}
          animate={{ opacity: 0, scale: 2, rotate: 45 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed pointer-events-none z-[100] text-[#FF9052]"
          style={{ left: spark.x - 12, top: spark.y - 12 }}
        >
          <Sparkles size={24} strokeWidth={1.5} />
        </motion.div>
      ))}
    </>
  );
};

// 3. Floating Background Icons
const ParallaxIcon = ({ index, icons, scrollY }: { index: number, icons: any[], scrollY: any }) => {
  const config = useMemo(() => {
    const Icon = icons[index % icons.length];
    const randomX = Math.random() * 100;
    const randomY = Math.random() * 100;
    const size = 16 + Math.random() * 24;
    const parallaxSpeed = 0.05 + Math.random() * 0.2;
    const direction = index % 2 === 0 ? 1 : -1;
    const duration = 10 + Math.random() * 10;
    return { Icon, randomX, randomY, size, parallaxSpeed, direction, duration };
  }, [index, icons]);

  const yOffset = useTransform(scrollY, [0, 2000], [0, 2000 * config.parallaxSpeed * config.direction]);

  return (
    <motion.div
      className="absolute text-blue-900/20 mix-blend-multiply"
      style={{
        left: `${config.randomX}%`,
        top: `${config.randomY}%`,
        y: yOffset
      }}
      animate={{ rotate: [0, 15, -15, 0] }}
      transition={{ repeat: Infinity, duration: config.duration, ease: "easeInOut" }}
    >
      <config.Icon size={config.size} strokeWidth={2} />
    </motion.div>
  );
};

const BackgroundIcons = () => {
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const icons = [Brain, Zap, Orbit, Globe, MonitorSmartphone, Code, Cpu, Lightbulb, Github, MapPin, ChartSpline, Sparkles, Star, Heart, MessageCircle, Music3, Disc, Play];

  return (
    <div className="fixed inset-0 pointer-events-none z-[0] overflow-hidden">
      {[...Array(40)].map((_, i) => (
        <ParallaxIcon key={i} index={i} icons={icons} scrollY={scrollY} />
      ))}
    </div>
  );
};

// 4. Staggered Animated Title
const AnimatedTitle = ({ scrollY }: { scrollY: any }) => {
  const lines = ["MEMBER INFO", "HUB"];
  const yOffset = useTransform(scrollY, [0, 500], [0, 200]);
  const opacityOffset = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <motion.div style={{ y: yOffset, opacity: opacityOffset }} className="flex flex-col items-center gap-y-3 mb-8 mt-4 z-10 relative">
      {lines.map((line, lIdx) => (
        <div key={lIdx} className="flex overflow-hidden py-1">
          <motion.div
            initial={{ y: "150%" }}
            animate={{ y: 0 }}
            transition={{
              duration: 0.8,
              delay: lIdx * 0.15,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="bg-gradient-to-r from-[#55A1FF] to-[#AA83F7] border border-white/20 px-8 py-3 md:px-12 md:py-4 shadow-xl flex items-center justify-center"
          >
            <span
              className={`${syne.className} text-[3.2rem] md:text-[5.5rem] lg:text-[7rem] font-[800] text-white uppercase leading-none tracking-tighter`}
            >
              {line}
            </span>
          </motion.div>
        </div>
      ))}
    </motion.div>
  );
};

// 4.1 Global Footer & Back to top
const BackToTop = () => {
  const { scrollY } = useScroll();
  const [isVisible, setIsVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsVisible(latest > 500);
  });

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-white text-slate-800 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

const Footer = () => (
  <footer className="w-full bg-slate-900 text-white pb-12 pt-16 px-6 mt-12 relative z-10 overflow-hidden">
    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
    <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-inner">
            <Sparkles className="w-4 h-4 text-slate-900" />
          </div>
          <span className={`${syne.className} font-[800] text-xl tracking-tight text-white`}>xOS</span>
        </div>
        <p className="text-slate-400 text-sm max-w-sm mb-6 leading-relaxed">Single source of truth for Project X.<br />Everything you need to connect and build.</p>
      </div>
      <div>
        <h4 className="font-bold mb-4 uppercase tracking-wider text-sm text-slate-300">Quick Links</h4>
        <ul className="space-y-2 text-sm text-slate-400">
          <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Member Hub</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Events</a></li>
          <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-4 uppercase tracking-wider text-sm text-slate-300">Stay Connected</h4>
        <div className="flex gap-3 mb-6">
          <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"><Facebook size={18} /></a>
          <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"><Linkedin size={18} /></a>
          <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"><Github size={18} /></a>
        </div>
      </div>
    </div>
    <div className="max-w-[1400px] mx-auto mt-16 pt-8 border-t border-white/10 text-center flex items-center justify-center">
      <p className="text-slate-500 text-sm">© {new Date().getFullYear()} xOS Core Team. All rights reserved.</p>
    </div>
  </footer>
);

// 5. 3D Tilted Member Card (Instagram Style) using @react-bits/TiltedCard
const TiltedCard = ({ member, onClick, styleProps }: { member: Member; onClick: () => void; styleProps: any }) => {
  return (
    <motion.div
      style={styleProps}
      whileHover={{ zIndex: 10 }}
      className="relative w-full h-full"
    >
      <div onClick={onClick} className="h-full w-full block">
        <ReactBitsTiltedCard
          imageSrc=""
          containerHeight="100%"
          containerWidth="100%"
          imageHeight="100%"
          imageWidth="100%"
          rotateAmplitude={12}
          scaleOnHover={1.05}
          showTooltip={false}
          displayOverlayContent={false}
        >
          <div className="group relative w-full rounded-[16px] bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgb(59,130,246,0.15)] transition-all cursor-pointer flex flex-col overflow-hidden h-full">
            {/* Instagram Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 bg-white">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                  <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <span className={`${syne.className} text-[15px] font-[800] text-slate-800 tracking-tight`}>{member.name}</span>
              </div>
              <div className="flex gap-[3px] opacity-40 px-1">
                <div className="w-1 h-1 bg-slate-800 rounded-full" />
                <div className="w-1 h-1 bg-slate-800 rounded-full" />
                <div className="w-1 h-1 bg-slate-800 rounded-full" />
              </div>
            </div>

            {/* Main Square Photo */}
            <div className="w-full aspect-square bg-slate-100 relative overflow-hidden">
              <img
                src={member.photo}
                alt={member.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-full text-[10px] font-bold text-slate-800 shadow-sm flex items-center gap-1.5">
                Open Profile <ExternalLink size={12} />
              </div>
            </div>

            {/* Footer (Likes & Caption) */}
            <div className="p-3.5 bg-white flex-1 flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-2.5">
                <Heart className="w-[22px] h-[22px] text-slate-800" strokeWidth={1.5} />
                <MessageCircle className="w-[22px] h-[22px] text-slate-800" strokeWidth={1.5} />
                <Zap className="w-[22px] h-[22px] text-blue-500/50 hover:text-blue-500 transition-colors ml-auto" strokeWidth={1.5} />
              </div>

              <div>
                <p className="text-[12px] font-extrabold text-slate-900 mb-[3px] uppercase tracking-wide">
                  {member.role} — {member.department}
                </p>
                <p className="text-[13px] text-slate-800 leading-snug line-clamp-2">
                  <span className="font-bold mr-[6px]">{member.name}</span>
                  "{member.quote}"
                </p>
              </div>
            </div>
          </div>
        </ReactBitsTiltedCard>
      </div>
    </motion.div>
  );
};

// 6. Marquee Loop
const SkillLoop = ({ skills }: { skills: string[] }) => {
  return (
    <div className="overflow-hidden whitespace-nowrap relative rounded-xl bg-[#EFF6FF] py-3 border border-blue-100">
      <div className="absolute left-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-r from-[#EFF6FF] to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-l from-[#EFF6FF] to-transparent" />

      <motion.div
        className="inline-flex gap-2 px-4"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 15 }}
      >
        {[...skills, ...skills, ...skills].map((skill, idx) => (
          <span key={idx} className="bg-white text-blue-800 text-xs px-3 py-1.5 rounded-full border border-blue-100 shadow-sm inline-flex items-center gap-1.5 font-medium">
            {idx === skills.length - 1 ? <Zap size={12} className="text-orange-400" /> : <CheckMiniIcon />}
            {skill}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
const CheckMiniIcon = () => <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />

// 7. Music Widget
const MusicWidget = ({ song, url }: { song: string, url: string }) => {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-blue-100 shadow-sm mt-4">
      <motion.div
        className="relative w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center border-4 border-zinc-800 shrink-0 cursor-pointer shadow-inner"
        animate={{ rotate: playing ? 360 : 0 }}
        transition={{ repeat: playing ? Infinity : 0, duration: 2, ease: "linear" }}
        onClick={() => setPlaying(!playing)}
      >
        {/* Record Grooves */}
        <div className="absolute inset-1 rounded-full border border-zinc-700/50" />
        <div className="absolute inset-2 rounded-full border border-zinc-700/50" />
        {/* Label center */}
        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center z-10">
          <div className="w-1 h-1 bg-white rounded-full" />
        </div>
      </motion.div>
      <div className="overflow-hidden flex-1">
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Vibe Check</p>
        <p className="text-sm font-semibold text-slate-800 truncate">{song}</p>
      </div>
      <a href={url} target="_blank" rel="noreferrer" className="shrink-0 w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex flex-col items-center justify-center hover:bg-blue-100 transition-colors">
        <Play size={12} className="ml-0.5" />
      </a>
    </div>
  )
}


// 8. Section components for Modal
const SectionTitle = ({ icon: Icon, title }: { icon: any, title: string }) => (
  <h3 className={`${syne.className} text-lg font-bold text-[#1A2B47] flex items-center gap-2 mb-3`}>
    <Icon className="text-blue-500 w-5 h-5" /> {title}
  </h3>
);


const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } } };

// 9. Modal
const MemberDetailsModal = ({ member, onClose }: { member: Member | null; onClose: () => void }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ currentTarget, clientX, clientY }: React.MouseEvent) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const spotlightMain = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(255, 255, 255, 0.4), transparent 80%)`;
  const spotlightBlueOverlay = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(46,144,255,0.15), transparent 80%)`;
  const spotlightPurpleOverlay = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(160,100,255,0.25), transparent 80%)`;
  const spotlightWhiteOverlay = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.8), transparent 80%)`;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', handleEsc);
    if (member) document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    }
  }, [member, onClose]);

  if (!member) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] grid place-items-center sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-[1200px] h-[100dvh] sm:h-[90vh] bg-white sm:rounded-[40px] overflow-hidden shadow-2xl flex flex-col z-10 border border-slate-100"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/80 backdrop-blur border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-sm"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col md:flex-row h-full w-full overflow-hidden">
            {/* LEFT COLUMN: Fixed Info & Photo & Connect */}
            <div className="w-full md:w-[38%] lg:w-[35%] bg-[#F4F7FB] p-6 md:p-8 lg:p-10 shrink-0 border-r border-slate-200 flex flex-col relative md:overflow-hidden">
              {/* Pattern overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }} />

              <div className="relative z-10 flex-1 flex flex-col h-full">
                <div className="aspect-[4/5] w-full max-w-[280px] lg:max-w-[320px] mx-auto rounded-3xl overflow-hidden shadow-xl mb-4 lg:mb-6 border-4 border-white rotation-[-2deg] max-h-[340px]">
                  <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                </div>

                <div className="text-center md:text-left mb-4 lg:mb-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full text-xs font-bold text-blue-600 border border-blue-100 shadow-sm mb-3">
                    <BadgeCheck size={14} className="text-blue-500" />
                    {member.generation}
                  </div>
                  <h2 className={`${syne.className} text-3xl lg:text-4xl font-extrabold text-[#1A2B47] leading-tight mb-1.5 tracking-tight`}>
                    {member.name}
                  </h2>
                  <p className="text-slate-600 font-medium flex items-center justify-center md:justify-start gap-1.5 text-sm">
                    <Globe size={14} className="opacity-60" /> {member.university} • {member.major}
                  </p>
                </div>

                <MusicWidget song={member.profileThemeSong} url={member.youtubeMusicLink} />

                <div className="mt-4 lg:mt-6">
                  <p className="text-[11px] uppercase font-bold text-slate-400 mb-2 tracking-wider flex items-center gap-1">
                    <MessageCircle size={14} /> A quote I live by
                  </p>
                  <p className="text-slate-700 italic text-base lg:text-lg leading-relaxed font-serif relative">
                    <span className="absolute -left-3 -top-2 text-3xl opacity-20 text-blue-500 font-serif">"</span>
                    {member.quote}
                  </p>
                </div>

                {/* Section B: Contact (MOVED HERE) */}
                <div className="mt-6 md:mt-auto pt-4 lg:pt-6">
                  <SectionTitle icon={MapPin} title="Let's Connect" />
                  <div className="flex flex-wrap gap-2.5">
                    {member.personalWebsite && (
                      <a href={member.personalWebsite} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-slate-800 hover:-translate-y-0.5 transition-all">
                        <Globe size={16} /> Personal Site
                      </a>
                    )}
                    <a href={member.linkedin} target="_blank" rel="noreferrer" className="w-11 h-11 bg-white border border-slate-200 text-blue-600 rounded-xl flex items-center justify-center shadow-sm hover:border-blue-400 hover:-translate-y-0.5 transition-all">
                      <Linkedin size={20} />
                    </a>
                    <a href={member.github} target="_blank" rel="noreferrer" className="w-11 h-11 bg-white border border-slate-200 text-slate-800 rounded-xl flex items-center justify-center shadow-sm hover:border-slate-800 hover:-translate-y-0.5 transition-all">
                      <Github size={20} />
                    </a>
                    <a href={member.facebook} target="_blank" rel="noreferrer" className="w-11 h-11 bg-white border border-slate-200 text-blue-500 rounded-xl flex items-center justify-center shadow-sm hover:border-blue-400 hover:-translate-y-0.5 transition-all">
                      <Facebook size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Details Scroll */}
            <div 
              className="w-full md:w-[62%] lg:w-[65%] p-6 md:p-8 relative overflow-y-auto custom-scrollbar bg-slate-50/50 group/bento"
              onMouseMove={handleMouseMove}
            >
              {/* MAGIC BACKGROUND SPOTLIGHT OVERLAY */}
              <motion.div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover/bento:opacity-100 z-50 mix-blend-soft-light"
                style={{ background: spotlightMain }}
              />

              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 gap-5 auto-rows-min pb-8 w-full max-w-full relative z-10"
              >
                
                {/* Khối 1: Identity */}
                <motion.section variants={itemVariants} className="col-span-1 md:col-span-2 bg-white rounded-3xl p-6 lg:p-8 border border-slate-200 shadow-sm relative overflow-hidden group/card">
                  <motion.div
                    className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover/card:opacity-100 mix-blend-soft-light"
                    style={{ background: spotlightBlueOverlay }}
                  />
                  <SectionTitle icon={Sparkles} title="Identity" />
                  <div className="space-y-6 mt-4 relative z-10">
                    <div>
                      <p className="text-xs text-slate-500 font-bold mb-2 uppercase tracking-wider">Who I dream of becoming one day:</p>
                      <p className="text-slate-800 text-[15px] md:text-base font-medium leading-relaxed">{member.futureDream}</p>
                    </div>
                    <div className="h-px w-full bg-slate-100" />
                    <div>
                      <p className="text-xs text-slate-500 font-bold mb-3 uppercase tracking-wider">3 core values I live towards:</p>
                      <div className="flex flex-wrap gap-2.5">
                        {member.coreValues.map((v, i) => (
                          <motion.span 
                            key={i} 
                            whileHover={{ scale: 1.05, rotate: 1 }}
                            className="px-4 py-1.5 bg-orange-50 text-orange-600 rounded-full text-xs font-bold border border-orange-100 shadow-sm cursor-default"
                          >
                            {v}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.section>

                {/* Khối 2: Expertise */}
                <motion.section variants={itemVariants} className="col-span-1 md:col-span-2 bg-white rounded-3xl p-6 lg:p-8 border border-slate-200 shadow-sm overflow-hidden relative group/card">
                  <motion.div className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover/card:opacity-100 mix-blend-soft-light" style={{ background: spotlightBlueOverlay }} />
                  <SectionTitle icon={Zap} title="Expertise" />
                  <div className="space-y-6 mt-4 relative z-10">
                    <div>
                      <p className="text-xs text-slate-500 font-bold mb-3 uppercase tracking-wider">What people usually ask me for help with:</p>
                      <div className="-mx-6 lg:-mx-8">
                        <SkillLoop skills={member.skillsHelpWith} />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold mb-2 uppercase tracking-wider">30-min talk with zero prep</p>
                      <div className="bg-blue-50/70 rounded-2xl p-4 border border-blue-100/50">
                        <p className="text-blue-900 text-[15px] font-semibold">{member.thirtyMinTalkTopic}</p>
                      </div>
                    </div>
                  </div>
                </motion.section>

                {/* Khối 3: Professional */}
                <motion.section variants={itemVariants} className="col-span-1 md:col-span-2 bg-white rounded-3xl p-6 lg:p-8 border border-slate-200 shadow-sm relative group/card">
                  <motion.div className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover/card:opacity-100 mix-blend-soft-light" style={{ background: spotlightBlueOverlay }} />
                  <SectionTitle icon={Clock} title="Professional" />
                  <div className="grid sm:grid-cols-3 gap-4 lg:gap-6 mt-4 relative z-10">
                    <div className="space-y-3">
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100 pb-2">Work Experience</p>
                      <div className="space-y-2.5">
                        {member.workExperience.map((we, i) => (
                          <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-sm text-slate-700 font-medium shadow-sm">
                            {we}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100 pb-2">Orgs / Quests</p>
                      <div className="space-y-2.5">
                        {member.sideQuests.map((sa, i) => (
                          <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-sm text-slate-700 font-medium shadow-sm">
                            {sa}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100 pb-2">Courses</p>
                      <div className="space-y-2.5">
                        {member.courses.map((cr, i) => (
                          <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-sm text-slate-700 font-medium shadow-sm">
                            {cr}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.section>

                {/* Khối 4: Current Pulse */}
                <motion.section variants={itemVariants} className="col-span-1 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between relative group/card">
                  <motion.div className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover/card:opacity-100 mix-blend-soft-light" style={{ background: spotlightBlueOverlay }} />
                  <SectionTitle icon={Orbit} title="Current Pulse" />
                  <div className="space-y-5 mt-4 flex-1 flex flex-col justify-center relative z-10">
                    <div>
                      <p className="text-[11px] font-bold text-blue-500 uppercase tracking-widest mb-2 flex items-center gap-1.5"><MonitorSmartphone size={14}/> Building / Exploring</p>
                      <p className="text-[15px] font-semibold text-slate-800 leading-snug">{member.currentFocus}</p>
                    </div>
                    <div className="h-px w-full bg-slate-100" />
                    <div>
                      <p className="text-[11px] font-bold text-red-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Heart size={14}/> Obsession</p>
                      <p className="text-[15px] font-semibold text-slate-800 leading-snug">{member.obsession}</p>
                    </div>
                  </div>
                </motion.section>

                {/* Khối 5: Personal Bits */}
                <motion.section variants={itemVariants} className="col-span-1 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-3xl p-6 border border-indigo-100/50 shadow-sm flex flex-col justify-between relative overflow-hidden group/card">
                  <motion.div className="pointer-events-none absolute z-20 -inset-px opacity-0 transition duration-300 group-hover/card:opacity-100 mix-blend-color-burn" style={{ background: spotlightPurpleOverlay }} />
                  <Lightbulb className="absolute -right-4 -bottom-4 w-32 h-32 text-indigo-200/40 pointer-events-none" />
                  <div className="relative z-10 flex flex-col h-full">
                    <SectionTitle icon={Search} title="Personal Bits" />
                    <div className="space-y-5 mt-4 flex-1 flex flex-col justify-center">
                      <div>
                        <p className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest mb-2">When nobody is watching</p>
                        <p className="text-[15px] font-semibold text-slate-800 leading-snug">{member.doingWhenNobodyWatching}</p>
                      </div>
                      <div className="h-px w-full bg-indigo-100/50" />
                      <div>
                        <p className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest mb-2">Hidden Gem Tool</p>
                        <p className="text-[15px] font-semibold text-slate-800 leading-snug">{member.hiddenGemTool}</p>
                      </div>
                    </div>
                  </div>
                </motion.section>

                {/* Khối 6: Gallery */}
                <motion.section variants={itemVariants} className="col-span-1 md:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[300px] flex items-center justify-center relative group p-2 mt-4 group/card">
                  <motion.div className="pointer-events-none absolute z-20 -inset-px opacity-0 transition duration-300 group-hover/card:opacity-100 mix-blend-soft-light" style={{ background: spotlightWhiteOverlay }} />
                  <div className="w-full h-[320px] rounded-2xl overflow-hidden relative">
                    {member.galleryImage ? (
                      <>
                        <img src={member.galleryImage} alt="Gallery" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                          <p className="text-white font-bold text-lg">One moment that represents me.</p>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center gap-3">
                         <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                           <Lightbulb size={24} className="text-slate-300" />
                         </div>
                         <span className="font-medium text-sm text-slate-400">No representative moment uploaded</span>
                      </div>
                    )}
                  </div>
                </motion.section>

              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// --- MAIN PAGE ---
export default function Page() {
  const [search, setSearch] = useState("");
  const [activeDept, setActiveDept] = useState<Department | "All">("All");
  const [activeGen, setActiveGen] = useState<Generation>("Gen 2026");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);

  const { scrollY } = useScroll();

  // Filter membes
  const filtered = useMemo(() => {
    return MOCK_MEMBERS.filter(m => {
      const matchDep = activeDept === "All" || m.department === activeDept;
      const matchGen = m.generation === activeGen;
      const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.role.toLowerCase().includes(search.toLowerCase());
      return matchDep && matchGen && matchSearch;
    });
  }, [search, activeDept, activeGen]);

  const displayedMembers = useMemo(() => {
    return filtered.slice(0, visibleCount);
  }, [filtered, visibleCount]);

  return (
    <main className={`${inter.className} min-h-screen relative overflow-x-hidden selection:bg-blue-300 selection:text-blue-900`}>
      <GlobalSparks />
      <Navbar />
      <BackgroundIcons />

      {/* --- BACKGROUND SKY GRADIENT --- */}
      {/* Replicating the "over-stimulated" / bright youthful sky aesthetic */}
      <div className="fixed inset-0 -z-50 bg-[#7BC1FF]">
        {/* Soft clouds and hue blending */}
        <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-[#4BA1FF] to-transparent opacity-50" />
        <div className="absolute top-1/4 left-[-10%] w-[600px] h-[600px] bg-[#FFDEB3] rounded-full blur-[100px] opacity-80 mix-blend-screen" />
        <div className="absolute top-1/3 right-[-5%] w-[500px] h-[500px] bg-[#FFBEE2] rounded-full blur-[100px] opacity-70 mix-blend-screen" />
        <div className="absolute bottom-0 left-0 right-0 h-[50vh] bg-white rounded-t-[100px] blur-[80px]" />
      </div>

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-8 px-6 relative z-10 flex flex-col items-center justify-center text-center !min-h-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="relative"
        >
          <AnimatedTitle scrollY={scrollY} />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-slate-700 font-medium text-lg md:text-xl max-w-xl mx-auto px-6 mt-4 bg-white/40 backdrop-blur-md p-4 rounded-3xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
          >
            Not just a directory - it’s where you find your people. Skills, vibes, and future teammates - all in one place.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })}
            className="mt-6 px-8 py-3.5 bg-gradient-to-r from-[#55A1FF] to-[#AA83F7] hover:opacity-90 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all inline-flex items-center justify-center"
          >
            Meet the crew &rarr;
          </motion.button>
        </motion.div>
      </section>

      {/* --- STICKY CONTROLS --- */}
      <div className="sticky top-20 z-40 pb-8 pt-4 px-6 flex flex-col items-center relative pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="w-full max-w-2xl bg-white/70 backdrop-blur-xl p-2 rounded-[2rem] shadow-lg border border-white/50 flex flex-col sm:flex-row gap-2 transition-all hover:bg-white/90"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search talents, names..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-white/80 focus:bg-white rounded-full text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-400 font-medium transition-colors"
            />
          </div>
          <div className="flex bg-white/80 rounded-full p-1 border border-slate-100 shadow-inner">
            {GENERATIONS.map(gen => (
              <button
                key={gen}
                onClick={() => setActiveGen(gen)}
                className={`px-6 h-10 rounded-full text-sm font-bold transition-all ${activeGen === gen ? "bg-[#55A1FF] text-white shadow-md" : "text-slate-500 hover:text-slate-800"
                  }`}
              >
                {gen}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-2 mt-4"
        >
          {DEPARTMENTS.map(dept => (
            <button
              key={dept}
              onClick={() => setActiveDept(dept)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-transform active:scale-95 border ${activeDept === dept
                ? "bg-slate-900 text-white border-slate-900 shadow-md"
                : "bg-white/80 text-slate-600 border-white/50 hover:bg-white backdrop-blur-md"
                }`}
            >
              {dept}
            </button>
          ))}
        </motion.div>
      </div>

      {/* --- GRID EXPERIMENT --- */}
    <section className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-8 pb-32 pt-8 flex flex-col items-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 w-full">
          <AnimatePresence mode="popLayout">
            {displayedMembers.map((member, i) => (
              <motion.div
                key={member.id}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 80 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 40 }}
                viewport={{ once: true, margin: "0px 0px -50px 0px" }}
                transition={{
                  duration: 0.6,
                  delay: (i % 4) * 0.1, // Stagger effect from left to right
                  type: "spring", stiffness: 250, damping: 25
                }}
                className="w-full h-full"
              >
                <TiltedCard
                  member={member}
                  onClick={() => setSelectedMember(member)}
                  styleProps={{}}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {filtered.length > displayedMembers.length && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setVisibleCount(prev => prev + 12)}
            className="mt-16 px-8 py-3 bg-white/80 backdrop-blur text-blue-600 font-bold rounded-full border border-blue-200 shadow-sm hover:bg-white hover:shadow flex items-center justify-center gap-2"
          >
            Load More Talents <ArrowUp className="rotate-180" size={16} />
          </motion.button>
        )}

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 w-full"
          >
            <p className="text-blue-900 font-bold text-2xl mb-2">Nobody's home!</p>
            <p className="text-blue-800/80 font-medium">There's no data for {activeGen} yet (or maybe try a different search).</p>
          </motion.div>
        )}
      </section>

      <Footer />
      <BackToTop />
      {/* --- MODAL --- */}
      <MemberDetailsModal member={selectedMember} onClose={() => setSelectedMember(null)} />
    </main>
  );
}
