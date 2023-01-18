/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  appDirectory: 'app',
  serverBuildTarget: 'vercel',
  assetsBuildDirectory: 'public/build',
  publicPath: '/build/',
  serverBuildDirectory: 'build',
  ignoredRouteFiles: ['.*'],
  serverDependenciesToBundle: [
    /^swiper.*/,
    /^ssr-window.*/,
    /^dom7.*/,
    /^react-photoswipe-gallery.*/,
    /^photoswipe.*/,
  ],
};
