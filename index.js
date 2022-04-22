'use strict';
var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: require('./package').name,
  included: function(app) {
    this._super.included.apply(this, arguments);

    app.import('vendor/app.css');
  },
};
