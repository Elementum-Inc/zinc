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
      primary: 'rgb(var(--color-primary))',
      secondary: 'rgb(var(--color-secondary))',
      accent1: 'rgb(var(--color-accent-1))',
      accent2: 'rgb(var(--color-accent-2))',
      bg1: 'rgb(var(--color-background-1))',
      bg2: 'rgb(var(--color-background-2))',
      text: 'rgb(var(--color-text))'
    },
    fontFamily: {
      sans: ['var(--font-body-family)'],
      serif: ['var(--font-heading-family)']
    },
    fontSize: { // calculated values below based on a root size of 16px
      '3xs': '.5rem', // 8px
      '2xs': '.625rem', // 10px
      'xs': '.75rem', // 12px
      'sm': '.875rem', // 14px
      'base': '1rem', // 16px
      'lg': '1.125rem', // 18px
      'xl': '1.25rem', // 20px
      '2xl': '1.5rem', // 24px
      '1.75': '1.75rem', // 28px
      '3xl': '2rem', // 32px 
      '4xl': '2.25rem', // 36px
      '5xl': '2.5rem', // 40px
      '2.75': '2.75rem', // 44px
      '6xl': '3rem', // 48px
      '7xl': '3.5rem', // 56px
      '8xl': '4rem', // 64px 
      '9xl': '4.5rem', // 72px 
    },
    letterSpacing: {
      100: '.01em',
      200: '.02em',
      300: '.03em',
      400: '.04em',
      500: '.05em',
    },
    padding: {
      'xs': '.375rem', // 6px,
      'sm': '.5rem', // 8px,
      'md': '1rem', // 16px
      'lg': '1.2rem', // 20px
      'xl': '1.875rem' // 30px
    },
    extend: {
      lineHeight: {
        '110': 1.1,
        '120': 1.2,
        '130': 1.3,
        '140': 1.4,
        '160': 1.6,
        '170': 1.7,
        '180': 1.8,
        '190': 1.9,
      }
    },
  },
  plugins: [],
}
