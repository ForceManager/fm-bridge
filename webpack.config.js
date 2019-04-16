const path = require('path');
const env = require('yargs').argv.env;
const pkg = require('./package.json');

let libraryName = pkg.name;
let version = pkg.version;

let outputFile, mode;

if (env === 'build') {
  mode = 'production';
  outputFile = `${libraryName}-${version}.min.js`;
} else {
  mode = 'development';
  outputFile = `${libraryName}.js`;
}

const config = {
  mode: mode,
  entry: path.resolve(__dirname, 'src', 'index.js'),
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: outputFile,
    // sourceMapFilename: `${libraryName}.map`,
    library: 'FmBridge',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
    extensions: ['.json', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
      },
    ],
  },
};

module.exports = config;
