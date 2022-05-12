module.exports = function (config) {
  const tests = [
    { pattern: '../src/ts/test.spec.+(ts|js)', type: `js` },
    { pattern: '../src/ts/**/*.spec.+(ts|js)', type: `js` },
  ];

  config.set({
    client: {
      jasmine: {
        random: false,
      },
    },
    singleRun: false,
    frameworks: ['jasmine', 'webpack'],
    files: tests,
    preprocessors: {
      '../src/ts/test.spec.+(ts|js)': ['webpack'],
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
    reporters: ['dots', 'progress'],
    browsers: ['Chrome'],
  });
};

function webpackConfig() {
  const config = require('./webpack.config.js');
  delete config.context;
  delete config.entry;
  delete config.output;
  delete config.devServer;
  // delete config.module.rules;
  //config.mode = `production`;

  return config;
}
