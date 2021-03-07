const webpack = require("webpack");
const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common.js");

// const getAddons = (addonsArgs) => {
// 	let addons = Array.isArray(addonsArgs) ? addonsArgs : [addonsArgs];

// 	return addons.filter(Boolean).map((name) => require(`./addons/webpack.${name}.js`));
// };

module.exports = ({ env, addon }) => {
	const envConfig = require(`./webpack.${process.env.NODE_ENV}.config.js`);
	// return webpackMerge(commonConfig, envConfig, ...getAddons(addon));
	return merge(commonConfig, envConfig);
};
