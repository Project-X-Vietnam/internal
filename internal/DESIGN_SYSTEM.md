# PROJECT X VIETNAM — UI DESIGN SYSTEM
## Version 1.0 | Internal Reference Document

> **Purpose:** This document serves as the comprehensive UI/UX style guide for all Project X Vietnam digital products. Use this to ensure visual consistency across the internal platform and any new interfaces.

---

# TABLE OF CONTENTS

1. [Design Principles](#1-design-principles)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Spacing & Layout](#4-spacing--layout)
5. [Components](#5-components)
6. [Animations & Motion](#6-animations--motion)
7. [Dark Mode](#7-dark-mode)
8. [Iconography](#8-iconography)
9. [Imagery & Assets](#9-imagery--assets)
10. [Technical Implementation](#10-technical-implementation)
11. [Code Patterns](#11-code-patterns)
12. [Accessibility](#12-accessibility)

---

# 1. DESIGN PRINCIPLES

## 1.1 Core Design Philosophy

| Principle | Description |
|-----------|-------------|
| **Professional yet Approachable** | Modern, clean aesthetic that feels credible without being corporate or cold |
| **Aspirational** | Design that inspires action and conveys possibility |
| **Community-Driven** | Warm, inclusive visuals that emphasize belonging |
| **Action-Oriented** | Clear visual hierarchy guiding users toward CTAs |

## 1.2 Visual Identity Keywords

- **Trust** — Blue primary color conveys reliability
- **Innovation** — Cyan accents signal freshness and tech-forward thinking
- **Premium** — Deep navy backgrounds add sophistication
- **Energy** — Gradient animations bring dynamism

## 1.3 Design Tenets

1. **Clarity over cleverness** — Every element serves a purpose
2. **Consistency breeds familiarity** — Reuse established patterns
3. **Whitespace is intentional** — Generous spacing creates breathing room
4. **Animations enhance, never distract** — Motion should feel natural and purposeful
5. **Dark mode is not an afterthought** — Design for both themes from the start

---

# 2. COLOR SYSTEM

## 2.1 Brand Colors

### Primary Palette

| Color | Name | Hex | HSL | Usage |
|-------|------|-----|-----|-------|
| 🔵 | **Primary Blue** | `#0E56FA` | `222 96% 52%` | Primary actions, links, key highlights |
| 🔷 | **Secondary Cyan** | `#17CAFA` / `#00D1FF` | `193 96% 54%` | Secondary accents, gradients, hover states |
| ⬛ | **Dark Navy** | `#020818` / `#01001F` | `242 97% 6%` | Dark mode backgrounds, text |
| ⬜ | **Light Background** | `#FAFBFF` | `222 40% 98%` | Light mode subtle backgrounds |
| 🟦 | **Accent Blend** | Between Primary & Cyan | `207 96% 53%` | Gradient midpoints |

### Semantic Colors

| Purpose | Light Mode | Dark Mode |
|---------|------------|-----------|
| **Background** | `#FFFFFF` | `#020818` |
| **Foreground/Text** | `#01001F` | `#FAFAFA` |
| **Card** | `#FFFFFF` | `hsla(242, 80%, 10%)` |
| **Muted** | `hsla(222, 20%, 96%)` | `hsla(242, 15%, 15%)` |
| **Muted Foreground** | `hsla(222, 10%, 45%)` | `hsla(222, 10%, 60%)` |
| **Border** | `hsla(222, 13%, 91%)` | `hsla(242, 15%, 20%)` |
| **Destructive** | `hsla(0, 84%, 60%)` | `hsla(0, 63%, 31%)` |

### CSS Variables (Root)

```css
:root {
  /* Primary: #0E56FA - Vibrant Blue */
  --primary: 222 96% 52%;
  --primary-foreground: 0 0% 100%;
  
  /* Secondary: #17CAFA - Bright Cyan */
  --secondary: 193 96% 54%;
  --secondary-foreground: 242 97% 6%;
  
  /* Custom PJX tokens */
  --pxv-cyan: 193 96% 54%;
  --pxv-blue: 222 96% 52%;
  --pxv-dark: 242 97% 6%;
  --pxv-light: 222 40% 98%;
  
  /* Accent - Blend of primary and secondary */
  --accent: 207 96% 53%;
  --accent-foreground: 0 0% 100%;
  
  --muted: 222 20% 96%;
  --muted-foreground: 222 10% 45%;
  --destructive: 0 84.2% 60.2%;
  --border: 222 13% 91%;
  --input: 222 13% 91%;
  --ring: 222 96% 52%;
  --radius: 0.75rem;
}
```

## 2.2 Gradients

### Brand Gradient (Primary)

```css
/* Text gradient */
background-image: linear-gradient(to right, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--secondary)));
-webkit-background-clip: text;
background-clip: text;
color: transparent;

/* Animated gradient background */
background-size: 200% 200%;
animation: gradient-x 3s ease infinite;
```

### Background Gradients

| Name | CSS | Usage |
|------|-----|-------|
| **Hero Light** | `linear-gradient(to br, slate-50, white, primary/5)` | Light mode hero backgrounds |
| **Hero Dark** | `radial-gradient(ellipse at center, rgba(14,86,250,0.15), transparent 70%)` | Dark mode hero glow |
| **CTA Section** | `linear-gradient(135deg, #0a0f1a, #0a1a4a, #0E56FA)` | Final CTA sections |

## 2.3 Color Application Rules

### ✅ DO

- Use `primary` for main CTAs and interactive elements
- Apply gradients sparingly for emphasis
- Maintain 4.5:1 contrast ratio for text
- Use semantic colors for consistency

### ❌ DON'T

- Mix too many accent colors in one section
- Use pure black (`#000`) — use Dark Navy instead
- Override theme colors inline without good reason

---

# 3. TYPOGRAPHY

## 3.1 Font Families

| Role | Font | Fallback Stack |
|------|------|----------------|
| **Primary** | SF Pro Display | `-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif` |
| **Secondary** | Plus Jakarta Sans | (backup for SF Pro Display) |

### Font Loading

```css
@font-face {
  font-family: 'SF Pro Display';
  src: url('/fonts/SFProDisplay/SFPRODISPLAYREGULAR.OTF') format('opentype');
  font-weight: 400;
  font-display: swap;
}
/* Available weights: 400, 500, 700 */

@font-face {
  font-family: 'Plus Jakarta Sans';
  src: url('/fonts/PlusJakartaSans/PlusJakartaSans-Regular.ttf') format('truetype');
  font-weight: 400;
  font-display: swap;
}
/* Available weights: 300, 400, 500, 600, 700, 800 */
```

## 3.2 Type Scale

| Element | Size (Desktop) | Size (Mobile) | Weight | Line Height | Tailwind Classes |
|---------|---------------|---------------|--------|-------------|------------------|
| **H1 - Hero** | 72px / 4.5rem | 36px / 2.25rem | 700 (Bold) | 1.1 | `text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1]` |
| **H2 - Section** | 48px / 3rem | 30px / 1.875rem | 700 (Bold) | 1.2 | `text-3xl md:text-4xl lg:text-5xl font-bold leading-tight` |
| **H3 - Subsection** | 32px / 2rem | 24px / 1.5rem | 600-700 | 1.3 | `text-xl md:text-2xl font-bold` |
| **H4 - Card Title** | 20px / 1.25rem | 18px / 1.125rem | 600 | 1.4 | `text-lg font-semibold` |
| **Body Large** | 18px / 1.125rem | 16px / 1rem | 400 | 1.6 | `text-base md:text-lg leading-relaxed` |
| **Body** | 16px / 1rem | 14px / 0.875rem | 400 | 1.5 | `text-sm md:text-base` |
| **Small/Caption** | 14px / 0.875rem | 12px / 0.75rem | 500 | 1.4 | `text-xs md:text-sm font-medium` |
| **Micro** | 12px | 11px | 500 | 1.3 | `text-xs` |

## 3.3 Text Colors

| Context | Light Mode | Dark Mode |
|---------|------------|-----------|
| **Primary Text** | `text-pxv-dark` | `text-white` |
| **Secondary Text** | `text-slate-600` | `text-white/60` |
| **Muted Text** | `text-slate-400` / `text-slate-500` | `text-white/40` / `text-white/50` |
| **Accent Text** | `text-primary` | `text-primary` |
| **Section Label** | `text-primary text-sm font-bold uppercase tracking-widest` | Same |

## 3.4 Text Styling Patterns

### Section Headers

```jsx
<p className="text-sm font-bold text-primary uppercase tracking-widest mb-4">
  Section Label
</p>
<h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold leading-tight ${
  isDark ? "text-white" : "text-pxv-dark"
}`}>
  Your headline with <span className="text-primary">highlighted</span> word
</h2>
```

### Gradient Text

```jsx
<span className="bg-gradient-to-r from-primary via-pxv-cyan to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-x">
  Animated Gradient Text
</span>
```

---

# 4. SPACING & LAYOUT

## 4.1 Spacing Scale

We use Tailwind's default spacing scale. Key values:

| Token | Value | Usage |
|-------|-------|-------|
| `1` | 4px | Micro spacing, icon gaps |
| `2` | 8px | Tight element spacing |
| `3` | 12px | Small component padding |
| `4` | 16px | Standard gaps, padding |
| `5` | 20px | Card internal padding |
| `6` | 24px | Section element gaps |
| `8` | 32px | Component separation |
| `12` | 48px | Large section gaps |
| `16` | 64px | Section vertical padding (mobile) |
| `24` | 96px | Section vertical padding (desktop) |
| `32` | 128px | Hero section padding |

## 4.2 Container Widths

```jsx
// Standard content container
<div className="max-w-6xl mx-auto px-6 md:px-8">

// Narrow content (text-heavy)
<div className="max-w-5xl mx-auto px-6 md:px-8">

// Wide content (hero, full-width)
<div className="max-w-7xl mx-auto px-6 md:px-8">
```

## 4.3 Section Padding

```jsx
// Standard section
<section className="py-24 md:py-32">

// Compact section
<section className="py-12 md:py-16">

// Hero section
<section className="min-h-[100vh] pt-32 md:pt-40 pb-20">
```

## 4.4 Grid Systems

### 2-Column Feature

```jsx
<div className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-start">
  <div className="lg:col-span-5">Left (Navigation/Sidebar)</div>
  <div className="lg:col-span-7">Right (Content)</div>
</div>
```

### 3-Column Cards

```jsx
<div className="grid md:grid-cols-3 gap-6">
  {/* Cards */}
</div>
```

### 4-Column Pillars

```jsx
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Pillar items */}
</div>
```

## 4.5 Border Radius

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| **Base** | 12px | `rounded-lg` | Default component radius |
| **Medium** | 10px | `rounded-md` | Smaller components |
| **Large** | 16px | `rounded-xl` | Cards, panels |
| **XL** | 24px | `rounded-2xl` | Large cards, modals |
| **Full** | 9999px | `rounded-full` | Pills, avatars, badges |

---

# 5. COMPONENTS

## 5.1 Buttons

### Button Variants

```jsx
// Primary (Default)
<Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6">
  Primary Button
</Button>

// Outline
<Button variant="outline" className={`rounded-full px-8 py-6 ${
  isDark
    ? "border-white/20 text-white hover:bg-white/10"
    : "border-slate-200 hover:bg-slate-50"
}`}>
  Outline Button
</Button>

// Ghost
<Button variant="ghost" className="hover:bg-accent hover:text-accent-foreground">
  Ghost Button
</Button>

// Secondary (CTA on primary background)
<Button className="bg-white text-primary hover:bg-white/90">
  Secondary on Primary
</Button>
```

### Button Sizes

| Size | Height | Padding | Class |
|------|--------|---------|-------|
| `sm` | 32px | `px-3` | `size="sm"` |
| `default` | 36px | `px-4 py-2` | — |
| `lg` | 40px+ | `px-8 py-6` | `size="lg"` |
| `icon` | 36px | Square | `size="icon"` |

### Button Styling Rules

- **CTAs**: Always `rounded-full` with generous padding
- **In-content buttons**: `rounded-lg` 
- **Primary actions**: Include arrow icon `→`
- **Hover state**: `hover:scale-[1.02]` for emphasis

## 5.2 Cards

### Standard Card

```jsx
<div className={`rounded-2xl p-6 md:p-8 transition-all ${
  isDark
    ? "bg-white/5 hover:bg-white/10 border border-white/10"
    : "bg-white border border-slate-100 shadow-sm hover:shadow-lg"
}`}>
  {/* Card content */}
</div>
```

### Feature Card (with icon)

```jsx
<div className={`group p-6 rounded-xl text-center transition-all duration-300 ${
  isDark
    ? "bg-white/5 hover:bg-white/10 border border-white/10"
    : "bg-white hover:bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md"
}`}>
  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110 ${
    isDark ? "bg-primary/20 text-primary" : "bg-primary/10 text-primary"
  }`}>
    {/* Icon */}
  </div>
  <h3 className={`font-semibold mb-2 ${isDark ? "text-white" : "text-pxv-dark"}`}>Title</h3>
  <p className={`text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>Description</p>
</div>
```

### Team Member Card

```jsx
<div className={`group relative overflow-hidden rounded-2xl transition-all hover:scale-[1.02] ${
  isDark
    ? "bg-white/5 hover:bg-white/10"
    : "bg-white shadow-sm hover:shadow-lg"
}`}>
  {/* Aspect ratio container for image */}
  <div className="aspect-[10/9] overflow-hidden bg-gradient-to-br from-primary/20 to-pxv-cyan/20">
    <img className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
  </div>
  {/* Info section */}
  <div className={`p-5 ${isDark ? "bg-white/5" : "bg-white"}`}>
    {/* Content */}
  </div>
</div>
```

## 5.3 Form Elements

### Input

```jsx
<Input 
  className="flex h-9 mt-1 w-full rounded-md border border-input bg-white px-3 py-1 text-base shadow-sm transition-colors focus-visible:ring-1 focus-visible:ring-ring"
/>
```

### Textarea

```jsx
<Textarea
  className="flex min-h-[60px] w-full rounded-md border border-input bg-white px-3 py-2 text-base shadow-sm focus-visible:ring-1 focus-visible:ring-ring"
/>
```

### Label

```jsx
<Label className="text-sm font-medium leading-none">
  Field Label
</Label>
```

## 5.4 Badges & Pills

### Status Badge

```jsx
<span className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border backdrop-blur-sm ${
  isDark
    ? "bg-primary/10 border-primary/30"
    : "bg-gradient-to-r from-primary/5 via-pxv-cyan/5 to-primary/5 border-primary/15"
}`}>
  {/* Pulsing dot */}
  <span className="relative flex h-2 w-2 flex-shrink-0">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
  </span>
  <span className="text-sm font-medium text-primary">Badge Text</span>
</span>
```

### Tag/Chip

```jsx
<span className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-all hover:scale-105 ${
  isDark
    ? "bg-white/5 border-white/10 text-white/70 hover:border-primary/50"
    : "bg-white border-slate-200 text-slate-600 hover:border-primary/30 shadow-sm"
}`}>
  Tag Text
</span>
```

### Step Indicator

```jsx
<span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md ${
  isDark 
    ? "bg-white/10 text-white border border-white/20" 
    : "bg-white/80 text-primary border border-white/50 shadow-sm"
}`}>
  Step 1 of 4
</span>
```

## 5.5 Navigation

### Navbar Structure

```jsx
<nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-colors duration-500 ${
  isDark
    ? "bg-[#020818]/80 border-white/10"
    : "bg-white/70 border-slate-100/50"
}`}>
  <div className="max-w-7xl mx-auto px-6 md:px-8 py-2">
    {/* Logo | Nav Links | CTA */}
  </div>
</nav>
```

### Nav Link Styling

```jsx
<Link className={`text-sm transition-colors ${
  isActive
    ? "font-bold text-primary"
    : isDark
      ? "font-medium text-white/60 hover:text-primary"
      : "font-medium text-slate-600 hover:text-primary"
}`}>
```

---

# 6. ANIMATIONS & MOTION

## 6.1 Animation Library

We use **Framer Motion** for React animations.

```jsx
import { motion, AnimatePresence } from "framer-motion";
```

## 6.2 Standard Entrance Animations

### Fade In Up (Most Common)

```jsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5, delay: index * 0.05 }}
>
```

### Fade In (Subtle)

```jsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
```

### Scale In

```jsx
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.5 }}
>
```

### Stagger Children

```jsx
// Parent
transition={{ duration: 0.5, delay: index * 0.1 }}

// Use index from map() for staggered delays
```

## 6.3 CSS Animations (Tailwind)

### Keyframes (tailwind.config.ts)

```js
animation: {
  "fade-in": "fadeIn 0.6s ease-out forwards",
  "fade-in-up": "fadeInUp 0.6s ease-out forwards",
  "scale-in": "scaleIn 0.5s ease-out forwards",
  "float": "float 6s ease-in-out infinite",
  "pulse-glow": "pulseGlow 3s ease-in-out infinite",
  "gradient-x": "gradientX 3s ease infinite",
  "gradient-y": "gradientY 3s ease infinite",
  "bounce-subtle": "bounceSubtle 2s ease-in-out infinite",
},
```

### Gradient Animation

```css
@keyframes gradient-x {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-gradient-x {
  background-size: 200% 200%;
  animation: gradient-x 3s ease infinite;
}
```

### Floating Elements

```css
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-10px) rotate(2deg); }
  50% { transform: translateY(-5px) rotate(0deg); }
  75% { transform: translateY(-15px) rotate(-2deg); }
}

