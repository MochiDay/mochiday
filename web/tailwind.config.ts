import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    colors: {
      yellow: "#FFCA40",
      green: "#70D035",
      pink: "#FF79C6",
      red: "#D73258",
      beige: "#FDF6E5",
      white: "#FFFFFF",
      black: "#000000",
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light"],
  },
} satisfies Config;
