/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        geist: ['Geist', 'sans-serif'],
      },
      colors: {
        casino: {
          green: '#0a5f38',
          red: '#c41e3a',
          gold: '#ffd700',
          darkGold: '#b8860b',
        },
      },
    },
  },
  plugins: [],
}

