module.exports = {
  content: [

    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pink': {
          50: '#FDF6F8',
          300: '#FCECF2',
          400: '#F2B3CA',
          600: '#db2777',
          700: '#be185d',
        },
        'brown': {
          400: '#593B34',
        },
        'blue': {
          200: '#90C5D7',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
  ],
}
