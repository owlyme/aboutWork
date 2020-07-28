const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	entry: "./src/index.js",
	output: {
		filename: 'bundle.js',
    	path: path.resolve(__dirname, 'dist')
	},
	mode: "none",
	module: {
		rules: [
			{
				test: /\.js$/,
				use: 'babel-loader'
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "index.html"
		})
	],
	devtool: 'inline-source-map',
	devServer: {
		contentBase: path.join(__dirname, "dist"),
		port: 9000,
		historyApiFallback: true,
		hot: true
	}
}