export default {
  extract: {
    include: [
      './**/*.{liquid,vue,css,js}',
    ],
  },
  theme: {
    colors: {
      black: '#0a0a0a',
      white: '#ffffff',
      gray: {
        100: '#f3f3f3',
        200: '#f5f5f5',
        300: '#ededed',
        400: '#e0e0e0',
        500: '#c2c2c2',
        600: '#9e9e9e',
        700: '#757575',
        800: '#616161',
        900: '#424242',
      },
      teal: '#074169',
      mustard: '#d69940',
    },
    fontFamily: {
      sans: ['Avenir'],
      serif: ['"Playfair Display"']
    },
    extend: {},
  },
  plugins: [],
}
