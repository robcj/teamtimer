const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const { execSync } = require('child_process');

function getGitInfo() {
  try {
    const commitId = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
    let tag = '';
    try {
      tag = execSync('git describe --tags --exact-match HEAD', { encoding: 'utf8' }).trim();
    } catch {
      // no exact tag on this commit
    }
    return { commitId, tag };
  } catch {
    return { commitId: 'unknown', tag: '' };
  }
}

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
        },
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.(scss|css)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp|ico)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      favicon: path.resolve(__dirname, 'images/favicon.ico'),
    }),
    new webpack.DefinePlugin({
      __GIT_TAG__: JSON.stringify(getGitInfo().tag),
      __GIT_COMMIT__: JSON.stringify(getGitInfo().commitId),
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 3000,
    hot: true,
  },
};
