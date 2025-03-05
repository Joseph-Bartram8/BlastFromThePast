import { defineConfig } from "tailwindcss";

export default defineConfig({
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        krona: ["Krona One", "sans-serif"],
      },
    },
  },
  plugins: [],
});
