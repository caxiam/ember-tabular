# Ember-table-jsonapi

Sortable/filterable jsonapi compliant tables for ember-cli.
* Sort on a column by column basis.
* Filter on a column by column basis.
* Make physical requests to the API when filtering/sorting

# How to use this addon
## Installation

```
$ ember install ember-table-jsonapi
```

## Usage
### Template
Setup the ember-table-jsonapi template. 
* `columns` - array (detailed below).
* `modelType` - for the component to make the proper request when filtering/sorting, you must pass the model type matching your Ember model structure. e.g. `brand/diagram`, `product`.
* `bindModel` - this is bound to the controller and is used to iterate over the table's model data.

You have full control over your table's `tbody` content. We are setting this to render this content into the `{{yield body}}` of the table component.
```hbs
{{! app/templates/my-route.hbs }}

{{#ember-table-jsonapi columns=columns modelType="user" bindModel=users hasActions="true" as |section|}}
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
{{/ember-table-jsonapi}}
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
            type: 'text',
            defaultSort: 'username',
        },
        {
            property: 'email-address',
            label: 'Email',
            type: 'text',
        },
        {
            property: 'first-name',
            label: 'First Name',
            type: 'text',
        },
        {
            property: 'last-name',
            label: 'Last Name',
            type: 'text',
        },
        {
            property: 'updated-at',
            label: 'Last Updated',
            type: 'date',
        },
    ],
});
```

## Advanced Usage
### Template
```hbs
{{#ember-table-jsonapi 
    columns=columns 
    modelType="user" 
    bindModel=users 
    hasActions="true"
    class="table-default" 
    tableClass="table-bordered table-hover table-striped" 
    staticParams=staticParams 
    searchable="true" 
    filterProperty="name" 
    filterPlaceholder="Search by Location Name" 
    as |section|}}
    ...
{{/ember-table-jsonapi}}
```
* `hasActions` - boolean/string - default: false
  * ET JSONAPI will reserve an additional column for "actions", ex. Edit/View/Delete buttons.
* `class` - string
  * Wraps the entire component.
* `tableClass` - string - default: "table-bordered table-hover"
  * Wraps only the `<table>` and replaces defaults if provided.
* `staticParams` - object - default: null
  * Object to pass in static query-params that will not change based on any filter/sort criteria, ex. additional table-wide filters that need to be applied in all requests `?filter[is-open]=1`.

      ```js
      // app/controllers/location.js

      export default Ember.Controller.extend({
          staticParams: Ember.computed('model', function() {
              return {
                  'filter[is-open]': '1'
              };
          }),
          ...
      });
      ```
* `searchable` - boolean/string - default: false
  * Activate the global-filter sub-component. Used in conjunction with `filterProperty` and `filterPlaceholder`.
* `filterProperty` - string - Default: null
  * Used with the "Global Filter Sub-Component".
  * Pass the property name.
  * This will be passed onto `{{ember-table-jsonapi-global-filter ...}}`
* `filterPlaceholder` - string - Default: null
  * Placeholder to be used for the global-filter
* `tableLoadedMessage` - string - Default: "No Data."
  * In some cases when the API response is loaded but does not contain any data "No Data." will not apply, on a case by case basis you can override this.

### Controller
```js
export default Ember.Controller.extend({
    users: null,
    columns: [
        {
            property: 'username',
            label: 'Username',
            type: 'text',
            defaultSort: 'username',
        },
        {
            property: 'email-address',
            label: 'Email',
            type: 'text',
        },
        {
            property: 'first-name',
            label: 'First Name',
            type: 'text',
        },
        {
            property: 'last-name',
            label: 'Last Name',
            type: 'text',
        },
        {
            property: 'updated-at',
            label: 'Last Updated',
            type: 'date',
        },
    ],
});
```
* `columns.property` - string
  * Required for column filtering
* `columns.label` - string
  * Required in all use-cases
* `columns.type` - string
  * Required for column filtering
  * Sets the filter `<input type="">`
* `columns.defaultSort` - string
  * Initial sort value for API request
  * Will be overridden with any sorting changes

### Template - Yields
```hbs
{{#ember-table-jsonapi columns=columns bindModel=users as |section|}}
    {{#if section.isHeader}}
        ... place content in header yield ...
    {{else if section.isBody}}
        ... place content within <tbody></tbody> ...
    {{else if section.isFooter}}
        ... place content in footer yield ...
    {{/if}}
{{/ember-table-jsonapi}}
```
Component has 3 yields setup by default, `header`, `body`, and `footer`.
* `{{yield header}}` is rendered outside (above) the `<div class="table-responsive">` on the root of the template.
* `{{yield body}}` is rendered within the `<tbody></tbody>`. Conditional based on `bindModel`.
* `{{yield footer}}` is rendered outside (below) the `<div class="table-responsive">` on the root of the template above the pagination.

## Note
* This component expects jsonapi error format: http://jsonapi.org/format/#error-objects
  * Specifically `error.detail` to display in the alert/error box
* Pagination is constructed using, `?offset=A&limit=B&page=C&sort=`
* All other filters are sent through the jsonapi format spec: http://jsonapi.org/recommendations/#filtering


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
