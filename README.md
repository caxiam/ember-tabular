ember-tabular
==============================================================================

[![CircleCI](https://circleci.com/gh/caxiam/ember-tabular.svg?style=shield&circle-token=4983e3daf7018ac0a3ce79929e2fb4c965560e38)](https://circleci.com/gh/caxiam/ember-tabular)
[![Code Climate](https://codeclimate.com/github/caxiam/ember-tabular/badges/gpa.svg)](https://codeclimate.com/github/caxiam/ember-tabular)

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
{{! app/templates/basic-usage.hbs}}

{{ember-tabular modelName="user"}}


{{! app/templates/custom-usage.hbs }}

{{#ember-tabular modelName="user" sort=sort as |et|}}
    {{#et.column property="emailAddress" isCustom=true as |record column|}}
        <a href="mailto:{{get record column.property}}">{{get record column.property}}</a>
    {{/et.column}}
    {{et.column property="password" isActive=false isCustom=false filter=false sort=false}}
    {{et.column property="createdAt" isActive=false isCustom=false filter=false sort=false}}
    {{#et.column property="updatedAt" label="Last Updated" isCustom=true type="date" as |record column|}}
        {{#if record.updatedAt}}
            {{moment-format record.updatedAt 'MM/DD/YYYY'}}
        {{else}}
            {{moment-format record.createdAt 'MM/DD/YYYY'}}
        {{/if}}
    {{/et.column}}
    {{#et.column
        property="actions"
        isCustom=true
        filter=false
        sort=false
    }}
        {{#link-to "index" class="btn btn-default btn-xs" role="button"}}
            Edit
        {{/link-to}}
    {{/et.column}}
{{/ember-tabular}}


{{! app/templates/advanced-usage.hbs }}

{{#ember-tabular columns=columns modelName="user" record=users sort=sort as |et|}}
    {{#et.column property="username" as |record column|}}
        {{record.username}}
    {{/et.column}}
    {{#et.column property="emailAddress" as |record column|}}
        {{record.emailAddress}}
    {{/et.column}}
    {{#et.column property="firstName" as |record column|}}
        {{record.firstName}}
    {{/et.column}}
    {{#et.column property="updatedAt" as |record column|}}
        {{#if record.updatedAt}}
            {{moment-format record.updatedAt 'MM/DD/YYYY'}}
        {{else}}
            {{moment-format record.createdAt 'MM/DD/YYYY'}}
        {{/if}}
    {{/et.column}}
    {{#et.column property="actions" as |record column|}}
        {{#link-to "index" class="btn btn-default btn-xs" role="button"}}
            Edit
        {{/link-to}}
    {{/et.column}}
{{/ember-tabular}}
```

### Controller
Optionally setup the columns array, which is how to override the table headers, `property` is required in all cases.
```js
// app/controllers/my-route.js

export default Ember.Controller.extend({
    users: null,
    columns: [
        {
            property: 'username',
            defaultSort: 'username',
        },
        {
            property: 'emailAddress',
            label: 'Email',
        },
        {
            property: 'firstName',
        },
        {
            property: 'updatedAt',
            label: 'Last Updated',
            type: 'date',
        },
        {
            property: 'actions',
        },
    ],
});
```

* Reference the [API specs/documentation](/docs/index.html) for more information and for advanced usage.

### Request Format
Ember Tabular sticks very closely to jsonapi spec, a few examples of requests:

* `/users?filter[last-name]=McClane&page[limit]=10&page[offset]=0`
  * `filter[last-name]` - Filter based on jsonapi's recommended filtering: http://jsonapi.org/recommendations/#filtering
  * `page[limit]` - Using a "offset-based" pagination strategy, send # of items per page.
  * `page[offset]` - Using a "offset-based" pagination strategy, starting item number.
* `/orders?filter[date-ordered-min]=2016-12-10&filter[dateordered-max]=2016-12-12&filter[order-number]=1029LG31&filter[order-profile]=1&page[limit]=&page[offset]=&sort=-date-ordered`
  * `sort` - Sort based on jsonapi's recommended sorting: http://jsonapi.org/format/#fetching-sorting
    * Ascending unless prefixed with `-` for descending. 

### Template - Yields
```hbs
{{#ember-tabular record=users as |et|}}
    {{#if et.isHeader}}
        ... place content in header yield ...
    {{/if}}

    ... place content within <tbody></tbody> ...

    {{#if et.isFooter}}
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
Typically the global filter component would be rendered into the `{{yield header}}` of the main table component using the yield conditional `{{#if et.isHeader}} ...`. However, it can be used outside of the context of the main component if the proper properties are shared between the main component and sub-component.

* Sent in request as: `?filter[filterProperty]=searchFilter`, e.g. `?filter[first-name]=John.Doe2`
```hbs
{{ember-tabular-global-filter 
    filter=filter 
    filterProperty="firstName" 
    filterPlaceholder="Search by First Name"}}
```

#### Date Filter
Date filter changes `input type="date"` to take advantage of a browser's HTML5 date widget. Typically the date filter component would be rendered into the `{{yield header}}` of the main table component using the yield conditional `{{#if et.isHeader}} ...`. However, it can be used outside of the context of the main component if the proper properties are shared between the main component and sub-component.

* Sent in request as: `?filter[filterProperty]=dateFilter`, e.g. `?filter[updated-at]=2015-06-29`
```hbs
{{ember-tabular-date-filter 
    filter=filter 
    filterProperty="updatedAt" 
    label="Last Updated"}}
```

#### Dropdown Filter
Use the dropdown filter globally. One way to do this is by setting up a computed property that returns an array of label/value objects.

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
      },
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

If you are not using Ember Data or following json:api then you can extend this component and override a set of serialize and normalized methods, checkout the [API specs/documentation](/docs/index.html) for more details/examples.
