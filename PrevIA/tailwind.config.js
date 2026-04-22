/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-blue': '#004F6D',    // color principal
        'teal-dark': '#02746E',    // El verde azulado
        'light-teal': '#BBE6E4',   // El color claro de contraste
        'pure-white': '#FFFFFF',
        'pure-black': '#000000',
      },
    },
  },
  plugins: [],
}