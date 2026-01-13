/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pjx: {
          blue: "#0E56FA",  // Vibrant Blue
          cyan: "#17CAFA",  // Bright Cyan
          navy: "#020818",  // Deep Navy
        }
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}