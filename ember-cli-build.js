/* jshint node:true */
/* global require, module */
var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
var pickFiles = require('broccoli-static-compiler');
var mergeTrees = require('broccoli-merge-trees');

module.exports = function(defaults) {
  var environment = process.env.EMBER_ENV,
    config = {};

  if (environment === 'test') {
    config = {
      babel: {
        includePolyfill: true
      }
    };
  }

  var app = new EmberAddon(defaults, config);

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */
  // Copy non-compiled bootstrap dependency
  var vendor = pickFiles('bower_components/bootstrap/dist/css/', {
    srcDir: '/',
    files: ['bootstrap.css.map'],
    destDir: '/assets'
  });

    // Bootstrap - https://github.com/twbs/bootstrap
  app.import('bower_components/bootstrap/dist/css/bootstrap.css');
  app.import('bower_components/bootstrap/dist/js/bootstrap.js');

  // Specifically for PhantomJS 1.9.8
  if (environment === 'test') {
    app.import('bower_components/DOM-shim/lib/DOM-shim.js');
  }

  return mergeTrees([app.toTree(), vendor]);
};
