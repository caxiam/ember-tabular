/* jshint node: true */
'use strict';
var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: 'ember-tabular',
  included: function(app) {
    this._super.included.apply(this, arguments);

    app.import('vendor/app.css');
    app.import(app.bowerDirectory + '/font-awesome/css/font-awesome.css');

    // DPicker - https://github.com/soyuka/dpicker
    app.import(app.bowerDirectory + '/maquette/dist/maquette.min.js');
    app.import(app.bowerDirectory + '/dpicker/dist/dpicker.min.js');
  },
  postprocessTree: function( type, tree ) {
    // extract font-awesome fonts and place into /fonts directory
    var fonts = new Funnel( 'bower_components/font-awesome', {
      srcDir: 'fonts',
      destDir: '/fonts',
      include: [ 'fontawesome-webfont.*' ]
    });

    return mergeTrees(
      [
        tree,
        fonts
      ],
      {
        overwrite: true
      }
    );
  }
};
