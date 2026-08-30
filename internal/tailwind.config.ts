import type { Config } from "tailwindcss";

const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");
const plugin = require("tailwindcss/plugin");

/**
 * Hover variants that only apply to a real hover-capable pointer.
 *
 * Plain `hover:` / `group-hover:` also fire on touch, where `:hover` sticks to
 * whatever was last tapped until something else is tapped — which is what would
 * otherwise leave the sidebar's hover-revealed labels stuck open after a tap.
 */
const pointerHoverVariants = plugin(({ addVariant }: any) => {
  addVariant("pointer-hover", "@media (hover: hover) { &:hover }");
  addVariant("group-pointer-hover", "@media (hover: hover) { :merge(.group):hover & }");
});

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }: any) {
  const allColors = flattenColorPalette(theme("colors"));
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}

/** @type {import('tailwindcss').Config} */
const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        "border-strong": "hsl(var(--border-strong))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom PXV Colors
        "pxv-cyan": "hsl(var(--pxv-cyan))",
        "pxv-blue": "hsl(var(--pxv-blue))",
        "pxv-dark": "hsl(var(--pxv-dark))",
        "pxv-light": "hsl(var(--pxv-light))",
        pjx: {
          blue: "#0E56FA",
          cyan: "#17CAFA",
          navy: "#020818",
        },
        // THEIA warm theme
        warm: {
          bg: "#F5F0E8",
          surface: "#FAF7F2",
          "surface-dark": "#EDE6D8",
          border: "#E0D5C4",
          "border-dark": "#C9BBAA",
          heading: "#5C3D2E",
          text: "#3D3229",
          "text-muted": "#8B7E72",
          "text-faint": "#B0A898",
          accent: "#C17F3A",
          "accent-light": "#D4A76A",
          success: "#5B8C3F",
          "success-light": "#7BAF5C",
          error: "#C44D3F",
          "error-light": "#D4706A",
          code: "#E8E0D4",
          "code-dark": "#DED4C4",
          input: "#FFFFF8",
          btn: "#5C3D2E",
          "btn-hover": "#7A5545",
        },
      },
      // `--radius` is redefined inside `.portal` (see globals.css), so these
      // three keys resolve near-square on platform surfaces and keep THEIA's
      // softer artifact look everywhere else.
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "var(--radius-sm)",
        // Large media surfaces only — see `--radius-media` in globals.css.
        media: "var(--radius-media)",
      },
      fontFamily: {
        body: ["var(--font-body)", "Inter", "sans-serif"],
        heading: ["var(--font-heading)", "Special Elite", "cursive"],
        sans: ["var(--font-body)", "Inter", "sans-serif"],
        display: ["var(--font-heading)", "Special Elite", "cursive"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      backgroundImage: {
        "gradient-hero-light": "linear-gradient(to bottom, #FFFFFF, #F0F9FF)",
        "gradient-hero-dark": "linear-gradient(to bottom, #020818, #0A0F1A)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.9)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        // Directory gallery tiles. Shorter rise than fade-in-up: a grid of
        // twelve travelling 30px reads as the page settling, not as arrival.
        "tile-in": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "25%": { transform: "translateY(-10px) rotate(2deg)" },
          "50%": { transform: "translateY(-5px) rotate(0deg)" },
          "75%": { transform: "translateY(-15px) rotate(-2deg)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        "gradient-x": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        aurora: {
          from: {
            backgroundPosition: "50% 50%, 50% 50%",
          },
          to: {
            backgroundPosition: "350% 50%, 350% 50%",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "scale-in": "scale-in 0.5s ease-out forwards",
        // `both`, so a staggered delay holds the from-state instead of letting
        // the tile flash in at full opacity before its turn.
        "tile-in": "tile-in 0.5s cubic-bezier(0.22,1,0.36,1) both",
        float: "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 2s infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "gradient-x": "gradient-x 3s ease infinite",
        aurora: "aurora 60s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), addVariablesForColors, pointerHoverVariants],
};
export default config;
