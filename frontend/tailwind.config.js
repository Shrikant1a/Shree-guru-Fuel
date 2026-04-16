/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#fde047',
          DEFAULT: '#eab308', // Bharat Petroleum yellow
          dark: '#a16207',
        },
        secondary: {
          light: '#60a5fa',
          DEFAULT: '#2563eb', // Bharat Petroleum blue
          dark: '#1e40af',
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
