/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sauna: {
          50: '#fef7ee',
          100: '#fdedd6',
          200: '#fad8ac',
          300: '#f6bc77',
          400: '#f19540',
          500: '#ed7a1a',
          600: '#de5f10',
          700: '#b8490f',
          800: '#933915',
          900: '#763014',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}