/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 30px rgba(56, 189, 248, 0.35)",
        glowHot: "0 0 40px rgba(244, 63, 94, 0.28)",
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(ellipse at top, rgba(56, 189, 248, 0.22), transparent 55%), radial-gradient(ellipse at bottom, rgba(16, 185, 129, 0.12), transparent 55%)",
      },
    },
  },
  plugins: [],
};

