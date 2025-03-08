'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    autoImport: {
      watchDependencies: ['@universal-ember/table'],
    },
    'ember-cli-babel': {
      enableTypeScriptTransform: true,
    },
    'ember-cli-memory-leak-detector': {
      enabled: process.env.DETECT_MEMORY_LEAKS || false,
    },
  });

  const { Webpack } = require('@embroider/webpack');
  return require('@embroider/compat').compatBuild(app, Webpack, {
    staticAddonTestSupportTrees: true,
    staticAddonTrees: true,
    staticInvokables: true,
    staticEmberSource: true,
    packagerOptions: {
      webpackConfig: {},
    },
  });
};
