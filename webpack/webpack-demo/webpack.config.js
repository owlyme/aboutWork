const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: "none",
	module: {
		rules: [
			{
				test: /\.js$/,
				use: [
				  {
					loader: path.resolve('./xy-loader/test-loader.js'),
					options: {
						a: "b"
					}
				  }
				]
			}
			// {
			// 	test: /\.css$/,
			// 	use: [
			// 		'style-loader',
			// 		'css-loader'
			// 	]
			// }
		]
	}
};