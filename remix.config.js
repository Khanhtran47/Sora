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
    'react-photoswipe-gallery',
    'photoswipe',
    '@vime',
    'react-hls-player',
  ],
};
