const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    index: './pages/index/index.ts',

    // Test connection cases.
    rpc: './pages/rpc/rpc.ts',
    rpcServer: './pages/rpc/server.ts',

    // Test document cases.
    document: './pages/document/document.ts',
    documentServer: './pages/document/server.ts',
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
      filename: 'rpc.html',
      chunks: ['rpc'],
      template: './pages/rpc/rpc.html',
    }),
    new HtmlWebpackPlugin({
      filename: 'template.html',
      chunks: [],
      template: './pages/shared/template.html',
    }),
    new HtmlWebpackPlugin({
      filename: 'document.html',
      chunks: ['document'],
      template: './pages/document/document.html',
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