.animate-float { animation: float 6s ease-in-out infinite; }
.animate-float-delayed { animation: float 6s ease-in-out 2s infinite; }
.animate-float-slow { animation: float 8s ease-in-out infinite; }
```

## 6.4 Decorative Animated Elements

### Gradient Orb

```jsx
function GradientOrb({ className, color, delay = 0 }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl ${className}`}
      style={{ background: color }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3],
        x: [0, 30, -20, 0],
        y: [0, -20, 30, 0],
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}
```

### Scroll-based Parallax

```jsx
const { scrollYProgress } = useScroll({
  target: heroRef,
  offset: ["start start", "end start"],
});

const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
```

## 6.5 Transition Standards

| Type | Duration | Easing |
|------|----------|--------|
| **Color/opacity** | 300-500ms | `ease` / `ease-in-out` |
| **Transform (hover)** | 200-300ms | `ease-out` |
| **Page/section entrance** | 500-700ms | `ease-out` |
| **Infinite animations** | 3-8s | `ease-in-out` |
| **Theme switch** | 500ms | `ease` |

### Standard Transition Classes

```css
transition-colors duration-500    /* Theme/color changes */
transition-all duration-300       /* General hover states */
transition-transform duration-500 /* Scale/move on hover */
```

---

# 7. DARK MODE

## 7.1 Implementation Pattern

```jsx
function useDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
    }
  }, []);

  const toggle = () => {
    setIsDark((prev) => {
      const newValue = !prev;
      localStorage.setItem("theme", newValue ? "dark" : "light");
      return newValue;
    });
  };

  return { isDark, toggle };
}
```

## 7.2 Dark Mode Color Mappings

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| **Page background** | `bg-white` | `bg-[#020818]` |
| **Alt section bg** | `bg-slate-50` | `bg-[#0a0f1a]` |
| **Card background** | `bg-white` | `bg-white/5` |
| **Card hover** | `hover:shadow-lg` | `hover:bg-white/10` |
| **Text primary** | `text-pxv-dark` | `text-white` |
| **Text secondary** | `text-slate-600` | `text-white/60` |
| **Text muted** | `text-slate-400` | `text-white/40` |
| **Borders** | `border-slate-100/200` | `border-white/10` |
| **Navbar bg** | `bg-white/70` | `bg-[#020818]/80` |

## 7.3 Conditional Styling Pattern

```jsx
// Standard conditional pattern
className={`base-classes ${
  isDark
    ? "dark-mode-classes"
    : "light-mode-classes"
}`}

// Example
<div className={`p-6 rounded-xl ${
  isDark
    ? "bg-white/5 border border-white/10 text-white"
    : "bg-white border border-slate-100 shadow-sm text-pxv-dark"
}`}>
```

---

# 8. ICONOGRAPHY

## 8.1 Icon Style

- **Type:** Outline/Stroke icons (not filled)
- **Stroke width:** 1.5 - 2px
- **Size:** 16-24px typically
- **Format:** Inline SVG

## 8.2 Common Icon Patterns

```jsx
// Checkmark
<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
</svg>

// Arrow right
<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
</svg>

// LinkedIn (filled)
<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
  <path d="M20.447 20.452h-3.554v-5.569c0-1.328..." />
</svg>
```

## 8.3 Icon Containers

```jsx
// Standard icon container
<div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
  isDark ? "bg-primary/20 text-primary" : "bg-primary/10 text-primary"
}`}>
  {/* Icon */}
