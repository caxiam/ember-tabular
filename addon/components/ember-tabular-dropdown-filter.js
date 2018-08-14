import EmberTabularGlobalFilter from './ember-tabular-global-filter';
import layout from 'ember-tabular/templates/components/ember-tabular-dropdown-filter';

/**
* ## Dropdown Filter
* Use the dropdown filter globally. One way to do this is by setting up a computed property that returns an array of label/value objects.
```js
export default Ember.Controller.extend({
  users: null,
  actions: {
    setIsAdminFilter(object) {
      if (object) {
        this.set('isAdminFilter', object.value);
      } else {
        this.set('isAdminFilter', null);
      }
    },
  },
  adminContent: Ember.computed(function() {
    return [
      {
        label: 'Yes',
        value: true,
      },
      {
        label: 'No',
        value: false,
      }
    ];
  }),
});
```
```hbs
{{#ember-tabular-dropdown-filter filter=filter filterProperty="isAdmin" label="Is Admin" searchFilter=isAdminFilter}}
    {{#power-select
        options=adminContent
        selected=(find-by adminContent 'value' isAdminFilter)
        searchField="label"
        searchEnabled=false
        placeholder="Select to filter"
        onchange=(action "setIsAdminFilter")
        as |option|}}
            {{option.label}}
    {{/power-select}}
{{/ember-tabular-dropdown-filter}}
```
*
* @class EmberTabularDropdownFilter
* @extends EmberTabularGlobalFilter
*/
export default EmberTabularGlobalFilter.extend({
  layout,
});
