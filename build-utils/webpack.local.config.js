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
	watchOptions: {
		poll: 1000,
		ignored: ["node_modules"],
	},
};
