# Ember-tabular

Sortable/filterable jsonapi compliant tables for ember-cli.
* Sort on a column by column basis.
* Filter on a column by column basis.
* Make physical requests to the API when filtering/sorting/paginating

# How to use this addon
## Installation

```
$ ember install ember-tabular
```

## Usage
### Template
Setup the ember-tabular template. 
* `columns` - array (detailed below).
* `modelName` - for the component to make the proper request when filtering/sorting, you must pass the model type matching your Ember model structure. e.g. `brand/diagram`, `product`.
* `record` - this is bound to the controller and is used to iterate over the table's model data.

You have full control over your table's `tbody` content. We are setting this to render the content into the `{{yield body}}` of the table component.
```hbs
{{! app/templates/my-route.hbs }}

{{#ember-tabular columns=columns modelName="user" record=users as |section|}}
    {{#if section.isBody}}
        {{#each users as |row|}}
            <tr>
                <td>{{row.username}}</td>
                <td>{{row.emailAddress}}</td>
                <td>{{row.firstName}}</td>
                <td>{{row.lastName}}</td>
                <td>
                    {{#link-to "index" class="btn btn-xs" role="button"}}
                        Edit
                    {{/link-to}}
                </td>
            </tr>
        {{/each}}
    {{/if}}
{{/ember-tabular}}
```

### Controller
Setup the columns array, which is how the table headers are constructed, `label` is required in all cases.
```js
// app/controllers/my-route.js

export default Ember.Controller.extend({
    users: null,
    columns: [
        {
            property: 'username',
            label: 'Username',
            defaultSort: 'username',
        },
        {
            property: 'emailAddress',
            label: 'Email',
        },
        {
            property: 'firstName',
            label: 'First Name',
        },
        {
            property: 'lastName',
            label: 'Last Name',
        },
        {
            property: 'updatedAt',
            label: 'Last Updated',
            type: 'date',
        },
    ],
});
```

### Request Format
Ember Table JSONAPI sticks very closely to jsonapi spec, a few examples of requests:

* `/users?filter[last-name]=McClane&page[limit]=10&page[offset]=0`
  * `filter[last-name]` - Filter based on jsonapi's recommended filtering: http://jsonapi.org/recommendations/#filtering
  * `page[limit]` - Using a "offset-based" pagination strategy, send # of items per page.
  * `page[offset]` - Using a "offset-based" pagination strategy, starting item number.
* `/orders?filter[date-ordered-min]=2016-12-10&filter[dateordered-max]=2016-12-12&filter[order-number]=1029LG31&filter[order-profile]=1&page[limit]=&page[offset]=&sort=-date-ordered`
  * `sort` - Sort based on jsonapi's recommended sorting: http://jsonapi.org/format/#fetching-sorting
    * Ascending unless prefixed with `-` for descending. 

## Advanced Usage
### Template
```hbs
{{#ember-tabular 
    columns=columns 
    modelName="user" 
    record=users 
    class="table-default" 
    tableClass="table-bordered table-hover table-striped" 
    staticParams=staticParams 
    as |section|}}
    ...
{{/ember-tabular}}
```
* `makeRequest` - boolean/string - Default: true
  * If `true`: Ember Table JSONAPI will make request based on `modelName`.
  * If `false`: Typically you'd bind the route's model to `record`.
* `class` - string
  * Wraps the entire component.
* `tableClass` - string - Default: "table-bordered table-hover"
  * Wraps only the `<table>` and replaces defaults if provided.
* `staticParams` - object - Default: null
  * Object to pass in static query-params that will not change based on any filter/sort criteria, ex. additional table-wide filters that need to be applied in all requests `?filter[is-open]=1`.

      ```js
      // app/controllers/location.js

      export default Ember.Controller.extend({
          staticParams: Ember.computed('model', function() {
              return {
                  'filter[is-open]': '1',
                  'include': 'hours',
              };
          }),
          ...
      });
      ```
* `tableLoadedMessage` - string - Default: "No Data."
  * In some cases when the API response is loaded but does not contain any data "No Data." will not apply, on a case by case basis you can override this. For example, if you'd like to prompt the user to do some kind of action. "No data, select a different product".

### Controller
```js
export default Ember.Controller.extend({
    users: null,
    columns: [
        {
            property: 'username',
            label: 'Username',
            defaultSort: 'username',
            type: 'text',
        },
        {
            property: 'emailAddress',
            label: 'Email',
            type: 'text',
        },
        {
            property: 'firstName',
            label: 'First Name',
            type: 'text',
        },
        {
            property: 'lastName',
            label: 'Last Name',
            type: 'text',
        },
        {
            property: 'updatedAt',
            label: 'Last Updated',
            type: 'date',
        },
    ],
});
```
* `columns.property` - string
  * Required for column filtering/sorting
  * Properties should be in camelCase format
* `columns.label` - string
  * Required in all use-cases
* `columns.type` - string - Default: text
  * Sets the filter `<input type="">`
* `columns.sort` - boolean - Default: true
  * Required for column sorting
* `columns.defaultSort` - string
  * Initial sort value for API request
  * Will be overridden with any sorting changes

