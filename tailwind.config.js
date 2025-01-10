/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        'spotify-green': '#1DB954',
        'spotify-black': '#121212',
        'spotify-gray': {
          100: '#B3B3B3',
          200: '#535353',
          300: '#282828',
          400: '#181818',
          500: '#121212',
        }
      }
    }
  },
  plugins: [],
};
