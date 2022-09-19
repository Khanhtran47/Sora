/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  appDirectory: 'app',
  assetsBuildDirectory: 'public/build',
  publicPath: '/build/',
  serverBuildDirectory: 'api/_build',
  ignoredRouteFiles: ['.*'],
  serverDependenciesToBundle: [
    /^swiper.*/,
    /^ssr-window.*/,
    /^dom7.*/,
    /^react-photoswipe-gallery.*/,
    /^photoswipe.*/,
  ],
};
