import Ember from 'ember';

/**
*
* @class EmberTabularCell
*/
export default Ember.Component.extend({
  /**
  * @property tagName
  * @type String
  * @default ''
  */
  tagName: '',
  action: null,
  hasColProperty: Ember.computed('colProperty', 'column', function () {
    const colProperty = this.get('colProperty');
    const column = this.get('column');
    if (colProperty === column.property) {
      return true;
    }
    return false;
  }),
});
