// webpack.config.js
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.tsx',
  mode: 'development',
  output: {
    filename: 'extension.js',
    path: path.resolve(__dirname, 'public/dist')
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    fallback: {
      "fs": false,
      "crypto": require.resolve('crypto-browserify'),
      "path": require.resolve('path-browserify'),
      "stream": require.resolve('stream-browserify'),
      "assert": require.resolve('assert'),
      "util": require.resolve('util/'),
      "vm": require.resolve('vm-browserify'),
      "url": require.resolve('url'),
      "zlib": require.resolve('browserify-zlib'),
      "os": require.resolve('os-browserify/browser'),
      "http": require.resolve('stream-http'),
      "https": require.resolve('https-browserify'),
      "buffer": require.resolve('buffer/')
    }
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript'
            ]
          }
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.ContextReplacementPlugin(
      /sequelize/,
      (context) => {
        if (!/\/sequelize\//.test(context.context)) return;
        Object.assign(context, {
          regExp: /^$/,
          request: undefined,
        });
      }
    )
  ],
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  }
};
