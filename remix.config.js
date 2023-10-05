const { flatRoutes } = require('remix-flat-routes')

/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
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
	serverDependenciesToBundle: [/^swiper.*/, /^ssr-window.*/, /^dom7.*/, /^react-photoswipe-gallery.*/, /^photoswipe.*/, /^remix-utils.*/],
  serverModuleFormat: 'cjs',
	tailwind: true,
};
