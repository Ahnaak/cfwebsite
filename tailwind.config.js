/** @type {import('tailwindcss').Config} */
// Design system: U&I palette (from uandi.org.in). White pages, near-black text,
// U&I blue for headings and numbers, U&I red for bold fills, U&I yellow for buttons.
// Change colours here, never as one-off hex values in the HTML.
module.exports = {
  content: ["./*.html", "./js/**/*.js"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "#fcfcfc",        // U&I off-white page background (not pure white)
        surface: "#ebebeb",   // light grey for alternating sections
        line: "#e8e8e8",      // borders
        ink: "#201e1e",       // main text (near-black)
        blue: "#0937fd",      // U&I blue: headings, stats, links
        red: "#cb0100",       // U&I red: logo, highlights, bold fills (white text on top)
        yellow: "#ffda1b",    // U&I yellow: main buttons (ink text on top)
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
