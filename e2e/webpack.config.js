const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    index: './pages/index/index.ts',

    // 连接测试
    connection: './pages/rpc/connection.ts',
    'connection-client': './pages/rpc/client.ts',
    'connection-server': './pages/rpc/server.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: { cacheDirectory: true, cacheCompression: false },
        },
      },
      {
        test: /\.tsx?$/,
        use: { loader: 'babel-loader', options: { cacheDirectory: true, cacheCompression: false } },
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
    new HtmlWebpackPlugin({
      filename: 'template.html',
      chunks: [],
      template: './pages/shared/template.html',
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
    plugins: [new TsconfigPathsPlugin()],
  },
  devtool: 'source-map',
};
