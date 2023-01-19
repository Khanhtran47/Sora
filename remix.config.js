/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  appDirectory: 'app',
  serverBuildTarget: 'vercel',
  assetsBuildDirectory: 'public/build',
  publicPath: '/build/',
  // When running locally in development mode, we use the built in remix
  // server. This does not understand the vercel lambda module format,
  // so we default back to the standard build output.
  server: process.env.NODE_ENV === 'development' ? undefined : './server.js',
  ignoredRouteFiles: ['.*'],
  serverDependenciesToBundle: [
    /^swiper.*/,
    /^ssr-window.*/,
    /^dom7.*/,
    /^react-photoswipe-gallery.*/,
    /^photoswipe.*/,
  ],
};
