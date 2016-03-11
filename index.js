/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-table-jsonapi',
  included: function(app) {
    this._super.included(app);

    app.import('vendor/app.css');
  }
};
