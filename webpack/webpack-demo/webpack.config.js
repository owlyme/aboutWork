const path = require('path');
const HelloWorldPlugin = require("./xy-plugins/hello-world.js")
const HelloAsyncPlugin = require("./xy-plugins/hello-async.js")
const FileListPlugin = require("./xy-plugins/file-list.js")
const AssetMapPlugin = require("./xy-plugins/asset-map.js")

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
					loader: path.resolve('./xy-loader/auth-loader.js'),
					options: {
						a: "b"
					}
				  },
				  {
					loader: path.resolve('./xy-loader/time-loader.js'),
					options: {
						time: "2020-06-23"
					}
				  },
				  {
					loader: path.resolve('./xy-loader/dependencies-loader.js'),
					options: {
						time: "2020-06-23"
					}
				  },
				]
			},
			{
				test: /\..*$/,
				use: [
				  
				  {
					loader: path.resolve('./xy-loader/loading-file-loader.js'),
					options: {
						time: "2020-06-23"
					}
				  },
				]
			}
		]
	},
	// ... 这里是其他配置 ...
	plugins: [
		new HelloWorldPlugin({options: true}),
		new HelloAsyncPlugin(),
		new FileListPlugin(),
		// new AssetMapPlugin()
	  ]
};