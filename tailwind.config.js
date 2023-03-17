const { withTV } = require('tailwind-variants/transformer');

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
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
});
