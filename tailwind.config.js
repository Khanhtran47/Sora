module.exports = {
  mode: process.env.NODE_ENV ? 'jit' : undefined,
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
