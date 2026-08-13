import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#12141C",
          soft: "#2A2E3D",
        },
        paper: {
          DEFAULT: "#FFFFFF",
          dim: "#F4F5F7",
        },
        cobalt: {
          50: "#EEF1FD",
          100: "#DCE2FB",
          200: "#B4C0F5",
          300: "#8B9EEF",
          400: "#5A70E4",
          500: "#3D52D5",
          600: "#2E3FB0",
          700: "#232F87",
          800: "#1A2363",
          900: "#12183F",
        },
        match: {
          DEFAULT: "#C6FF3D",
          dim: "#EBFFC2",
          line: "#9FE300",
        },
        slate: {
          400: "#8A8F9E",
          500: "#6B7080",
          600: "#4C5162",
        },
        line: "#E6E7EB",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-4%)" },
          "50%": { transform: "translateY(104%)" },
          "100%": { transform: "translateY(-4%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "highlight-in": {
          "0%": { backgroundSize: "0% 100%" },
          "100%": { backgroundSize: "100% 100%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        scan: "scan 3.2s cubic-bezier(0.65,0,0.35,1) infinite",
        "fade-up": "fade-up 0.6s ease-out both",
        float: "float 4.5s ease-in-out infinite",
      },
      boxShadow: {
        card: "0 1px 2px rgba(18,20,28,0.04), 0 8px 24px -8px rgba(18,20,28,0.10)",
        elevated: "0 2px 6px rgba(18,20,28,0.04), 0 24px 48px -16px rgba(18,20,28,0.16)",
        lift: "0 4px 10px rgba(18,20,28,0.06), 0 32px 60px -16px rgba(18,20,28,0.22)",
      },
    },
  },
  plugins: [],
};
export default config;
