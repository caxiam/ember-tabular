import Ember from 'ember';
import layout from 'ember-tabular/templates/components/ember-tabular-alert';

/**
* Any errors returned from the request(s) are displayed in an alert box.
*
* @class EmberTabularAlert
*/
export default Ember.Component.extend({
  layout,
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
