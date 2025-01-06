const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./app/**/*.{gjs,gts,hbs,html,js,ts}'],
  safelist: [
    {
      pattern: /^fill-(green|red|blue|yellow|gray|indigo)-\d{3}$/,
    },
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lexend Deca', ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        flyInFromLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        flyInFromRight: {
          '0%': { transform: 'translateX(10%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        flyInFromBottom: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        flyInFromTop: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'fly-left': 'flyInFromLeft 0.1s ease-out',
        'fly-right': 'flyInFromRight 0.1s ease-out',
        'fly-bottom': 'flyInFromBottom 0.1s ease-out',
        'fly-top': 'flyInFromTop 0.1s ease-out',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
