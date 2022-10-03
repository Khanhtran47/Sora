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
    fontFamily: 'Inter, sans-serif',
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
});

export default globalStyles;
