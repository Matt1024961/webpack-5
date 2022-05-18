module.exports = function (config) {
  const tests = [{ pattern: '../src/ts/**/*.spec.+(ts|js)', type: `js` }];

  config.set({
    client: {
      jasmine: {
        random: false,
      },
    },
    singleRun: true,
    frameworks: ['jasmine', 'karma-typescript'],
    files: tests,
    preprocessors: {
      '../src/ts/**/*.spec.+(ts|js)': ['karma-typescript'],
    },
    mime: {
      'text/x-typescript': ['ts', 'tsx'],
    },
    karmaTypescriptConfig: {
      compilerOptions: {
        module: 'commonjs',
        target: 'ESNext'
      },
      tsconfig: './tsconfig.json',
    },
    webpack: webpackConfig(),
    webpackMiddleware: {
      noInfo: true,
    },
    colors: true,
    reporters: ['dots', 'progress', 'karma-typescript'],
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
