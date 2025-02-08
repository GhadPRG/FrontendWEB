/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin');

/* ----- Funtions --------------------------------------------------------------------------------------------------- */
function withOpacity(variableName) {
  return ({opacityValue}) => {
    if (opacityValue !== undefined) return `rgb(var(${variableName}) / ${opacityValue})`;

    return `rgb(var(${variableName}))`;
  }
}


/* ----- Module Settings -------------------------------------------------------------------------------------------- */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      textColor: {
        skin: {
          'base-light': withOpacity('--color-text-light-base'),
          'muted-light': withOpacity('--color-text-light-muted'),
          'accent-light': withOpacity('--color-text-light-accent'),
          
          'base-dark': withOpacity('--color-text-dark-base'),
          'muted-dark': withOpacity('--color-text-dark-muted'),
          'accent-dark': withOpacity('--color-text-dark-accent'),
        }
      },
      backgroundColor: {
        skin: {
          'fill-lighter': withOpacity('--color-fill-lighter'),
          'fill-light': withOpacity('--color-fill-light'),
          'fill-medium': withOpacity('--color-fill-medium'),
          'fill-dark': withOpacity('--color-fill-dark'),
          'fill-darker': withOpacity('--color-fill-darker'),
          
          'lightest': withOpacity('--color-fill-lightest'),
          'darkest': withOpacity('--color-fill-darkest'),
        }
      },
      gradientColorStops: {
        skin: {
          'fill-lighter': withOpacity('--color-fill-lighter'),
          'fill-light': withOpacity('--color-fill-light'),
          'fill-medium': withOpacity('--color-fill-medium'),
          'fill-dark': withOpacity('--color-fill-dark'),
          'fill-darker': withOpacity('--color-fill-darker'),
        }
      },
      fontFamily: {
        'poppins': ["Poppins", "sans-serif"]
      },
      boxShadow: {
        'glass': 'inset 0px 2px 4px 0px rgba(255 255 255 / 0.8), inset 0px 20px 40px 0px rgba(255 255 255 / .25), 0 8px 32px rgba(0 0 0 / 0.2)',
      }
    },
  },
  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({
        '.glass-panel' : {
          'background': 'linear-gradient(225deg, rgba(var(--glass-panel-bg) / 0.3), rgba(var(--glass-panel-bg) / 0.1)), rgba(var(--glass-panel-bg) / .2)',

          '-webkit-backdrop-filter': 'blur(8px)',
          'backdrop-filter': 'blur(8px)',
          'filter': 'saturate(150%)',
          
          'box-shadow': 'inset 0px 2px 4px 0px rgba(255 255 255 / 0.8), inset 0px 20px 40px 0px rgba(255 255 255 / .5), 0 8px 32px rgba(0 0 0 / 0.37)',
        },
      })
    }),
  ]
}

