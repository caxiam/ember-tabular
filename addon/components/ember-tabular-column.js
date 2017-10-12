import Ember from 'ember';
import EmberTabularHelpers from 'ember-tabular/mixins/components/ember-tabular-helpers';

/**
* Generates a column object used within ember tabular table headings
* Sets sensible defaults which can be overwritten when setting up the template
* for ember tabular
*
  ```hbs
  {{! app/templates/my-route.hbs }}

  {{#ember-tabular class="table-basic-global-filter" modelName="user" record=users2 filter=filter as |et|}}
    {{et.column property="username" isCustom=false filter=false sort=false}}
    {{et.column property="createdAt" isActive=false isCustom=false filter=true sort=true type="date"}}
  {{/ember-tabular}}

  {{#ember-tabular class="table-basic-global-filter" modelName="user" record=users2 filter=filter as |et|}}
    {{#et.column property="isAdmin" as |record column|}}
        {{#if record.isAdmin}}
            Yes
        {{else}}
            No
        {{/if}}
    {{/et.column}}
  {{/ember-tabular}}
  ```
*
* @class EmberTabularColumn
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
