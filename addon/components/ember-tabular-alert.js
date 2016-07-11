import Ember from 'ember';

/**
* @class EmberTabularAlert
*/
export default Ember.Component.extend({
  /**
  * @property tagName
  * @type String
  * @default 'div'
  */
  tagName: 'div',
  /**
  * @property type
  * @type String
  * @default 'info'
  */
  type: 'info',
  /**
  * @property typeClass
  * @type String
  * @default 'alert-[type]'
  */
  typeClass: Ember.computed('type', function () {
    return `alert-${this.get('type')}`;
  }),
});
