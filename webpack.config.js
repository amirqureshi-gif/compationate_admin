const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  return {
    entry: path.resolve(__dirname, 'src', 'index.js'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'static/js/bundle.[contenthash].js',
      publicPath: '/',
      clean: true
    },
    devtool: isProd ? false : 'source-map',
    resolve: {
      extensions: ['.js', '.jsx']
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: { loader: 'babel-loader' }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(png|svg|jpe?g|gif|webp)$/i,
          type: 'asset/resource'
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public', 'index.html')
      }),
      new webpack.DefinePlugin({
        'process.env.REACT_APP_API_BASE_URL': JSON.stringify(
          process.env.REACT_APP_API_BASE_URL || ''
        )
      })
    ],
    devServer: {
      port: process.env.PORT ? Number(process.env.PORT) : 3001,
      historyApiFallback: true,
      static: {
        directory: path.resolve(__dirname, 'public')
      },
      hot: true,
      open: false
    }
  };
};

