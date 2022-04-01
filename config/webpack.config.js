const path = require(`path`);
const glob = require('glob');
const webpack = require(`webpack`);
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require(`html-webpack-plugin`);
const PurgeCSSPlugin = require('purgecss-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = (env, argv = { mode: `production` }) => {
  return {
    mode: argv.mode,

    entry: `./src/ts/index.ts`,

    plugins: [
      new HtmlWebpackPlugin({
        title:
          argv.mode === `production` ? `Inline XBRL Viewer` : `DEVELOPMENT!`,
        inject: `head`,
        hash: true,
        template: `./src/index.html`,
        filename: `index.html`,
      }),
      new webpack.BannerPlugin({
        banner: `Created by staff of the U.S. Securities and Exchange Commission.\nData and content created by government employees within the scope of their employment\nare not subject to domestic copyright protection. 17 U.S.C. 105.`,
      }),

      new MiniCssExtractPlugin({
        filename: `styles.[contenthash].min.css`,
      }),

      argv.mode === 'development'
        ? new CopyPlugin({
            patterns: [{ from: 'src/assets', to: 'assets' }],
          })
        : false,

      new PurgeCSSPlugin({
        paths: glob.sync(`${path.join(__dirname, '../src')}/**/*`, {
          nodir: true,
        }),
      }),

      new ESLintPlugin({
        extensions: ['ts'],
      }),
    ].filter(Boolean),

    output: {
      filename:
        argv.mode === `production`
          ? `bundle.[contenthash].min.js`
          : `bundle.js`,
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
          exclude: [path.resolve(__dirname, `../node_modules`)],
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
          options: {
            esModule: true,
          },
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
      extensions: [`.tsx`, `.ts`, `jsx`, `.js`, '.scss'],
    },

    devtool: argv.mode === `production` ? `source-map` : `inline-source-map`,

    devServer: {
      open: true,
      compress: true,
      port: 3000,
      static: path.resolve(__dirname, `../dist`),
      watchFiles: [`./src/**/*.html`, `./src/**/*.scss`, `./src/**/*.ts`],
      client: {
        overlay: true,
        // progress: true,
      },
    },

    optimization: {
      minimize: true,
      usedExports: true,
    },
    performance: {
      hints: false,
    },
  };
};
