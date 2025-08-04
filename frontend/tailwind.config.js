/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./public/*.html",
    "./src/**/*.js",
    "./src/**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        'game-bg': '#f0f0f0',
        'game-primary': '#333',
      }
    },
  },
  plugins: [],
}