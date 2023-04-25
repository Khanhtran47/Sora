const { withTV } = require('tailwind-variants/transformer');
const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = withTV({
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--nextui-colors-background)',
        'background-alpha': 'var(--nextui-colors-backgroundAlpha)',
        'background-light': 'var(--nextui-colors-backgroundLight)',
        foreground: 'var(--nextui-colors-foreground)',
        'background-contrast': 'var(--nextui-colors-backgroundContrast)',
        'background-contrast-alpha': 'var(--nextui-colors-backgroundContrastAlpha)',
        'background-contrast-light': 'var(--nextui-colors-backgroundContrastLight)',
        'background-transparent': 'var(--nextui-colors-backgroundTransparent)',
        primary: 'var(--nextui-colors-primary)',
        'primary-light-hover': 'var(--nextui-colors-primaryLightHover)',
        'primary-light-active': 'var(--nextui-colors-primaryLightActive)',
        'primary-light-contrast': 'var(--nextui-colors-primaryLightContrast)',
        'primary-border': 'var(--nextui-colors-primaryBorder)',
        'primary-border-hover': 'var(--nextui-colors-primaryBorderHover)',
        'primary-solid-hover': 'var(--nextui-colors-primarySolidHover)',
        'primary-solid-contrast': 'var(--nextui-colors-primarySolidContrast)',
        'primary-shadow': 'var(--nextui-colors-primaryShadow)',
        gradient: 'var(--nextui-colors-gradient)',
        text: 'var(--nextui-colors-text)',
        'text-light': 'var(--nextui-colors-textLight)',
        'text-alpha': 'var(--nextui-colors-textAlpha)',
        success: 'var(--nextui-colors-success)',
        warning: 'var(--nextui-colors-warning)',
        error: 'var(--nextui-colors-error)',
        link: 'var(--nextui-colors-link)',
        border: 'var(--nextui-colors-border)',
        selection: 'var(--nextui-colors-selection)',
        code: 'var(--nextui-colors-code)',
        'player-subtitle-window-color': 'var(--art-subtitle-window-color)',
        'player-subtitle-background-color': 'var(--art-subtitle-background-color)',
      },
      keyframes: {
        enterFromRight: {
          from: { opacity: 0, transform: 'translateX(200px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
        enterFromLeft: {
          from: { opacity: 0, transform: 'translateX(-200px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
        exitToRight: {
          from: { opacity: 1, transform: 'translateX(0)' },
          to: { opacity: 0, transform: 'translateX(200px)' },
        },
        exitToLeft: {
          from: { opacity: 1, transform: 'translateX(0)' },
          to: { opacity: 0, transform: 'translateX(-200px)' },
        },
        scaleIn: {
          from: { opacity: 0, transform: 'rotateX(-10deg) scale(0.9)' },
          to: { opacity: 1, transform: 'rotateX(0deg) scale(1)' },
        },
        scaleOut: {
          from: { opacity: 1, transform: 'rotateX(0deg) scale(1)' },
          to: { opacity: 0, transform: 'rotateX(-10deg) scale(0.95)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        fadeOut: {
          from: { opacity: 1 },
          to: { opacity: 0 },
        },
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
      },
      animation: {
        scaleIn: 'scaleIn 200ms ease',
        scaleOut: 'scaleOut 200ms ease',
        fadeIn: 'fadeIn 200ms ease',
        fadeOut: 'fadeOut 200ms ease',
        enterFromLeft: 'enterFromLeft 250ms ease',
        enterFromRight: 'enterFromRight 250ms ease',
        exitToLeft: 'exitToLeft 250ms ease',
        exitToRight: 'exitToRight 250ms ease',
        shadow: 'shadowAnimation 500ms linear infinite',
        jump: 'jumpAnimation 500ms linear infinite',
      },
      gridTemplateAreas: {
        wide: ['image title', 'image info', 'image buttons'],
        small: ['image title', 'info info', 'buttons buttons'],
      },
      fontSize: {
        'player-subtitle-font-size': 'var(--art-subtitle-custom-font-size)',
      },
      textShadow: {
        none: 'none',
        sm: '0 1px 2px var(--tw-shadow-color)',
        DEFAULT: '0 2px 4px var(--tw-shadow-color)',
        lg: '0 8px 16px var(--tw-shadow-color)',
        player: 'var(--art-subtitle-text-shadow)',
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
    require('@tailwindcss/line-clamp'),
    require('tailwind-scrollbar-hide'),
    require('@savvywombat/tailwindcss-grid-areas'),
    require('prettier-plugin-tailwindcss'),
  ],
  variants: {
    gridTemplateAreas: ['responsive'],
  },
});
