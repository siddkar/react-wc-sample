const path = require("path");
const Dotenv = require("dotenv-webpack");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
	mode: "production",
	devtool: "source-map",
	stats: {
		chunks: true,
		chunkModules: true,
		colors: true,

	},
	plugins: [
		new Dotenv({
			path: "./.env.production",
		}),
		new MiniCssExtractPlugin({
			filename: "[name].[hash].css",
			chunkFilename: "[name].[hash].css",
		}),
		new HtmlWebpackPlugin({
			template: path.resolve("./public/index.html"),
			filename: "index.html",
			inject: "body",
			minify: {
				collapseWhitespace: true,
			},
			chunksSortMode: "auto",
		}),
		new webpack.optimize.DedupePlugin(), //dedupe similar code
		new webpack.optimize.UglifyJsPlugin(), //minify everything
		new webpack.optimize.AggressiveMergingPlugin(), //Merge chunks
	],
	output: {
		path: path.resolve(__dirname, "../", "dist"),
		filename: "[name].[hash].js",
		chunkFilename: "[name].[hash].js",
		publicPath: "/",
	},
	optimization: {
		minimize: true,
		splitChunks: {
			chunks: "all",
			minChunks: 2,
		},
		minimizer: [
			new TerserPlugin({
				sourceMap: false,
				cache: true,
				parallel: true,
				terserOptions: {
					ecma: undefined,
					warnings: false,
					parse: {},
					compress: {},
					mangle: true, // Note `mangle.properties` is `false` by default.
					module: false,
					output: null,
					toplevel: false,
					nameCache: null,
					ie8: false,
					keep_classnames: undefined,
					keep_fnames: false,
					safari10: false,
				},
			}),
			new OptimizeCSSAssetsPlugin({}),
		],
	},
	performance: {
		hints: false,
	},
};
