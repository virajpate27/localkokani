// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
    "./src/app/**/*.{js,jsx}",
  ],
   darkMode: "class",
  theme: {
    screens: {
      xs: "375px",
      ...require("tailwindcss/defaultTheme").screens,
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#00144A",
          light: "#2c4f8a",
          dark: "#00144A",
        },
        secondary: {
          DEFAULT: "#3193a6",
          light: "#42b3c9",
          dark: "#25717f",
        },
        accent: {
          DEFAULT: "#ffc107",
          light: "#f5ce5c",
          dark: "#ffc107",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-poppins)", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #1e3b6c 0%, #3193a6 100%)",
      },
      boxShadow: {
        card: "0 4px 20px rgba(30, 59, 108, 0.08)",
        "card-hover": "0 8px 30px rgba(30, 59, 108, 0.15)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        slideUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};