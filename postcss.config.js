module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    require('postcss-import'),
    require('postcss-preset-env')({ stage: 1 }),
    process.env.NODE_ENV === 'production'
      ? require('cssnano')({
          preset: 'default',
        })
      : null,
  ].filter(Boolean),
};
