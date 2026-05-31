import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "sans-serif"],
      },
      colors: {
        surface: {
          DEFAULT: "#050507",
          50: "rgba(255,255,255,0.03)",
          100: "rgba(255,255,255,0.06)",
          200: "rgba(255,255,255,0.1)",
        },
        violet: {
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
        },
        indigo: {
          400: "#818cf8",
          500: "#6366f1",
        },
        cyan: {
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
        },
        fuchsia: {
          400: "#e879f9",
          500: "#d946ef",
        },
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float-orb 6s ease-in-out infinite",
        "float-reverse": "float-orb-reverse 8s ease-in-out infinite",
        shimmer: "shimmer 3s ease-in-out infinite",
        "gradient-shift": "gradient-shift 4s ease infinite",
        "spin-slow": "spin 8s linear infinite",
      },
      backgroundImage: {
        "gradient-radial":
          "radial-gradient(ellipse at 50% 0%, var(--tw-gradient-from), var(--tw-gradient-to))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [typography],
};

export default config;
