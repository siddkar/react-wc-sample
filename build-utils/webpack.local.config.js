const path = require("path");
const Dotenv = require("dotenv-webpack");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	mode: "development",
	devtool: "cheap-module-eval-source-map",
	plugins: [
		new Dotenv({
			path: "./.env",
		}),
		new HtmlWebpackPlugin({
			template: "./public/index.html",
			filename: "index.html",
		}),
	],
	output: {
		path: __dirname + "/public",
		filename: "bundle.js",
		publicPath: "/",
	},
	devtool: "inline-source-map",
	devServer: {
		contentBase: path.join(__dirname, "build"),
		historyApiFallback: true,
		port: 3000,
		open: true,
		hot: true,
	},
	stats: {
		assets: true,
		builtAt: true,
		chunks: true,
	},
	watchOptions: {
		poll: 1000,
		ignored: ["node_modules"],
	},
};
