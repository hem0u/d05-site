import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        border: "hsl(var(--border))",
        ring: "hsl(var(--ring))",
        sakura: {
          50: "#fff0f3",
          100: "#ffe3e8",
          200: "#ffb7c5",
          300: "#ff8fa3",
          400: "#ff6b85",
          500: "#ff4d6d",
          600: "#e63950",
          700: "#bf1d3a",
          800: "#990f2b",
          900: "#66081d",
        },
        sky: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#87ceeb",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        lavender: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e6d6ff",
          300: "#d4b8ff",
          400: "#b794f4",
          500: "#9b6fe8",
          600: "#8055d6",
          700: "#6840bf",
          800: "#513099",
          900: "#3b2070",
        },
      },
      borderRadius: {
        bubble: "1.25rem",
        xl: "0.75rem",
      },
      fontFamily: {
        sans: [
          "Noto Sans SC",
          "system-ui",
          "sans-serif",
        ],
        serif: [
          "Noto Serif SC",
          "Georgia",
          "serif",
        ],
        display: [
          "var(--font-zcool)",
          "Noto Sans SC",
          "system-ui",
          "sans-serif",
        ],
      },
      animation: {
        "float": "float 3s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "slide-up": "slide-up 0.5s ease-out",
        "slide-down": "slide-down 0.3s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "bounce-gentle": "bounce-gentle 2s ease-in-out infinite",
        "sparkle-fade": "sparkle-fade 3s ease-in-out infinite",
        "petal-drift": "petal-drift 9s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-down": {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "bounce-gentle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "sparkle-fade": {
          "0%, 100%": { opacity: "0", transform: "scale(0.5)" },
          "50%": { opacity: "0.8", transform: "scale(1.1)" },
        },
        "petal-drift": {
          "0%": { transform: "translateY(-10vh) translateX(0px) rotate(0deg)", opacity: "0.7" },
          "100%": { transform: "translateY(110vh) translateX(var(--sway, 60px)) rotate(540deg)", opacity: "0" },
        },
      },
    },
  },
} satisfies Config;
