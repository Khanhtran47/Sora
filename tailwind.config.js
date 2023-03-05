module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--nextui-colors-background)',
        'background-alpha': 'var(--nextui-colors-backgroundAlpha)',
        foreground: 'var(--nextui-colors-foreground)',
        'background-contrast': 'var(--nextui-colors-backgroundContrast)',
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
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
