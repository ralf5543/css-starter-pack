const webpack = require("webpack");
const path = require("path");
const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssets = require("optimize-css-assets-webpack-plugin");
const webfontsGenerator = require('webfonts-generator');

webfontsGenerator({
  files: [
    'src/assets/icons/apple.svg',
    'src/assets/icons/city.svg',
  ],
  dest: 'src/assets/fonts',
  fontName: 'myIconFont',
  types: ['woff2', 'woff'],
  cssDest: path.join('src/vendors', '_webFontsGenerator' + '.scss'),
  cssFontsPath: '../assets/fonts'
}, function(error) {
  if (error) {
    console.log('Fail!', error);
  } else {
    console.log('Done!');
  }
});

let config = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./public"),
    filename: "./bundle.js"
  },
  module: {
      rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.scss$/,
        use: ['css-hot-loader'].concat(ExtractTextWebpackPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader', 'sass-loader'],
        })),
      },
        {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 100000,
                mimetype: 'application/font-woff',
                name: 'assets/fonts/[hash].[ext]'
              }
            }
          ]
        }]
    },
    plugins: [
      new ExtractTextWebpackPlugin("styles.css"),
    ],
    devServer: {
      contentBase: path.resolve(__dirname, "./public"),
      historyApiFallback: true,
      inline: true,
      open: true,
      hot: true
    },
    devtool: "eval-source-map"
};

module.exports = config;

if (process.env.NODE_ENV === 'production') {
  module.exports.plugins.push(
    new UglifyJsPlugin(),
    new OptimizeCSSAssets()
  );
}
