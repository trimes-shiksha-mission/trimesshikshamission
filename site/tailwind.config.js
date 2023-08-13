/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/pages/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
  theme: {
    backdropFilter: {
      none: 'none',
      blur: 'blur(20px)'
    },
    extend: {
      colors: {
        primary: '#FDAE09'
      },
      fontSize: {
        '1xs': '0.5rem'
      }
    }
  },
  plugins: [require('tailwindcss-filters')]
}
