const { withTV } = require('tailwind-variants/transformer');
const plugin = require('tailwindcss/plugin');
const { nextui } = require('@nextui-org/theme');
const themesConfig = require('./app/styles/themes.config');
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = withTV({
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'player-subtitle-color': 'var(--art-subtitle-color)',
        'player-subtitle-window-color': 'var(--art-subtitle-window-color)',
        'player-subtitle-background-color': 'var(--art-subtitle-background-color)',
        'movie-brand-color': 'var(--theme-movie-brand)',
      },
      keyframes: {
        shadowAnimation: {
          '0%, 100%': {
            transform: 'scale(1, 1)',
          },
          '50%': {
            transform: 'scale(1.2, 1)',
          },
        },
        jumpAnimation: {
          '15%': {
            borderBottomRightRadius: '3px',
          },
          '25%': {
            transform: 'translateY(9px) rotate(22.5deg)',
          },
          '50%': {
            transform: 'translateY(18px) scale(1, .9) rotate(45deg)',
            borderBottomRightRadius: '40px',
          },
          '75%': {
            transform: 'translateY(9px) rotate(67.5deg)',
          },
          '100%': {
            transform: 'translateY(0) rotate(90deg)',
          },
        },
        progressBarStripes: {
          '0%': { backgroundPosition: '40px 0' },
          '100%': { backgroundPosition: '0 0' },
        },
      },
      animation: {
        shadow: 'shadowAnimation 500ms linear infinite',
        jump: 'jumpAnimation 500ms linear infinite',
        progressBarStripes: 'progressBarStripes 2s linear infinite',
      },
      gridTemplateAreas: {
        wide: ['image title', 'image info', 'image buttons'],
        small: ['image title', 'info info', 'buttons buttons'],
      },
      fontFamily: {
        sans: ['Sora', ...defaultTheme.fontFamily.sans],
        system: 'system-ui',
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '-0.05em' }],
        sm: ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '-0.05em' }],
        base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '-0.025em' }],
        lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '0' }],
        xl: ['1.25rem', { lineHeight: '1.5', letterSpacing: '0' }],
        '2xl': ['1.5rem', { lineHeight: '1.5', letterSpacing: '0' }],
        '3xl': ['1.875rem', { lineHeight: '1.5', letterSpacing: '0' }],
        '4xl': ['2.25rem', { lineHeight: '1.5', letterSpacing: '0' }],
        'player-subtitle-font-size': 'var(--art-subtitle-custom-font-size)',
      },
      textShadow: {
        none: 'none',
        sm: '0 1px 2px var(--tw-shadow-color)',
        DEFAULT: '0 2px 4px var(--tw-shadow-color)',
        lg: '0 8px 16px var(--tw-shadow-color)',
        player: 'var(--art-subtitle-text-shadow)',
      },
      width: {
        logo: 'calc(var(--movie-logo-width) * 1px)',
        'logo-sm': 'calc(var(--movie-logo-width-sm) * 1px)',
      },
    },
    screens: {
      '2xs': '375px',
      xs: '425px',
      sm: '650px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1400px',
      '3xl': '1600px',
      '4xl': '1920px',
      '5xl': '2560px',
      'nextui-xs': '650px',
      'nextui-sm': '960px',
      'nextui-md': '1280px',
      'nextui-lg': '1400px',
      'nextui-xl': '1920px',
    },
  },
  darkMode: 'class',
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') },
      );
    }),
    require('tailwind-scrollbar-hide'),
    require('@savvywombat/tailwindcss-grid-areas'),
    require('prettier-plugin-tailwindcss'),
    require('tailwindcss-animate'),
    nextui({
      prefix: 'theme',
      themes: themesConfig,
    }),
  ],
  variants: {
    gridTemplateAreas: ['responsive'],
  },
});
