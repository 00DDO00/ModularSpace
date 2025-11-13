/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0D17',
        surface: '#11131F',
        overlay: '#1A1C2E',
        primary: '#E2E4F3',
        contrast: '#101223',
        dhbBlue: '#004996',
        accent: '#F2B705',
        muted: '#6B6F88',
        line: '#1F2336',
      },
    },
  },
  plugins: [],
}
