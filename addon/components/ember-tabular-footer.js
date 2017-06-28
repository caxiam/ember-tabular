import Ember from 'ember';

/**
*
* @class EmberTabularFooter
*/
export default Ember.Component.extend({
  /**
  * @property tagName
  * @type String
  * @default ''
  */
  tagName: '',
  init() {
    this._super(...arguments);
    // fix somehow modifying `columns` twice
    Ember.run.next(() => {
      // tell ember-tabular that the custom yields are complete
      this.get('registerComplete')(true);
    });
  },
});
