/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FDAE09',
        primaryDark: '#F28E0C'
      },
      fontSize: {
        '1xs': '0.5rem'
      }
    }
  },
  plugins: []
}

module.exports = config
