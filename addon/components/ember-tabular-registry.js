import { next } from '@ember/runloop';
import Component from '@ember/component';

/**
*
* @class EmberTabularFooter
*/
export default Component.extend({
  /**
  * @property tagName
  * @type String
  * @default ''
  */
  tagName: '',
  init() {
    this._super(...arguments);
    // fix somehow modifying `columns` twice
    next(() => {
      // tell ember-tabular that the custom yields are complete
      this.registryComplete(true);
    });
  },
});
