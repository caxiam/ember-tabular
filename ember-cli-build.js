/* eslint-env node */
var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');

module.exports = function(defaults) {
  var environment = process.env.EMBER_ENV;

  var app = new EmberAddon(defaults, {
    babel: {
      includePolyfill: environment === 'test',
    },
    ['ember-drag-drop-polyfill']: {
      includeCSS: true,
      includeIconsCss: false,
      includeDebugCss: false,
      includeScrollBehavior: false,
    }
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */
  // Copy non-compiled bootstrap dependency
  var vendor = new Funnel('bower_components/bootstrap/dist/css/', {
    srcDir: '/',
    include: ['bootstrap.css.map'],
    destDir: '/assets'
  });

    // Bootstrap - https://github.com/twbs/bootstrap
  app.import('bower_components/bootstrap/dist/css/bootstrap.css');
  app.import('bower_components/bootstrap/dist/js/bootstrap.js');

  return mergeTrees([app.toTree(), vendor]);
};
