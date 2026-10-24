/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        'xs': '375px', // Extra small screens
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.text-stroke-black': {
          '-webkit-text-stroke': '1px #000000',
        },
        '.text-stroke-white': {
          '-webkit-text-stroke': '1px #ffffff',
        },
        '.hover-text-stroke-black:hover': {
          '-webkit-text-stroke': '1px #000000',
        },
        '.hover-text-stroke-white:hover': {
          '-webkit-text-stroke': '1px #ffffff',
        },
      });
    },
  ],
};
