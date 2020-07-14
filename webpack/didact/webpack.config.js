const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
function resolve(dir) {
	return path.resolve(__dirname, dir)
}

module.exports = {
  entry: './src/app.js',
  output: {
    filename: 'app.js',
    path: resolve('dist')
  },
  mode: "none",
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: require.resolve("babel-loader"),

			}
		]
	},
	// ... 这里是其他配置 ...
	plugins: [
		new HtmlWebpackPlugin({
			template: resolve("index.html")
		})
	],
	devServer: {
    contentBase: path.join(__dirname, 'dist'),
		port: 8080,
		hot: true
  }
};