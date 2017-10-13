import EmberTabularGlobalFilter from './ember-tabular-global-filter';
import layout from 'ember-tabular/templates/components/ember-tabular-date-filter';

/**
* ## Date Filter
* Date filter changes `input type="date"` to take advantage of a browser's HTML5 date widget. Typically the date filter component would be rendered into the `{{yield header}}` of the main table component using the yield conditional `{{#if section.isHeader}} ...`.
*
* However, it can be used outside of the context of the main component if the proper properties are shared between the main component and sub-component.
*
* - Sent in request as: `?filter[filterProperty]=dateFilter`, e.g. `?filter[updated-at]=2015-06-29`
```hbs
{{ember-tabular-date-filter
    filter=filter
    filterProperty="updatedAt"
    label="Last Updated"}}
```
* @class EmberTabularDateFilter
*/
export default EmberTabularGlobalFilter.extend({
  layout,
});
