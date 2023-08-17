/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FDAE09'
      },
      fontSize: {
        '1xs': '0.5rem'
      }
    }
  },
  plugins: []
}

module.exports = config
