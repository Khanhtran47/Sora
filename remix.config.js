const { createRoutesFromFolders } = require('@remix-run/v1-route-convention');

/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
	ignoredRouteFiles: ['**/.*'],
	tailwind: true,
	postcss: true,
	// appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
	serverModuleFormat: 'cjs',
	future: {
		v2_dev: true,
		v2_errorBoundary: true,
		v2_headers: true,
		v2_meta: false,
		v2_normalizeFormMethod: true,
		v2_routeConvention: true,
	},
	routes(defineRoutes) {
		// uses the v1 convention, works in v1.15+ and v2
		return createRoutesFromFolders(defineRoutes);
	},
	serverDependenciesToBundle: [/^swiper.*/, /^ssr-window.*/, /^dom7.*/, /^react-photoswipe-gallery.*/, /^photoswipe.*/],
};
