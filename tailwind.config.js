/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["DM Sans", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
      colors: {
        navy: {
          950: "#050d1a",
          900: "#0a1628",
          800: "#0f2040",
          700: "#162d58",
          600: "#1e3d70",
        },
        gold: {
          300: "#f5d78a",
          400: "#e8bb4f",
          500: "#d4a017",
          600: "#b8860b",
        },
        slate2: {
          700: "#2a3550",
          600: "#334266",
          500: "#4a5a80",
        },
        emerald2: {
          400: "#34d399",
          500: "#10b981",
        },
        rose2: {
          400: "#fb7185",
          500: "#f43f5e",
        },
      },
      backgroundImage: {
        glass:
          "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
        "mesh-bg":
          "radial-gradient(ellipse at 20% 20%, rgba(212,160,23,0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(30,61,112,0.3) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(5,13,26,0) 0%, #050d1a 100%)",
      },
      backdropBlur: {
        glass: "20px",
      },
      keyframes: {
        fadeSlideIn: {
          from: {
            opacity: "0",
            transform: "translateY(12px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        in: "fadeSlideIn 0.4s ease forwards",
      },
    },
  },
  plugins: [],
};
