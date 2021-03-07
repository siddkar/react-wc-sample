const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

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
		],
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			template: "./public/index.html",
		}),
		new webpack.HotModuleReplacementPlugin(),
	],
};

module.exports = config;
