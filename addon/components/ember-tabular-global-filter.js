import Ember from 'ember';

/**
* ## Global Filter
* Typically the global filter component would be rendered into the `{{yield header}}` of the main table component using the yield conditional `{{#if section.isHeader}} ...`.
*
* However, it can be used outside of the context of the main component if the proper properties are shared between the main component and sub-component.

* - Sent in request as: `?filter[filterProperty]=searchFilter`, e.g. `?filter[username]=John.Doe2`
```hbs
{{ember-tabular-global-filter
    filter=filter
    filterProperty="username"
    filterPlaceholder="Search by Username"}}
```
*
* @class EmberTabularGlobalFilter
*/
export default Ember.Component.extend({
  /**
  * @property tagName
  * @type String
  * @default 'div'
  */
  tagName: 'div',
  classNames: ['table-filter'],
  action: null,
  /**
  * Property to be filtered upon.
  *
  * @property filterProperty
  * @type String
  * @default null
  */
  filterProperty: null,
  /**
  * Value of filter.
  *
  * @property searchFilter
  * @type String
  * @default ''
  */
  searchFilter: '',

  /**
  * Pass the `query` object from the parent component if it is different or if used outside of the context of the component, otherwise `query` is optional and the component will attempt to grab within the context of the parent component.
  *
  * @property query
  * @type Object
  * @default null
  */
  query: null,
  filter: null,

  actions: {
    clearFilter() {
      this.set('searchFilter', '');
    },
  },
  /**
  * Debounce the `filterName` method.
  *
  * @method filterTable
  */
  filterTable: Ember.observer('searchFilter', function () {
    Ember.run.debounce(this, 'filterName', 750);
  }),
  /**
  * @property isClearable
  * @default false
  */
  isClearable: Ember.computed('searchFilter', function () {
    if (this.get('searchFilter')) {
      return true;
    }
    return false;
  }),
  /**
  * Constructs and sets the `filter` Object.
  *
  * @method filterName
  */
  filterName() {
    // Reference parent component query obj
    const query = this.get('query') || this.get('parentView.query');
    const property = this.get('filterProperty');
    const value = this.get('searchFilter');
    let filter;

    // Set the query on the filter object
    if (query && query && query.hasOwnProperty('filter') && query.filter !== null) {
      filter = query.filter;
    } else {
      filter = {};
    }
    filter[property] = value;

    // Remove filter if value is an empty string
    // to prevent empty request from being sent
    if (value === '' || value === null) {
      delete filter[property];
    }

    // Take filter object and break into different format
    // filters = [{field: 'name', value:'foo'}, {field: 'email', value: 'foo@bar.com'}];
    const filters = Object.keys(filter).map(function (key) {
      return {
        field: key,
        value: filter[key],
      };
    });

    // Trigger 'setModel'
    if (!this.isDestroyed || !this.isDestroying) {
      this.set('filter', filters);
    }
  },
});
