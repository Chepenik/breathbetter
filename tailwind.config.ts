import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./compoenents/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        blue: {
          400: "#38bdf8",
        },
        teal: {
          400: "#2dd4bf",
        },
        green: {
          400: "#22c55e",
        },
        yellow: {
          400: "#facc15",
        },
        orange: {
          400: "#fb923c",
        },
        red: {
          400: "#f43f5e",
        },
        pink: {
          500: "#ec4899",
        },
        purple: {
          500: "#9333ea",
        },
        indigo: {
          500: "#6366f1",
        },
        gray: {
          500: "#6b7280",
        },
      },
      boxShadow: {
        "blue-500/50": "0 0 20px rgba(59, 130, 246, 0.5)",
        "yellow-500/50": "0 0 20px rgba(234, 179, 8, 0.5)",
        "purple-500/50": "0 0 20px rgba(147, 51, 234, 0.5)",
        "gray-500/50": "0 0 20px rgba(107, 114, 128, 0.5)",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
} satisfies Config;
