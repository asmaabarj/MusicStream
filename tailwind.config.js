/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        spotify: {
          base: '#121212',
          elevated: '#181818',
          highlight: '#242424',
          green: '#1db954',
          'green-hover': '#1ed760',
          text: '#b3b3b3',
        },
      },
    },
  },
  plugins: [],
};
