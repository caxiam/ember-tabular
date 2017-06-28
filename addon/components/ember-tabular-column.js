import Ember from 'ember';
import EmberTabularHelpers from 'ember-tabular/mixins/components/ember-tabular-helpers';

/**
*
* @class EmberTabularCell
*/
export default Ember.Component.extend(EmberTabularHelpers, {
  /**
  * @property tagName
  * @type String
  * @default ''
  */
  tagName: '',
  action: null,
  registry: null,
  hasProperty: Ember.computed('property', 'column', function () {
    const property = this.get('property');
    const column = this.get('column');
    if (column && property === column.property) {
      return true;
    }
    return false;
  }),
  init() {
    this._super(...arguments);
    const registry = this.get('registry');
    const property = this.get('property');
    const label = this.get('label') || this._formatColumnLabel(property);
    const isActive = typeof this.get('isActive') !== 'undefined' ? this.get('isActive') : true;
    const isCustom = this.get('isCustom') || false;
    const filter = typeof this.get('filter') !== 'undefined' ? this.get('filter') : true;
    const sort = typeof this.get('sort') !== 'undefined' ? this.get('sort') : true;
    const type = this.get('type') || 'text';
    console.log('property', property);
    console.log('isCustom', isCustom);
    console.log('filter', filter);
    console.log('sort', sort);
    let column = {
      property: property,
      label: label,
      isActive: isActive,
      isCustomTemplate: isCustom,
      filter: filter,
      sort: sort,
      type: type,
    };
    if (isCustom) {
      let item = registry.find((el) => {
        return el.property === property;
      });
      if (!item) {
        console.log('ADD TO REGISTRY', column);
        registry.addObject(column);
      }
    }
  },
});
