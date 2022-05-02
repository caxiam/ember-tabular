import { computed } from '@ember/object';
import Component from '@ember/component';
import layout from 'ember-tabular/templates/components/ember-tabular-alert';

/**
* Any errors returned from the request(s) are displayed in an alert box.
*
* @class EmberTabularAlert
*/
export default Component.extend({
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
  typeClass: computed('type', function () {
    return `alert-${this.type}`;
  }),
});
