import Component from '@ember/component';
import layout from 'ember-tabular/templates/components/ember-tabular-column-register';
import EmberTabularHelpers from 'ember-tabular/mixins/components/ember-tabular-helpers';

/**
* Generates a column object used within ember tabular table headings.
* Registers the user defined column with a global registry where tabular will auto-register the remaining attributes on the defined model.
*
* @class EmberTabularColumnRegister
*/
export default Component.extend(EmberTabularHelpers, {
  layout,
  /**
  * @property tagName
  * @type String
  * @default ''
  */
  tagName: '',
  action: null,
  registry: null,
  columnOrder: null,
  init() {
    this._super(...arguments);
    const registry = this.registry;
    const property = this.property;
    const selectable = this.selectable;
    const label = this.label || this._formatColumnLabel(property);
    const isActive = this._checkConfigForColumn(property);
    const isCustom = this.isCustom || false;
    const filter = this._checkIfUndefined(this.filter, true);
    const list = this.list || null;
    const sort = this._checkIfUndefined(this.sort, true);
    const type = this.type || 'text';
    const columnClass = this._checkIfUndefined(this['class'], null);
    let column = {
      property: property,
      selectable: selectable,
      label: label,
      isActive: isActive,
      isCustom: isCustom,
      filter: filter,
      list: list,
      sort: sort,
      type: type,
      class: columnClass,
    };
    if (typeof this.isCustom !== 'undefined' && registry) {
      let item = registry.find((el) => {
        return el.property === property;
      });
      if (!item) {
        // pass action up to ember-tabular to add column to registry
        this.addToRegistry(column);
      }
    }
  },
  _checkIfUndefined(property, defaultValue) {
    return typeof property !== 'undefined' ? property : defaultValue;
  },
  _checkConfigForColumn(property) {
    const columnOrder = this.columnOrder;
    if (columnOrder) {
      if (columnOrder.indexOf(property) === -1) {
        return false;
      }
      return true;
    }
    return this._checkIfUndefined(this.isActive, true);
  },
});
