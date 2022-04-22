'use strict';
var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: 'ember-tabular',
  included: function(app) {
    this._super.included.apply(this, arguments);

    app.import('vendor/app.css');
  },
};
