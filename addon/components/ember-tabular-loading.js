import Component from '@ember/component';
import layout from 'ember-tabular/templates/components/ember-tabular-loading';

/**
* Generates loading copy
*
*
* @class EmberTabularColumn
*/
export default Component.extend({
  layout,
  /**
  * @property tagName
  * @type String
  * @default ''
  */
  tagName: '',
  action: null,
  actions: {
    registryComplete(value) {
      this.registryComplete(value);
    },
  },
});
