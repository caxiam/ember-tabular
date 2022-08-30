import { computed } from '@ember/object';
import Component from '@ember/component';
import layout from 'ember-tabular/templates/components/ember-tabular-dropdown-limit';

/**
* Sets up component for changing the table row count/limit.
*
* @class EmberTabularDropdownLimit
*/
export default Component.extend({
  layout,
  /**
  * @property tagName
  * @type String
  * @default 'div'
  */
  tagName: 'div',
  classNames: ['ember-tabular-dropdown-limit'],

  /**
  * @property limits
  * @type Array
  * @default [10, 25, 50, 100]
  */
  limits: [10, 25, 50, 100],

  /**
  * Computed Property to determine if the result set is large enough to display the dropdown limit component.
  *
  * @property autoHide
  * @param record
  * @param count
  * @return Boolean
  */
  autoHide: computed('record', 'count', function() {
    let record = this.record;
    let count = this.count;
    let firstLimit = this.limits[0];
    if (record) {
      let resultsLength = record.get('length');
      if (resultsLength > firstLimit || (resultsLength === firstLimit && count > 1)) {
        return true;
      }
    }
    return false;
  }),
});
