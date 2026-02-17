/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF4D5A',
        'primary-hover': '#E95C4B',
        'charcoal': '#1F2933',
        'off-white': '#F9FAFB',
        'sage-green': '#7BAE9E',
        'soft-blue': '#5B8DEF',
      },
      fontFamily: {
        sans: ['Satoshi', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
