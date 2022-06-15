const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    colors: {
      white: '#FFFFFF',
      lotion: '#FAFAFA',
      raisinblack: '#262626',
      gainsboro: '#DBDBDB',
      vividcerulean: '#0095F6',
      freshair: 'rgba(0,149,246,0.3)',
      brightgray: '#EFEFEF',
      desire: '#ED4956',
      chinesesilver: '#C7C7C7',
      philippinegray: '#8E8E8E',
      overlay: 'rgba(0,0,0,0.65)',
      metallicblue: '#385185',
      transparent: 'transparent',
    },
    extend: {
      fontFamily: {
        sans: ['-apple-system', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}
