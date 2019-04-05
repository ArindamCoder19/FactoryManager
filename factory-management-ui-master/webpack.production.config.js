var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CompressionPlugin = require('compression-webpack-plugin');
var webpack = require("webpack");

const extractSass = new ExtractTextPlugin({
    filename: "bundle.css"
});

module.exports = {
  entry: ['./src/js/index.js', './src/css/main.scss'],
  output: {
    path: __dirname+'/dist',
    filename: 'bundle.js',
    publicPath: '/',
    chunkFilename: '[name].[chunkhash].js'
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /(node_modules)/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ["es2015", "react", "stage-0"],
          plugins: ['transform-decorators-legacy']
        }
      }]
    },
    {
      test: /\.(scss|css)$/,
      use: extractSass.extract({
          use: ["css-loader?-minimize", "sass-loader"],
          // use style-loader in development
          fallback: "style-loader"
      })
    },
    {
      test: /\.(jpe?g|png|gif|svg)$/i,
      use: 'file-loader?name=[path][name].[ext]'
    }]
  },
  plugins: [
    extractSass,
    new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true
    }),
    new CompressionPlugin({
      exclude: /(node_modules)/,
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/
    })
  ]
}
