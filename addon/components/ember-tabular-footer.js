import Ember from 'ember';
import layout from 'ember-tabular/templates/components/ember-tabular-footer';

/**
*
* @class EmberTabularFooter
*/
export default Ember.Component.extend({
  layout,
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
      this.get('registryComplete')(true);
    });
  },
});
