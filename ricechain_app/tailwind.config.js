/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FDFDF6', // Clean Off-White - for backgrounds
        primary: '#A3B18A',    // Sage Green - for primary elements
        accent1: '#E8C547',    // Grain Yellow - for accents and primary CTAs
        accent2: '#D98F6B',    // Terracotta - for hover states and secondary CTAs
        text: '#2E2E2E'        // Charcoal Dark - for text
      }
    },
  },
  plugins: [],
}
