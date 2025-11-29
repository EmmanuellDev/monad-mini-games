import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: [
          "-apple-system",
          "SF Pro Display",
          "BlinkMacSystemFont",
          "Inter",
          "system-ui",
          "sans-serif",
        ],
        body: [
          "-apple-system",
          "SF Pro Text",
          "BlinkMacSystemFont",
          "Inter",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "SF Mono",
          "Monaco",
          "Cascadia Code",
          "Courier New",
          "monospace",
        ],
      },
      colors: {
        background: {
          base: "#0A0A0F",
          elevated: "#13131A",
          surface: "#1C1C1E",
          overlay: "#2C2C2E",
        },
        foreground: {
          primary: "#FFFFFF",
          secondary: "#E0E0E0",
          tertiary: "#98989D",
          disabled: "#636366",
        },
        accent: {
          purple: "#9D4EDD",
          violet: "#7B2CBF",
          indigo: "#5A189A",
          lavender: "#C77DFF",
          green: "#06FFA5",
          orange: "#FF9F0A",
          red: "#FF453A",
          cyan: "#00D9FF",
        },
        border: {
          subtle: "rgba(157, 78, 221, 0.15)",
          DEFAULT: "rgba(157, 78, 221, 0.2)",
          strong: "rgba(157, 78, 221, 0.4)",
        },
        glass: {
          bg: "rgba(19, 19, 26, 0.8)",
        },
      },
      boxShadow: {
        "glow-purple": "0 0 15px rgba(157, 78, 221, 0.35), 0 0 30px rgba(157, 78, 221, 0.2)",
        "glow-violet": "0 0 20px rgba(123, 44, 191, 0.4), 0 0 40px rgba(123, 44, 191, 0.25)",
        "sm-glow-purple": "0 0 8px rgba(157, 78, 221, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
