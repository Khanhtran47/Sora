import { globalCss } from '@nextui-org/react';

const globalStyles = globalCss({
  '*': {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  },
  'html, body': {
    height: '100%',
    margin: 0,
    padding: 0,
  },
  body: {
    fontFamily: 'Inter !important',
    fontWeight: 400,
  },
  html: {
    fontSize: '85%',
    '@xs': {
      fontSize: '90%',
    },
    '@sm': {
      fontSize: '100%',
    },
  },
  ':root': {
    '--swiper-theme-color': 'var(--nextui-colors-primary)',
    '--swiper-pagination-bullet-inactive-color': 'var(--nextui-colors-primarySolidHover)',
  },
  'body::-webkit-scrollbar': {
    width: '0.55rem',
    backgroundColor: '$backgroundContrast',
  },
  'body::-webkit-scrollbar-thumb': {
    borderRadius: '0.55rem',
    boxShadow: 'inset 0 0 0.5rem rgba(0, 0, 0, 0.3)',
    backgroundImage:
      'linear-gradient(-45deg, var(--nextui-colors-primary), var(--nextui-colors-secondary))',
  },
  'body::-webkit-scrollbar-track': {
    boxShadow: 'inset 0 0 0.5rem rgba(0, 0, 0, 0.3)',
  },
});

export default globalStyles;
