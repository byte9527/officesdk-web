const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    index: './pages/index/index.ts',
    connection: './pages/rpc/connection.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      chunks: ['index'],
      template: './pages/index/index.html',
    }),
    new HtmlWebpackPlugin({
      filename: 'connection.html',
      chunks: ['connection'],
      template: './pages/rpc/connection.html',
    }),
  ],
  devServer: {
    static: [
      {
        directory: path.join(__dirname, 'dist'),
      },
      {
        directory: path.join(__dirname, 'static'),
        publicPath: '/static',
      },
    ],
    compress: true,
    port: 3344,
    hot: 'only',
    open: true,
  },
  resolve: {
    extensions: ['.js', '.ts', '.json'],
  },
  devtool: 'source-map',
};
