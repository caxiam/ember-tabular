import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['ember-tabular-dropdown-limit'],

  // populates limit dropdown
  limits: [10, 25, 50, 100, 500],

  autoHide: Ember.computed('record', 'count', function() {
    let record = this.get('record');
    let count = this.get('count');
    let firstLimit = this.get('limits')[0];
    if (record) {
      let resultsLength = record.get('length');
      if (resultsLength > firstLimit || (resultsLength === firstLimit && count > 1)) {
        return true;
      }
    }
    return false;
  }),
});