### Template - Yields
```hbs
{{#ember-tabular columns=columns record=users as |section|}}
    {{#if section.isHeader}}
        ... place content in header yield ...
    {{else if section.isBody}}
        ... place content within <tbody></tbody> ...
    {{else if section.isFooter}}
        ... place content in footer yield ...
    {{/if}}
{{/ember-tabular}}
```
Component has 3 yields setup by default, `header`, `body`, and `footer`:

* `{{yield header}}` is rendered outside (above) the `<div class="table-responsive">` on the root of the template.
* `{{yield body}}` is rendered within the `<tbody></tbody>`. Conditional based on `record`.
* `{{yield footer}}` is rendered outside (below) the `<div class="table-responsive">` on the root of the template above the pagination.

### Sub-Components - Templates
#### Global Filter
Typically the global filter component would be rendered into the `{{yield header}}` of the main table component using the yield conditional `{{#if section.isHeader}} ...`. However, it can be used outside of the context of the main component if the proper properties are shared between the main component and sub-component.

* Sent in request as: `?filter[filterProperty]=searchFilter`, e.g. `?filter[username]=John.Doe2`
```hbs
{{ember-tabular-global-filter 
    filter=filter 
    filterProperty="username" 
    filterPlaceholder="Search by Username"}}
```
* `filter` - object - Default: null
  * Required
  * Must also expose the `filter` property on the parent `ember-tabular` component to be able to pass the `filter` object back and forth between parent and child components.
* `query` - object - Default: `this.get('query') || this.get('parentView.query')`
  * Pass the query object from the parent component if it is different or if used outside of the context of the component, otherwise query is optional and it component will attempt to grab within the context of the parent component.
* `filterProperty` - string - Default: null
  * Required
  * Used with the "Global Filter Sub-Component".
  * Pass the property name in camelCase format.
* `filterPlaceholder` - string - Default: null
  * Optional
  * Placeholder to be used for the global-filter.
* `label` - string - Default: null
  * Optional
  * Set a label on the global-filter.
* `inputClass` - string - Default: null
  * Optional
  * Wraps the input field in a div.
* `labelClass` - string - Default: null
  * Optional

#### Date Filter
Date filter changes `input type="date"` to take advantage of a browser's HTML5 date widget. Typically the date filter component would be rendered into the `{{yield header}}` of the main table component using the yield conditional `{{#if section.isHeader}} ...`. However, it can be used outside of the context of the main component if the proper properties are shared between the main component and sub-component.

* Sent in request as: `?filter[filterProperty]=dateFilter`, e.g. `?filter[updated-at]=2015-06-29`
```hbs
{{ember-tabular-date-filter 
    filter=filter 
    filterProperty="updatedAt" 
    label="Last Updated"}}
```
* `filter` - object - Default: null
  * Required
  * Must also expose the `filter` property on the parent `ember-tabular` component to be able to pass the `filter` object back and forth between parent and child components.
* `query` - object - Default: `this.get('query') || this.get('parentView.query')`
  * Pass the query object from the parent component if it is different or if used outside of the context of the component, otherwise query is optional and it component will attempt to grab within the context of the parent component.
* `filterProperty` - string - Default: null
  * Required
  * Used with the "Global Filter Sub-Component".
  * Pass the property name in camelCase format.
* `dateFilter` - string - Default: null
  * Optional
  * Sets the input value.
* `label` - string - Default: null
  * Optional
  * Set a label on the global-filter.
* `inputClass` - string - Default: null
  * Optional
  * Wraps the input field in a div.
* `labelClass` - string - Default: null
  * Optional

## Note
* This component adheres to jsonapi spec: http://jsonapi.org/
* This component expects jsonapi error format: http://jsonapi.org/format/#error-objects
  * Specifically `error.detail` to display in the alert/error box
* Pagination is constructed using, `?page[offset]=A&page[limit]=B&sort=`
* All other filters are sent through the jsonapi format spec: http://jsonapi.org/recommendations/#filtering
* This add-on imports font-awesome via bower, if your project is already including this dependency you may run into build issues, typically you can add `{overwrite: true}` within `mergeTree` in your ember-cli-build.js will resolve this conflict.

### Support for Other/Custom API Specs?
If you are using Ember Data, then you can lean on your application's custom adapter.

* Pagination
  * Responses, depending upon API pagination strategy will need to be converted in the adapter/serializer to pass ember-tabular `offset` / `limit` / `page` properties to generate pagination internally.
* Filtering
  * This addon expects a `filter` object with nested property/value pairs.

If you are not using Ember Data then you can extend this addon's component and override a set of serialize and normalized methods:
```js
import EmberTabular from 'ember-tabular/components/ember-tabular';

export default EmberTabular.extend({
    serializePagination(params) {
        // override default pagination ?page[offset]= and ?[page]limit=
        // offset and limit will be sent as ?offset= and ?limit=
        params.offset = (params.page * params.limit) - params.limit;
        if (isNaN(params.offset)) {
            params.offset = null;
        }

        return params;
    },
});
```
```js
import EmberTabular from 'ember-tabular/components/ember-tabular';

export default EmberTabular.extend({
    serializeProperty(property) {
        // Override to convert all properties sent in requests to camelize instead of the default dasherized
        // ?filter[lastName]&sort=isAdmin
        // (pseudo code)
        if (property) {
            return Ember.String.camelize(property);
        }

        return null;
    },
});
```
Check add-on source for full list of serialized/normalized methods available for extension.
Note:

* On success you must set the `record` with the array of table data


# Contributing to this addon
## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
