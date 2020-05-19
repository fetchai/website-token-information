const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const htmlPlugin = new HtmlWebPackPlugin({
  template: "./src/index.html",
  filename: "./index.html"
});
const sassRule = {
  test: /(\.s?css)|(\.sass)$/,
  oneOf: [
    // if ext includes module as prefix, it perform by css loader.
    {
      test: /.module(\.s?css)|(\.sass)$/,
      use: [
        "style-loader",
        {
          loader: "css-loader",
          options: {
            modules: {
              localIdentName: "[local]-[hash:base64]"
            },
            localsConvention: "camelCase"
          }
        },
        "sass-loader"
      ]
    },
    {
      use: [
        "style-loader",
        { loader: "css-loader", options: { modules: false } },
        "sass-loader"
      ]
    }
  ]
};
module.exports = {
  entry: "./src/index.js",
  output: { // NEW
    path: path.join(__dirname, 'dist'),
    filename: "[name].js"
  }, // NEW Ends
  plugins: [htmlPlugin,  new CopyPlugin([
      { from: './src/assets', to: 'assets' }
    ])],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: [
          /node_modules/,
          /imported-modules/,
          ],
        use: {
          loader: "babel-loader"
        }
      },sassRule
    ]
  }
};

