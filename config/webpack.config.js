const path = require(`path`);
const glob = require('glob');
const webpack = require(`webpack`);
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require(`html-webpack-plugin`);
const PurgeCSSPlugin = require('purgecss-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = (env, argv) => {
  return {
    mode: argv.mode,

    entry: `./src/ts/index.ts`,

    devtool: `source-map`,

    plugins: [
      new HtmlWebpackPlugin({
        title:
          argv.mode === `production` ? `Inline XBRL Viewer` : `DEVELOPMENT!`,
        inject: `head`,
        hash: true,
        template: `./src/index.html`,
        filename: `index.html`,
      }),
      new webpack.BannerPlugin(
        `Some simple comment that will be at the top of the bundle(s)`
      ),

      new MiniCssExtractPlugin({
        filename: `styles.[contenthash].css`,
      }),

      new CopyPlugin({
        patterns: [{ from: 'src/assets', to: 'assets' }],
      }),

      new PurgeCSSPlugin({
        paths: glob.sync(`${path.join(__dirname, '../src')}/**/*`, {
          nodir: true,
        }),
      }),

      new ESLintPlugin({
        extensions: ['ts']
      }),
    ],

    output: {
      filename:
        argv.mode === `production` ? `bundle.[contenthash].js` : `bundle.js`,
      path: path.resolve(__dirname, `../dist`),
      clean: true,
    },

    module: {
      rules: [
        // load TS
        {
          test: /\.tsx?$/,
          loader: `ts-loader`,
          options: {
            configFile: path.resolve(__dirname, `tsconfig.json`),
          },
          exclude: path.resolve(__dirname, `../node_modules`),
        },
        // load SCSS
        {
          test: /\.s[ac]ss$/i,
          use: [
            argv.mode === `production`
              ? MiniCssExtractPlugin.loader
              : `style-loader`,
            'css-loader',
            `sass-loader`,
          ],
        },
        // load html
        {
          test: /\.html$/i,
          loader: 'html-loader',
        },
        // load image(s)
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: `asset/resource`,
        },
        // load font(s)
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: `asset/resource`,
        },
      ],
    },

    resolve: {
      extensions: [`.tsx`, `.ts`, `.js`, '.scss'],
    },

    devServer: {
      open: true,
      compress: true,
      port: 3000,
      static: path.resolve(__dirname, `../dist`),
      watchFiles: [`./src/**/*.html`, `./src/**/*.scss`, `./src/**/*.ts`],
      client: {
        overlay: true,
        progress: true,
      },
    },

    optimization: {},
  };
};