</div>

// Small icon button
<button className={`p-2 rounded-lg transition-colors ${
  isDark
    ? "bg-white/10 hover:bg-primary/20 text-white/60 hover:text-primary"
    : "bg-slate-100 hover:bg-primary/10 text-slate-500 hover:text-primary"
}`}>
```

---

# 9. IMAGERY & ASSETS

## 9.1 Image Guidelines

| Type | Aspect Ratio | Treatment |
|------|--------------|-----------|
| **Team photos** | 10:9 | `object-cover object-top` |
| **Hero/section images** | 16:10 | Full bleed with overlay |
| **Logos (partners)** | Various | `grayscale opacity-60` (light), `brightness-0 invert opacity-50` (dark) |
| **Avatar/Profile** | 1:1 | `rounded-full object-cover` |

## 9.2 Image Container Pattern

```jsx
<div className="aspect-[16/10] overflow-hidden rounded-xl">
  <img
    src={imageSrc}
    alt={altText}
    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
  />
</div>
```

## 9.3 Logo Treatment for Partners

```jsx
<img
  src={logo}
  alt={name}
  className={`h-8 max-w-[120px] w-auto object-contain ${
    isDark ? "brightness-0 invert opacity-50" : "opacity-60 grayscale"
  }`}
/>
```

## 9.4 Asset Locations

```
public/
├── favicon.ico
├── favicon.svg
├── preview_icon.png
├── fonts/
│   ├── PlusJakartaSans/
│   └── SFProDisplay/
└── images/
    ├── mentors/
    ├── partners/
    └── team/
