module.exports = function (config) {
  const tests = [
    { pattern: '../src/ts/index.+(ts|js)', type: `js` },
    { pattern: '../src/ts/**/*.spec.+(ts|js)', type: `js` },
  ];

  config.set({
    client: {
      jasmine: {
        random: false,
      },
      clearContext: false,
    },
    singleRun: false,
    frameworks: ['jasmine', 'webpack'],
    files: tests,
    preprocessors: {
      '../src/ts/index.+(ts|js)': ['webpack'],
      '../src/ts/**/*.spec.+(ts|js)': ['webpack'],
    },
    mime: {
      'text/x-typescript': ['ts', 'tsx'],
    },
    webpack: webpackConfig(),
    webpackMiddleware: {
      noInfo: true,
    },
    colors: true,
    reporters: ['dots', 'progress', 'kjhtml'],
    browsers: [
      'Chrome',
      //`ChromeHeadless`,
      //`Firefox`,
      //`Opera`,
      //`Safari`
    ],
  });
};

function webpackConfig() {
  const config = require('./webpack.config.js');
  delete config.context;
  delete config.entry;
  delete config.output;
  delete config.devServer;

  return config({ env: { copy: true }, argv: { mode: `production` } });
}
