import Ember from 'ember';
import layout from 'ember-tabular/templates/components/ember-tabular-column';

/**
* Generates a column object.
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
export default Ember.Component.extend({
  layout,
  /**
  * @property tagName
  * @type String
  * @default ''
  */
  tagName: '',
  action: null,
  hasProperty: Ember.computed('property', 'column', function () {
    const property = this.get('property');
    const column = this.get('column');
    if (column && property === column.property) {
      return true;
    }
    return false;
  }),
});
