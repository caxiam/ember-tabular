import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  type: 'info',
  typeClass: Ember.computed('type', function() {
    return 'alert-' + this.get('type');
  }),
});