```

---

# 10. TECHNICAL IMPLEMENTATION

## 10.1 Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14+ (App Router) |
| **Language** | TypeScript (Strict) |
| **Styling** | Tailwind CSS |
| **Animation** | Framer Motion |
| **UI Components** | shadcn/ui (customized) |
| **Utilities** | clsx, tailwind-merge |

## 10.2 File Structure for Components

```
components/
├── ui/                    # shadcn/ui base components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── label.tsx
│   └── textarea.tsx
├── Navbar.tsx             # Global navigation
├── TeamMemberCard.tsx     # Reusable team card
└── Form.tsx               # Form components
```

## 10.3 Key Utilities

### cn() - Class Name Merger

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Usage

```jsx
<Button className={cn(
  buttonVariants({ variant, size }),
  "custom-override-class",
  className
)} />
```

---

# 11. CODE PATTERNS

## 11.1 Component Structure

```typescript
// 1. "use client" directive if needed
"use client";

// 2. Imports (React, external, internal, types)
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

// 3. Types/interfaces
interface ComponentProps {
  isDark: boolean;
  // ...
}

// 4. Helper components/functions (if small)
function HelperComponent() { /* ... */ }

// 5. Main component
export default function MainComponent({ isDark }: ComponentProps) {
  // State declarations
  const [state, setState] = useState(initialValue);
  
  // Effects
  useEffect(() => {
    // ...
  }, []);
  
  // Handlers
  const handleClick = () => {
    // ...
  };
  
  // Return JSX
  return (
    <div>
      {/* Content */}
    </div>
  );
}
```

## 11.2 Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| **Components** | PascalCase | `TeamMemberCard.tsx` |
| **Non-component files** | kebab-case | `form-submission.ts` |
| **CSS classes** | Tailwind utilities | No custom class names |
| **Variables** | camelCase | `isDarkMode` |
| **Constants** | UPPER_SNAKE_CASE | `API_BASE_URL` |
| **Interfaces/Types** | PascalCase | `TeamMember` |

## 11.3 Style Guidelines

1. Use Tailwind utility classes exclusively (no custom CSS classes)
2. Follow existing color scheme tokens
3. Always maintain dark mode support
4. Use `transition-colors duration-500` for theme switches
5. Responsive: mobile-first with `sm:`, `md:`, `lg:` breakpoints

---

# 12. ACCESSIBILITY

## 12.1 Standards

- **WCAG 2.1 AA** compliance target
- **Color contrast:** Minimum 4.5:1 for body text, 3:1 for large text
- **Focus states:** Visible focus rings using `focus-visible:ring-*`
- **Touch targets:** Minimum 44×44px for interactive elements

## 12.2 Implementation

### Focus States

```jsx
<button className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
```

### Skip Links (if applicable)

```jsx
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to content
</a>
```

### Aria Labels

```jsx
<button aria-label="Toggle dark mode">
<a aria-label={`${name}'s LinkedIn profile`}>
```

### Semantic HTML

- Use proper heading hierarchy (h1 → h2 → h3)
- Use `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>` appropriately
- Use `<button>` for actions, `<a>` for navigation

## 12.3 Interactive States

```jsx
// Button with all states
<Button className="
  bg-primary 
  hover:bg-primary/90 
  focus:ring-2 focus:ring-primary focus:ring-offset-2
  disabled:opacity-50 disabled:pointer-events-none
  transition-all
