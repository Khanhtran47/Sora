const { flatRoutes } = require('remix-flat-routes')

/**
 * @type {import('@remix-pwa/dev').WorkerConfig}
 */
module.exports = {
  //
  // Remix Settings
  //
	// appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  browserNodeBuiltinsPolyfill: { modules: { url: true } },
	// ignore all files in routes folder to prevent
  // default remix convention from picking up routes
  ignoredRouteFiles: ['**/.*'],
  // publicPath: "/build/",
	postcss: true,
  routes: async defineRoutes => {
    return flatRoutes('routes', defineRoutes)
  },
  // serverBuildPath: "build/index.js",
  serverDependenciesToBundle: [
    /^swiper.*/,
    /^ssr-window.*/,
    /^dom7.*/,
    /^react-photoswipe-gallery.*/,
    /^photoswipe.*/,
    /^remix-utils.*/,
    /^is-ip.*/,
    /^ip-regex.*/,
    /^super-regex.*/,
    /^clone-regex.*/,
    /^function-timeout.*/,
    /^time-span.*/,
    /^convert-hrtime.*/,
    /^is-regexp.*/,
    /@remix-pwa\/.*/,
    /@font-source\/.*/
  ],
  serverModuleFormat: 'cjs',
  tailwind: true,
  //
  // Remix PWA Settings
  //
  // entryWorkerFile: '<appDir>/entry.worker.ts',
  // worker: '@remix-pwa/runtime',
  workerName: 'sw',
  workerMinify: true,
  // workerBuildDirectory: './build',
  // workerSourcemap: false,
};
