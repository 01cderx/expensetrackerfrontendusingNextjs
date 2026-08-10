import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#132420",
        paper: "#F6F3EC",
        forest: {
          50: "#EEF3F0",
          100: "#D6E3DA",
          300: "#8FB3A0",
          500: "#2F6650",
          600: "#245140",
          700: "#1B3D30",
          900: "#0F241D",
        },
        clay: "#C15F3C",
        gold: "#C9A24B",
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
