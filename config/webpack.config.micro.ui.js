const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const resolve = require("resolve");
const PnpWebpackPlugin = require("pnp-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const safePostCssParser = require("postcss-safe-parser");
const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");
const getCSSModuleLocalIdent = require("react-dev-utils/getCSSModuleLocalIdent");
const ESLintPlugin = require("eslint-webpack-plugin");
const { microUiPaths, moduleFileExtensions } = require("./paths");
const modules = require("./modules");
const ForkTsCheckerWebpackPlugin = require("react-dev-utils/ForkTsCheckerWebpackPlugin");
const typescriptFormatter = require("react-dev-utils/typescriptFormatter");

const postcssNormalize = require("postcss-normalize");
const getClientEnvironment = require("./env");
const parseArgs = require("minimist");

const appDirectory = fs.realpathSync(process.cwd());

const { name, "component-path": componentPath } = parseArgs(process.argv.slice(2));
console.log("Name : ", name, "Component Path : ", componentPath);

const appPackageJson = require(microUiPaths.appPackageJson);

const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== "false";

const reactRefreshOverlayEntry = require.resolve("react-dev-utils/refreshOverlayInterop");
const emitErrorsAsWarnings = process.env.ESLINT_NO_DEV_ERRORS === "true";
const disableESLintPlugin = process.env.DISABLE_ESLINT_PLUGIN === "true";

const useTypeScript = fs.existsSync(microUiPaths.appTsConfig);

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const env = getClientEnvironment();

const hasJsxRuntime = (() => {
	if (process.env.DISABLE_NEW_JSX_TRANSFORM === "true") {
		return false;
	}

	try {
		require.resolve("react/jsx-runtime");
		return true;
	} catch (e) {
		return false;
	}
})();

module.exports = function (webpackEnv) {
	const getStyleLoaders = (cssOptions, preProcessor) => {
		const loaders = [
			{
				loader: MiniCssExtractPlugin.loader,
				options: { publicPath: "../../" },
			},
			{
				loader: require.resolve("css-loader"),
				options: cssOptions,
			},
			{
				loader: require.resolve("postcss-loader"),
				options: {
					ident: "postcss",
					plugins: () => [
						require("postcss-flexbugs-fixes"),
						require("postcss-preset-env")({
							autoprefixer: {
								flexbox: "no-2009",
							},
							stage: 3,
						}),
						postcssNormalize(),
					],
					sourceMap: shouldUseSourceMap,
				},
			},
		].filter(Boolean);
		if (preProcessor) {
			loaders.push({
				loader: require.resolve(preProcessor),
				options: {
					sourceMap: true,
				},
			});
		}
		return loaders;
	};

	return {
		mode: "production",
		bail: true,
		devtool: shouldUseSourceMap ? "source-map" : false,
		// entry: microUiPaths.appMicroUIJs,
		entry: path.resolve(appDirectory, componentPath),
		output: {
			path: microUiPaths.appBuild,
			// filename: `app-micro-ui.js`, // replace
			filename: `${name}.js`, // replace
			futureEmitAssets: true,
			devtoolModuleFilenameTemplate: (info) => path.relative(microUiPaths.appSrc, info.absoluteResourcePath).replace(/\\/g, "/"),
			jsonpFunction: `webpackJsonp${appPackageJson.name}`,
			globalObject: "this",
		},
		optimization: {
			minimize: true,
			minimizer: [
				new TerserPlugin({
					terserOptions: {
						parse: {
							ecma: 8,
						},
						compress: {
							ecma: 5,
							warnings: false,
							comparisons: false,
							inline: 2,
						},
						mangle: {
							safari10: true,
						},
						keep_classnames: true,
						keep_fnames: true,
						output: {
							ecma: 5,
							comments: false,
							ascii_only: true,
						},
					},
					sourceMap: shouldUseSourceMap,
				}),
				new OptimizeCSSAssetsPlugin({
					cssProcessorOptions: {
						parser: safePostCssParser,
						map: shouldUseSourceMap
							? {
									inline: false,
									annotation: true,
							  }
							: false,
					},
					cssProcessorPluginOptions: {
						preset: ["default", { minifyFontValues: { removeQuotes: false } }],
					},
				}),
			],
			splitChunks: {
				cacheGroups: {
					default: false,
				},
			},
			runtimeChunk: false,
		},
		resolve: {
			modules: ["node_modules", microUiPaths.appNodeModules].concat(modules.additionalModulePaths || []),
			extensions: moduleFileExtensions.map((ext) => `.${ext}`).filter((ext) => useTypeScript || !ext.includes("ts")),
			alias: {
				"react-native": "react-native-web",
				"react-dom$": "react-dom/profiling",
				"scheduler/tracing": "scheduler/tracing-profiling",
				...(modules.webpackAliases || {}),
			},
			plugins: [PnpWebpackPlugin, new ModuleScopePlugin(microUiPaths.appSrc, [microUiPaths.appPackageJson, reactRefreshOverlayEntry])],
		},
		resolveLoader: {
			plugins: [PnpWebpackPlugin.moduleLoader(module)],
		},
		module: {
			strictExportPresence: true,
			rules: [
				{ parser: { requireEnsure: false } },
				{
					oneOf: [
						// {
						// 	test: [/\.avif$/],
						// 	loader: require.resolve("url-loader"),
						// 	options: {
						// 		limit: imageInlineSizeLimit,
						// 		mimetype: "image/avif",
						// 		name: "media/[name].[ext]",
						// 	},
						// },
						// {
						// 	test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
						// 	loader: require.resolve("url-loader"),
						// 	options: {
						// 		limit: imageInlineSizeLimit,
						// 		name: "media/[name].[ext]",
						// 	},
						// },
						{
							test: /\.(js|mjs|jsx|ts|tsx)$/,
							include: microUiPaths.appSrc,
							loader: require.resolve("babel-loader"),
							options: {
								customize: require.resolve("babel-preset-react-app/webpack-overrides"),
								presets: [
									[
										require.resolve("babel-preset-react-app"),
										{
											runtime: hasJsxRuntime ? "automatic" : "classic",
										},
									],
								],
								plugins: [
									[
										require.resolve("babel-plugin-named-asset-import"),
										{
											loaderMap: {
												svg: {
													ReactComponent: "@svgr/webpack?-svgo,+titleProp,+ref![path]",
												},
											},
										},
									],
								].filter(Boolean),
								cacheDirectory: true,
								cacheCompression: false,
								compact: true,
							},
						},
						{
							test: /\.(js|mjs)$/,
							exclude: /@babel(?:\/|\\{1,2})runtime/,
							loader: require.resolve("babel-loader"),
							options: {
								babelrc: false,
								configFile: false,
								compact: false,
								presets: [[require.resolve("babel-preset-react-app/dependencies"), { helpers: true }]],
								cacheDirectory: true,
								cacheCompression: false,
								sourceMaps: shouldUseSourceMap,
								inputSourceMap: shouldUseSourceMap,
							},
						},
						{
							test: cssRegex,
							exclude: cssModuleRegex,
							use: getStyleLoaders({
								importLoaders: 1,
								sourceMap: shouldUseSourceMap,
							}),
							sideEffects: true,
						},
						{
							test: cssModuleRegex,
							use: getStyleLoaders({
								importLoaders: 1,
								sourceMap: shouldUseSourceMap,
								modules: {
									getLocalIdent: getCSSModuleLocalIdent,
								},
							}),
						},
						{
							test: sassRegex,
							exclude: sassModuleRegex,
							use: getStyleLoaders(
								{
									importLoaders: 3,
									sourceMap: shouldUseSourceMap,
								},
								"sass-loader",
							),
							sideEffects: true,
						},
						{
							test: sassModuleRegex,
							use: getStyleLoaders(
								{
									importLoaders: 3,
									sourceMap: shouldUseSourceMap,
									modules: {
										getLocalIdent: getCSSModuleLocalIdent,
									},
								},
								"sass-loader",
							),
						},
						{
							loader: require.resolve("file-loader"),
							exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
							options: {
								name: "[name].[ext]",
							},
						},
					],
				},
			],
		},
		plugins: [
			new webpack.DefinePlugin(env.stringified),
			new MiniCssExtractPlugin({
				// filename: "app-micro-ui.css", // replace
				filename: `${name}.css`, // replace
			}),
			new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
			useTypeScript &&
				new ForkTsCheckerWebpackPlugin({
					typescript: resolve.sync("typescript", {
						basedir: microUiPaths.appNodeModules,
					}),
					checkSyntacticErrors: true,
					resolveModuleNameModule: process.versions.pnp ? `${__dirname}/pnpTs.js` : undefined,
					resolveTypeReferenceDirectiveModule: process.versions.pnp ? `${__dirname}/pnpTs.js` : undefined,
					tsconfig: microUiPaths.appTsConfig,
					reportFiles: [
						"../**/src/**/*.{ts,tsx}",
						"**/src/**/*.{ts,tsx}",
						"!**/src/**/__tests__/**",
						"!**/src/**/?(*.)(spec|test).*",
						"!**/src/setupProxy.*",
						"!**/src/setupTests.*",
					],
					silent: true,
					formatter: typescriptFormatter,
				}),
			!disableESLintPlugin &&
				new ESLintPlugin({
					// Plugin options
					extensions: ["js", "mjs", "jsx", "ts", "tsx"],
					formatter: require.resolve("react-dev-utils/eslintFormatter"),
					eslintPath: require.resolve("eslint"),
					failOnError: !emitErrorsAsWarnings,
					context: microUiPaths.appSrc,
					cache: true,
					cacheLocation: path.resolve(microUiPaths.appNodeModules, ".cache/.eslintcache"),
					// ESLint class options
					cwd: microUiPaths.appPath,
					resolvePluginsRelativeTo: __dirname,
					baseConfig: {
						extends: [require.resolve("eslint-config-react-app/base")],
						rules: {
							...(!hasJsxRuntime && {
								"react/react-in-jsx-scope": "error",
							}),
						},
					},
				}),
		].filter(Boolean),
		node: {
			module: "empty",
			dgram: "empty",
			dns: "mock",
			fs: "empty",
			http2: "empty",
			net: "empty",
			tls: "empty",
			child_process: "empty",
		},
		performance: false,
	};
};
