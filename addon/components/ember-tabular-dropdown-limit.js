import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['ember-tabular-dropdown-limit'],

  // populates limit dropdown
  limits: [10, 25, 50, 100, 500],
});
