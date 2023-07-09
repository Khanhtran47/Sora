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
		v2_meta: true,
		v2_normalizeFormMethod: true,
		v2_routeConvention: true,
	},
	serverDependenciesToBundle: [/^swiper.*/, /^ssr-window.*/, /^dom7.*/, /^react-photoswipe-gallery.*/, /^photoswipe.*/],
};
