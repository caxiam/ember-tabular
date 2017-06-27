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
  hasProperty: Ember.computed('property', 'column', function () {
    const property = this.get('property');
    const column = this.get('column');
    if (property === column.property) {
      return true;
    }
    return false;
  }),
});
