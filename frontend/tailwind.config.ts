import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {colors: {
  ink: "#0F172A",
  paper: "#F8FAFC",
  sidebar: {
    DEFAULT: "#0B1220",
    hover: "#151E32",
  },
  teal: {
    50: "#EFFCF9",
    100: "#CCFBEF",
    400: "#2DD4BF",
    500: "#14B8A6",
    600: "#0D9488",
    700: "#0F766E",
  },
  rose: "#F43F5E",
  amber: "#F59E0B",
  slate: {
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
  },
},
boxShadow: {
  card: "0 1px 2px rgba(15,23,42,0.04), 0 8px 24px -8px rgba(15,23,42,0.08)",
},
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      borderRadius: {
        sm: "4px",
      },
    },
  },
  plugins: [],
};
export default config;
