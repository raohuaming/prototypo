const path = require('path');
const webpack = require('webpack');

const node_modules = path.resolve(__dirname, 'node_modules');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	entry: {
		libs: [
			'react',
			'react-dom',
			'react-addons-css-transition-group',
			'react-addons-pure-render-mixin',
			'react-draggable',
			'react-joyride',
			'react-json-pretty',
			'react-router',
			'react-scrollbar/dist/no-css',
			'react-select',
			'moment',
			'babel-polyfill',
			'lifespan',
			'nexus-flux',
			'remutable',
			'bluebird',
			'jszip',
			'xxhashjs',
			'lodash',
			'diff',
		],
	},
	module: {
		noParse: [/(levelup)/],
	},
	output: {
		path: path.join(__dirname, 'dist/dll/'),
		filename: '[name].dll.js',
		library: '[name]_[hash]',
		libraryTarget: 'this',
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production'),
				TESTING_FONT: false,
			},
		}),
		new webpack.DllPlugin({
			path: path.join(__dirname, 'dist/dll/', '[name]-manifest.json'),
			name: '[name]_[hash]',
		}),
		new UglifyJsPlugin({
			sourceMap: true,
			include: __dirname,
			extractComments: true,
		}),
	],
};
