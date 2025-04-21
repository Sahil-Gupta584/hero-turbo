/** @type {import('tailwindcss').Config} */
import { heroui } from "@heroui/react";
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // UI package components
  ],
    theme: {
    extend: {},
  },
  plugins: [heroui()],
}

