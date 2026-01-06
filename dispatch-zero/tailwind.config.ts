import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        cockpit:
          "0 0 0 1px rgba(255,255,255,0.06), 0 20px 60px rgba(0,0,0,0.55)",
        glow: "0 0 0 1px rgba(34,211,238,0.18), 0 0 40px rgba(34,211,238,0.16)",
      },
    },
  },
  plugins: [],
} satisfies Config;

