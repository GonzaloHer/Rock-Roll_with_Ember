'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    // Add options here
    postcssOptions: {
      compile: {
        plugins: [{ module: require('tailwindcss') }],
      },
    },
  });
  return app.toTree();
};
