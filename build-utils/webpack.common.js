const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");

const config = {
	mode: "development",
	output: {
		publicPath: "/",
	},
	entry: "./src/index.tsx",
	module: {
		rules: [
			{
				test: /\.(ts|js)x?$/i,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"],
					},
				},
			},
			{
				test: /\.(svg|png|gif|jpg|ico)$/,
				use: {
					loader: "file-loader",
					options: {
						context: "src/assets",
						name: "root[path][name].[ext]",
					},
				},
			},
			{
				// look for .css or .scss files
				test: /\.(css|scss)$/,
				use: [
					{
						loader: "style-loader",
					},
					{
						loader: "css-loader",
					},
				],
			},
		],
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
	},
	plugins: [
		new CleanWebpackPlugin(),
		new WebpackPwaManifest({
			short_name: "React WC Sample App",
			name: "React WC Sample App",
			theme_color: "#000000",
			description: "My awesome Progressive Web App!",
			crossorigin: "use-credentials", //can be null, use-credentials or anonymous
			icons: [
				{
					src: path.resolve("src/assets/favicon.ico"),
					sizes: [96, 128, 192, 256, 384, 512],
					type: "image/x-icon",
				},
			],
		}),
		new FaviconsWebpackPlugin("./src/assets/favicon.ico"),
		new ForkTsCheckerWebpackPlugin({
			async: false,
		}),
		new ESLintPlugin({
			extensions: ["js", "jsx", "ts", "tsx"],
		}),
		new webpack.HotModuleReplacementPlugin(),
	],
};

module.exports = config;
