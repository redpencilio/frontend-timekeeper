/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{gjs,gts,hbs,html,js,ts}'],
  theme: {
    extend: {
      keyframes: {
        flyInFromLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        flyInFromRight: {
          '0%': { transform: 'translateX(10%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      animation: {
        'fly-left': 'flyInFromLeft 0.1s ease-out',
        'fly-right': 'flyInFromRight 0.1s ease-out',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