">
```

---

# APPENDIX: QUICK REFERENCE

## Color Hex Codes

| Name | Hex | Usage |
|------|-----|-------|
| Primary Blue | `#0E56FA` | CTAs, links, accents |
| Secondary Cyan | `#17CAFA` | Secondary highlights |
| Dark Navy | `#020818` | Dark backgrounds |
| Light Background | `#FAFBFF` | Light subtle bg |

## Key Tailwind Classes

```css
/* Theme-aware text */
isDark ? "text-white" : "text-pxv-dark"
isDark ? "text-white/60" : "text-slate-600"

/* Theme-aware backgrounds */
isDark ? "bg-[#020818]" : "bg-white"
isDark ? "bg-white/5" : "bg-white"

/* Theme-aware borders */
isDark ? "border-white/10" : "border-slate-100"

/* Standard section padding */
py-24 md:py-32

/* Standard container */
max-w-6xl mx-auto px-6 md:px-8
```

## Animation Presets

```jsx
// Entrance (Framer Motion)
initial={{ opacity: 0, y: 30 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.5 }}

// CSS gradient animation
className="animate-gradient-x bg-[length:200%_auto]"

// Hover scale
className="hover:scale-[1.02] transition-transform"
```

---

> **Document maintained by:** Product Team  
> **Last updated:** January 2025  
> **Contact:** Product Department or info.projectxvietnam@gmail.com

