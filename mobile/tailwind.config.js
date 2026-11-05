/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#0D1117",
        surface: "#161B22",
        border: "#21262D",
        "text-primary": "#F0F6FC",
        "text-secondary": "#8B949E",
        primary: "#00C853",
        live: "#FF4444",
        "card-yellow": "#FFD700",
        "card-red": "#FF4444",
        accent: "#FF6B35",
      },
      fontFamily: {
        sans: ["System"],
      },
    },
  },
  plugins: [],
};
