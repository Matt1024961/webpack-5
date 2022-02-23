// Karma configuration
// Generated on Wed Feb 23 2022 08:02:11 GMT-0700 (Mountain Standard Time)
const webpackConfig = require('./webpack.config.spec');

module.exports = function (config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: ``,

    // frameworks to use
    // available frameworks: https://www.npmjs.com/search?q=keywords:karma-adapter
    frameworks: ['mocha', `webpack`],

    // list of files / patterns to load in the browser
    files: [
      {
        pattern: '../src/**/*.spec.ts',
        watched: false,
        type: 'js',
      },
    ],

    // list of files / patterns to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://www.npmjs.com/search?q=keywords:karma-preprocessor
    preprocessors: {
      '../src/**/*.spec.ts': ['webpack'],
    },

    mime: {
      'text/x-typescript': ['ts', 'tsx'],
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      noInfo: true,
    },
    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://www.npmjs.com/search?q=keywords:karma-reporter
    reporters: ['progress', 'coverage'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://www.npmjs.com/search?q=keywords:karma-launcher
    browsers: [
      'Chrome',
      'ChromeHeadless',
      // 'ChromeCanary',
      // 'Firefox',
      // 'Safari',
      // 'PhantomJS',
      // 'Opera',
      // 'IE',
    ],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser instances should be started simultaneously
    concurrency: Infinity,

    failOnEmptyTestSuite: false,
  });
};

// module.exports = function (config) {
//   config.set({
//     browsers: ['Chrome'],
//     singleRun: true,
//     frameworks: ['webpack'],
//     files: [
//       { pattern: './../src/**/*.spec.ts', watched: false, type: 'js' },
//       //   { pattern: 'test/**/*_test.js', watched: false },
//     ],
//     preprocessors: {
//       './../src/*.spec.ts': ['webpack'],
//       'test/**/*_test.js': ['webpack'],
//     },
//     webpack: {
//       // Any custom webpack configuration...
//     },
//     plugins: ['karma-webpack'],
//   });
// };