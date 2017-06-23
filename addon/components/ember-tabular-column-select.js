import Ember from 'ember';

/**
*
* @class EmberTabularColumnSelect
*/
export default Ember.Component.extend({
  /**
  * @property tagName
  * @type String
  * @default 'div'
  */
  tagName: 'div',

  actions: {
    toggleColumn(column) {
      column.toggleProperty('isActive');
    },
  },
});
