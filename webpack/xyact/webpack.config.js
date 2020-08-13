const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  entry: './src/app.js',
  output: {
    filename: '/bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'inline-source-map',
  mode: "none",
	module: {
		rules: [
			{
				test: /\.js$/,
				use: 'babel-loader'
			}
		
		]
	},
	// ... 这里是其他配置 ...
	plugins: [
		new HtmlWebpackPlugin({
			template: "index.html"
		})
	],
	devServer: {
		contentBase: path.join(__dirname, "dist"),
		port: 9000
	  }
};