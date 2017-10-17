import Ember from 'ember';
import layout from 'ember-tabular/templates/components/ember-tabular-column-register';
import EmberTabularHelpers from 'ember-tabular/mixins/components/ember-tabular-helpers';

/**
* Generates a column object used within ember tabular table headings.
* Registers the user defined column with a global registry where tabular will auto-register the remaining attributes on the defined model.
*
* @class EmberTabularColumnRegister
*/
export default Ember.Component.extend(EmberTabularHelpers, {
  layout,
  /**
  * @property tagName
  * @type String
  * @default ''
  */
  tagName: '',
  action: null,
  registry: null,
  init() {
    this._super(...arguments);
    const registry = this.get('registry');
    const property = this.get('property');
    const selectable = this.get('selectable');
    const label = this.get('label') || this._formatColumnLabel(property);
    const isActive = this._checkIfUndefined(this.get('isActive'), true);
    const isCustom = this.get('isCustom') || false;
    const filter = this._checkIfUndefined(this.get('filter'), true);
    const list = this.get('list') || null;
    const sort = this._checkIfUndefined(this.get('sort'), true);
    const type = this.get('type') || 'text';
    let column = {
      property: property,
      selectable: selectable,
      label: label,
      isActive: isActive,
      isCustomTemplate: isCustom,
      filter: filter,
      list: list,
      sort: sort,
      type: type,
    };
    if (typeof this.get('isCustom') !== 'undefined' && registry) {
      let item = registry.find((el) => {
        return el.property === property;
      });
      if (!item) {
        // pass action up to ember-tabular to add column to registry
        this.get('addToRegistry')(column);
      }
    }
  },
  _checkIfUndefined(property, defaultValue) {
    return typeof property !== 'undefined' ? property : defaultValue;
  },
});
