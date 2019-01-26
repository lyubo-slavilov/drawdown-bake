const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
module.exports = [
  (env, argv) => {
    const isProduction = argv.mode === 'production';
    const config = {
        target: 'web',
        entry: './src/web/index.js',
        output: {
            filename: 'drawdown-bake-render.js',
            path: path.resolve(__dirname, 'web'),
            library: ['drawdown']
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules)/,
                    use: {
                        loader: "babel-loader"
                    }
                },
                {
                    test: /\.scss$/,
                    use: [
                        {
                            loader: 'style-loader'
                        },
                        {
                            loader: 'css-loader'
                        },
                        {
                            loader: 'sass-loader'
                        }
                    ]
                },
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: 'style-loader'
                        },
                        {
                            loader: 'css-loader'
                        }
                    ]
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif|ttf|woff|woff2|eot|mp3|webp)$/,
                    use: [
                        {
                            loader: 'file-loader?name=assets/[name]_[hash].[ext]'
                        }
                    ]
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
              title: "Drawdown Bake Renderer",
              template: './src/web/index.html'
            }),
        ]
    };

    return config;
  },
  (env, argv) => {

    const config = {
      target: 'node',
      entry: './src/node/drawdown-bake.js',
      output: {
        filename: 'drawdown-bake.js',
        path: path.resolve(__dirname, 'bin')
      },
      externals: [nodeExternals()],
      node: {
        __dirname: false
      }
    }

    return config;
  }
];
