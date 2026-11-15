/** @type {import('tailwindcss').Config} */
// Design system: black + white + violet, with yellow as the single accent for buttons.
// Change colours here, never as one-off hex values in the HTML.
module.exports = {
  content: ["./*.html", "./js/**/*.js"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0a",        // black
        surface: "#141414",   // slightly lifted black for alternating sections / cards
        line: "#2a2a2a",      // borders
        violet: "#8b5cf6",    // headings, stats, highlights on black
        brand: "#7c3aed",     // violet fills (white text on top)
        gold: "#f5bf34",      // buttons / key accent
        "on-gold": "#1a1300", // text on gold buttons
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
