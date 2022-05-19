module.exports = function (config) {
  const tests = [{ pattern: '../src/ts/**/*.+(ts|js)', type: `js` }];
  config.set({
    client: {
      jasmine: {
        random: false,
      },
    },
    frameworks: ['jasmine', 'webpack'],
    files: tests,
    preprocessors: {
      '../src/ts/**/*.+(ts|js)': ['webpack'],
    },
    mime: {
      'text/x-typescript': ['ts', 'tsx'],
    },

    webpack: webpackConfig(),
    webpackMiddleware: {
      noInfo: true,
    },
    colors: true,
    singleRun: false,
    concurrency: Infinity,
    failOnEmptyTestSuite: false,
    autoWatch: true,
    logLevel: config.LOG_INFO,
    port: 9876,
    reporters: ['dots', 'progress', 'kjhtml'],
    browsers: ['Chrome', 'ChromeHeadless'],
  });
};

function webpackConfig() {
  const config = require('./webpack.config.js');
  delete config.context;
  delete config.entry;
  delete config.output;
  delete config.devServer;
  // delete config.module.rules;
  config.mode = `production`;

  return config({ env: { copy: true }, argv: { mode: `production` } });
}
