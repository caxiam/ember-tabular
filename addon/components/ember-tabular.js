import { isEmpty } from '@ember/utils';
import { merge } from '@ember/polyfills';
import { dasherize, camelize } from '@ember/string';
import { assert } from '@ember/debug';
import { A } from '@ember/array';
import { computed, observer, get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import Evented, { on } from '@ember/object/evented';
import Component from '@ember/component';
import layout from 'ember-tabular/templates/components/ember-tabular';
import EmberTabularHelpers from 'ember-tabular/mixins/components/ember-tabular-helpers';
import { next, once } from '@ember/runloop';
import jQuery from 'jquery';

/**
* ## Basic Usage
* - `columns` - Controller array to setup the table headers/columns (optional, if you specify it will override the autogenerated version).
  - `modelName` - for the component to make the proper request when filtering/sorting, you must pass the model type matching your Ember model structure. e.g. brand/diagram, product, list-item, etc.
  - `record` - this is bound to the controller and is used to iterate over the table's model data.
* ### Template
  ```hbs
  {{! app/templates/my-route.hbs }}

  {{ember-tabular modelName="user"}}
  ```
*
* @class EmberTabular
*/
export default Component.extend(Evented, EmberTabularHelpers, {
  layout,
  store: service('store'),
  action: null,
  classNames: ['ember-tabular'],
  /**
  * Component will attempt to make a request to fetch the data.
  *
  * @property makeRequest
  * @type Boolean
  * @default true
  */
  makeRequest: true,
  /**
  * Used to toggle the filter row bar.
  *
  * @property showFilterRow
  * @type Boolean
  * @default false
  */
  showFilterRow: false,
  /**
  * Requires sharing the `filter`/`sort` property with the controller/service/etc to persist filter data
  *
  * @property persistFiltering
  * @type Boolean
  * @default false
  */
  persistFiltering: false,
  /**
  * Persists `columnOrder` via toPersist/getPersist
  * Requires `persistFiltering` and `tableName`
  *
  * @property isPersisting
  * @type Boolean
  * @default false
  */
  isPersisting: false,
  /**
  * method used to persist current state of ET
  * this can be overwritten/extended
  *
  * @method toPersist
  */
  toPersist() {
    const ls = window.localStorage;
    const tableName = this.prefixedTableName;
    const columnOrder = this.columnOrder;

    let data = {
      columnOrder: columnOrder,
    };

    ls.setItem(tableName, JSON.stringify(data));
  },
  /**
  * method used to grab persisted data from localStorage
  * this can be overwritten/extended
  *
  * @method getPersist
  */
  getPersist() {
    const tableName = this.prefixedTableName;
    const ls = window.localStorage;
    if (ls.getItem(tableName)) {
      const parsedData = JSON.parse(ls.getItem(tableName));
      this.setProperties(parsedData);
    }
  },
  /**
  * Unique table name
  * Required for `isPersisting`
  *
  * @property tableName
  * @type String
  * @default undefined
  */
  tableName: undefined,
  prefixedTableName: computed('tableName', function () {
    return `tabular:${this.tableName}`;
  }),
  /**
  * Will check all table rows
  *
  * @property allChecked
  * @type Boolean
  * @default false
  */
  allChecked: false,
  /**
  * @property sortableClass
  * @type String
  * @default 'sortable'
  */
  sortableClass: 'sortable',
  /**
  * @property tableWrapperClass
  * @type String
  * @default ''
  */
  tableWrapperClass: '',
  /**
  * @property tableClass
  * @type String
  * @default 'table-bordered table-hover'
  */
  tableClass: 'table-bordered table-hover',
  /**
  * @property paginationWrapperClass
  * @type String
  * @default ''
  */
  paginationWrapperClass: '',
  /**
  * Once the `isRecordLoaded` is determined if true and no data exists then this is displayed.
  *
  * @property tableLoadedMessage
  * @type String
  * @default 'No Data.'
  */
  tableLoadedMessage: 'No Data.',
  /**
  * Computed Property to determine the column length dependent upon `columns`.
  *
  * @property columnLength
  * @param columns {Array}
  * @return {Number}
  */
  columnLength: computed('columns', function () {
    return this.columns.length;
  }),

  // Allows multiple yields
  header: {
    isHeader: true,
  },
  wrapperHeader: {
    isWrapperHeader: true,
  },
  body: {
    isBody: true,
  },
  footer: {
    isFooter: true,
  },
  wrapperFooter: {
    isWrapperFooter: true,
  },

  /**
  * Model to be requested using `makeRequest: true`.
  *
  * @property modelName
  * @type String
  * @default null
  */
  modelName: null,
  /**
  * This is typically bound to the controller and is used to iterate over the table's model data.
  *
  * @property record
  * @type Object
  * @default null
  */
  record: null,

  init() {
    this._super(...arguments);
    // ensures a unique `registry` is generated per ember tabular instance
    this.set('registry', A());
    if (this.isPersisting) {
      const tableName = this.tableName;
      if (!tableName) {
        assert('tableName attribute is required, and should be unique', tableName);
      }
      this.getPersist();
    }
    if (!this.sort) {
      this.defaultSort();
    }
  },

  /**
  * Use this property only if you want to completely override what ember-tabular would generate based on the ember data model.
  * If you plan on using column drag re-ordering then wrapping the columns in `columns: Ember.A([...])` will be required if your application does not EmberENV.EXTEND_PROTOTYPES by default.
  * `property` is required.
  *
  ```js
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
        sort: false,
      },
      {
        property: 'isAdmin',
        list: [
          {
            label: 'Yes',
            value: true,
          },
          {
            label: 'No',
            value: false,
          }
        ],
      },
      {
        property: 'updatedAt',
        label: 'Last Updated',
        type: 'date',
      },
      {
        label: 'Actions',
        property: 'actions',
      },
    ],
  });
  ```
  *
  - `columns.property` - {String}
    - Required in all use-cases.
    - Properties should be in camelCase format.
  - `columns.label` - {String}
    - Optional, if not provided will generate label based on camelCase property.
  - `columns.isActive` - {Boolean}
    - Optional, used along with the `ember-tabular-column-select` to determine which columns are active/shown by default.
  - `columns.type` - {String} - Default: text
    - Sets the filter `<input type="">`.
  - `columns.sort` - {Boolean} - Default: `true`
    - Required for column sorting.
  - `columns.list` - {Array} - Default: `null` - Filtering the column based on a dropdown list.
    - `list.label` - Displayed to the user for selection.
    - `list.value` - Value that is sent in the request.
  - `columns.defaultSort` - {String}
    - Initial sort value for API request.
    - Will be overridden with any sorting changes.

  * Overriding `columns` property is allowed.
  *
  * Uses a combination of properties as well as the model's class attributes to generate a columns array.
  *
  * @property columns
  * @type Array
  * @default null
  */
  columns: computed('registry', 'registryDiff', 'registryDone', function () {
    let columns = A();
    // only output columns array when registry is done
    if (this.registryDone) {
      const registry = this.registry;
      const registryDiff = this.registryDiff;
      const columnOrder = this.columnOrder;

      if (registry && registryDiff) {
        columns.pushObjects(registry);
        columns.pushObjects(registryDiff);
      }

      // sort the colums array by columnOrder
      if (columnOrder) {
        // break out the excludes so we can add them to the end
        let excludes = [];
        let includes = columns.filter((el) => {
          if (columnOrder.indexOf(el.property) > -1) {
            return el;
          }
          excludes.push(el);
        });
        includes.sort((a, b) => {
          return columnOrder.indexOf(a.property) < columnOrder.indexOf(b.property) ? -1 : 1;
        });
        columns = includes.concat(excludes);
      }
    }
    return columns;
  }),

  saveColumnOrder: observer('columns', 'columns.@each.isActive', function () {
    const columns = this.columns;
    // filter out columns that are not active
    let filterColumns = columns.filter((el) => {
      if (el.isActive) {
        return el;
      }
    });
    // only return array of properties
    let newColumnOrder = filterColumns.map((el) => el.property);
    this.set('columnOrder', newColumnOrder);
  }),

  /**
  * If you want to set a specific order but you do not want to completely replace the `columns`, you can pass a simple array of properties to determine the order of the columns.
  * Note: You must include all attributes you want displayed, if any attributes are omitted then their column will be set to isActive=false, hiding them from display. If this property is shared with a long lived object (controller/service/etc), it will persist.
  *
  ```js
  [
    'username',
    'emailAddress',
    'password',
    'firstName',
    'lastName',
    'isAdmin',
    'createdAt',
    'updatedAt',
    'actions',
  ]
  ```
  *
  * @property columnOrder
  * @type Array
  * @default null
  */
  columnOrder: null,

  registryDone: false,

  // Ember.A() to be defined in init()
  registry: null,

  /**
  * Takes `registry` and generates using ModelClassAttributes for any missing attributes a column object.
  *
  * @property registryDiff
  * @type Array
  * @default []
  */
  registryDiff: computed('registry.[]', function () {
    const modelName = this.modelName;
    const registry = this.registry;
    let registryDiff = A();
    if (modelName) {
      const modelClass = this.store.modelFor(modelName);
      const modelClassAttributes = get(modelClass, 'attributes');
      // iterate over keys and create attribute array
      modelClassAttributes.forEach((meta, property) => {
        let attribute = {
          property: property,
          label: this._formatColumnLabel(property),
          isActive: this.checkConfigForColumn(property),
          isCustom: false,
          filter: true,
          sort: true,
          type: 'text',
        };
        // look for duplicate
        let item = registry.find((el) => {
          return el.property === property;
        });
        if (!item) {
          registryDiff.addObject(attribute);
        }
      });
    }
    return registryDiff;
  }),

  checkConfigForColumn(property) {
    const columnOrder = this.columnOrder;
    if (columnOrder && columnOrder.indexOf(property) === -1) {
      return false;
    }
    return true;
  },

  /**
  * Whether to display the panel to select different table columns.
  *
  * @property isColumnSelect
  * @type Boolean
  * @default true
  */
  isColumnSelect: true,

  /**
  * Whether to display the panel to change table row limit.
  *
  * @property isDropdownLimit
  * @type Boolean
  * @default true
  */
  isDropdownLimit: true,

  // pagination defaults
  /**
  * @property page
  * @type Number
  * @default 1
  */
  page: 1,
  /**
  * Used in request to construct pagination.
  *
  * @property limit
  * @type Number
  * @default 10
  */
  limit: 10,
  /**
  * Number passed to the pagination add-on.
  *
  * @property pageLimit
  * @type Number
  * @default 0
  */
  pageLimit: 0,
  /**
  * Used in request to construct pagination.
  *
  * @property offset
  * @type Number
  * @default 0
  */
  offset: 0,
  /**
  * @property sort
  * @type String
  * @default null
  */
  sort: null,
  /**
  * @property filter
  * @type Object
  * @default null
  */
  filter: null,
  /**
  * Object to pass in static query-params that will not change based on any filter/sort criteria.
  * Additional table-wide filters that need to be applied in all requests. Typically bound to the controller.
  ```js
  // app/controllers/location.js

  export default Ember.Controller.extend({
    staticParams: Ember.computed('model', function() {
      return {
        'filter[is-open]': '1',
        include: 'hours',
      };
    }),
    ...
  });
  ```

  ```hbs
  {{! app/templates/my-route.hbs }}

  {{#ember-tabular columns=columns modelName="user" record=users staticParams=staticParams as |section|}}
    ...
  {{/ember-tabular}}
  ```
  *
  * @property staticParams
  * @type Object
  * @default null
  */
  staticParams: null,

  // State flags
  /**
  * @property isSuccess
  * @type Boolean
  * @default false
  */
  isSuccess: false,
  /**
  * @property isFailure
  * @type Boolean
  * @default false
  */
  isFailure: false,
  /**
  * @property isLoading
  * @type Boolean
  * @default false
  */
  isLoading: false,

  /**
  * @property defaultSuccessMessage
  * @type String
  * @default 'Success!'
  */
  defaultSuccessMessage: 'Success!',
  /**
  * @property defaultFailureMessage
  * @type String
  * @default 'There was an issue. Please check below for errors.'
  */
  defaultFailureMessage: 'There was an issue. Please check below for errors.',

  // Messages
  successMessage: get(Component, 'defaultSuccessMessage'),
  failureMessage: get(Component, 'defaultFailureMessage'),

  /**
  * Conforms to json:api spec: http://jsonapi.org/format/#errors
  *
  * @property errors
  * @type Array
  * @default null
  */
  errors: null,

  /**
  * Used to serialize the parameters within `request`.
  *
  * @method serialize
  * @param params {Object} An object of query parameters.
  * @return params {Object} The serialized query parameters.
  */
  serialize(params) {
    // Serialize Pagination
    params = this.serializePagination(params);
    // Serialize Filter
    params = this.serializeFilter(params);
    // Serialize Sort
    params = this.serializeSort(params);

    return params;
  },

  /**
  * Transform params related to pagination into API expected format.
  * Follows json:api spec by default: http://jsonapi.org/format/#fetching-pagination.
  *
  * `offset` => `?page[offset]`.
  *
  * `limit` => `?page[limit]`.
  *
  * If you are not using Ember Data then you can extend this addon's component and override a set of serialize and normalized methods:
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
  *
  * @method serializePagination
  * @param params {Object} An object of query parameters.
  * @return params {Object} The serialized pagination query parameters.
  */
  serializePagination(params) {
    // Override to set dynamic offset based on page and limit
    params.offset = (params.page * params.limit) - params.limit;
    if (isNaN(params.offset)) {
      params.offset = null;
    }

    // Support json api page[offset]/page[limit] spec
    params.page = {};
    params.page.limit = params.limit;
    delete params.limit;
    params.page.offset = params.offset;
    delete params.offset;

    return params;
  },

  /**
  * Transform params related to filtering into API expected format.
  * Follows json:api spec by default: http://jsonapi.org/recommendations/#filtering.
  * `?filter[lastName]` => `?filter[last-name]`.
  *
  * @method serializeFilter
  * @param params {Object} An object of query parameters.
  * @return params {Object} The serialized filter query parameters.
  */
  serializeFilter(params) {
    // serialize filter query params
    const filter = params.filter;

    for (let key in filter) {
      if (filter.hasOwnProperty(key)) {
        const value = filter[key];
        const serializedKey = this.serializeProperty(key);

        // delete unserialized key
        delete filter[key];

        key = serializedKey;
        filter[key] = value;
      }
    }

    return params;
  },

  /**
  * Transform params related to sorting into API expected format.
  * Follows json:api spec by default: http://jsonapi.org/format/#fetching-sorting.
  * `?sort=lastName` => `?sort=last-name`.
  *
  * @method serializeSort
  * @param params {Object} An object of query parameters.
  * @return params {Object} The serialized sort query parameters.
  */
  serializeSort(params) {
    params.sort = this.serializeProperty(params.sort);

    return params;
  },

  /**
  * Follows json:api dasherized naming.
  * `lastName` => `last-name`.
  *
  * If you are not supporting json:api's dasherized properties this can be extended to support other conventions:
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
  *
  * @method serializeProperty
  * @param property {String}
  * @return property {String}
  */
  serializeProperty(property) {
    if (property) {
      return dasherize(property);
    }

    return null;
  },

  /**
  * Used to normalize query parameters returned from `request` to components expected format.
  *
  * @method normalize
  * @param data {Object} Data object returned from request.
  * @param params {Object} The returned object of query parameters.
  * @return data {Object}
  */
  normalize(data, params) {
    // Normalize Pagination
    data = this.normalizePagination(data, params);
    // Normalize Filter
    data.query = this.normalizeFilter(data.query);
    // Normalize Sort
    data.query = this.normalizeSort(data.query);

    return data;
  },

  /**
  * Used to normalize pagination related query parameters returned from `request` to components expected format.
  * `?page[offset]` => `offset`.
  * `?page[limit]` => `limit`.
  *
  * @method normalizePagination
  * @param data {Object} Data object returned from request.
  * @param params {Object} The returned object of query parameters.
  * @return data {Object}
  */
  normalizePagination(data, params) {
    // pagination - return number of pages
    const pageLimit = Math.ceil(data.meta.total / params.page.limit);
    // determine if pageLimit is a valid number value
    if (isFinite(pageLimit)) {
      this.set('pageLimit', pageLimit);
    } else {
      this.set('pageLimit', null);
    }

    return data;
  },

  /**
  * Used to normalize filter related query parameters returned from `request` to components expected format.
  * `?filter[last-name]` => `filter[lastName]`.
  * `?filter[user.first-name]` => `filter[user.firstName]`.
  *
  * @method normalizeFilter
  * @param query {Object} The returned object of query parameters.
  * @return query {Object}
  */
  normalizeFilter(query) {
    // normalize filter[property-key]
    // into filter[propertyKey]
    let filter = query.filter;
    for (let key in filter) {
      if (filter.hasOwnProperty(key)) {
        const value = filter[key];
        const propertySegments = this.segmentProperty(key);
        let normalizedKey;

        // handle/retain dot notation relationships `property.propertyName`
        /* jshint loopfunc: true */
        propertySegments.forEach((el, i, normalizedSegments) => {
          normalizedSegments[i] = this.normalizeProperty(propertySegments[i]);
        });

        // join segments to create normalizedProperty
        normalizedKey = propertySegments.join('.');

        // delete unserialized key
        delete filter[key];

        key = normalizedKey;
        filter[key] = value;
      }
    }

    return query;
  },

  /**
  * Used to normalize sort related query parameters returned from `request` to components expected format.
  * Expects json:api by default.
  *
  * @method normalizeSort
  * @param query {Object} The returned object of query parameters.
  * @return query {Object}
  */
  normalizeSort(query) {
    return query;
  },

  /**
  * Used to normalize properties to components expected format.
  * By default this will camelize the property.
  *
  * @method normalizeProperty
  * @param property {String}
  * @return property {String}
  */
  normalizeProperty(property) {
    if (property) {
      return camelize(property);
    }

    return null;
  },

  /**
  * @method segmentProperty
  * @param property {String}
  * @return segments {Array}
  */
  segmentProperty(property) {
    let segments = property.split('.');

    return segments;
  },

  /**
  * Determine if `record` is loaded using a number of different property checks.
  *
  * @property isRecordLoaded
  * @type Function
  */
  isRecordLoaded: computed('errors', 'record', 'record.isFulfilled', 'record.isLoaded',
  'modelName', 'columns', function () {
    // If record array isLoaded but empty
    if (this.get('record.isLoaded')) {
      return true;
    }
    // If record.content array loaded is empty
    if (this.get('record.isFulfilled')) {
      return true;
    }
    // If errors
    if (this.errors) {
      return true;
    }
    // If record array is empty
    if (this.record && this.record.length === 0) {
      return true;
    }
    // Show custom tableLoadedMessage
    if (this.record === null && this.modelName === null) {
      return true;
    }
    return false;
  }),

  /**
  * Used in templates to determine if table header will allow filtering.
  *
  * @property isColumnFilters
  * @type Boolean
  * @return {Boolean}
  * @default false
  */
  isColumnFilters: computed('columns', function () {
    const columns = this.columns;

    for (let i = columns.length - 1; i >= 0; i--) {
      if (columns[i].hasOwnProperty('property')) {
        return true;
      }
    }

    return false;
  }),

  /**
  * Runs on init to setup the table header default columns.
  * Runs if the `columns` are passed in from controller.
  *
  * @method setColumnDefaults
  */
  setColumnDefaults: on('init', function () {
    this.columns.forEach((column) => {
      // if column does not have a sort property defined set to true
      if (!column.hasOwnProperty('sort')) {
        set(column, 'sort', true);
      }
      // if column does not have a type property defined set to text
      if (!column.hasOwnProperty('type')) {
        set(column, 'type', 'text');
      }
      // if column does not have a filter property defined set to true
      if (!column.hasOwnProperty('filter')) {
        set(column, 'filter', true);
      }
    });
  }),

  /**
  * Runs on init to set the default sort param.
  * Sets the defaultSort when `columns` is passed in from controller
  *
  * @method defaultSort
  */
  defaultSort() {
    const sort = this.sort;
    if (!sort) {
      this.columns.map((el) => {
        if (el.hasOwnProperty('defaultSort')) {
          this.set('sort', el.defaultSort);
        }
      });
    }
  },

  willDestroy() {
    this._super(...arguments);
    // clear any filters if we are not persisting filtering
    const persistFiltering = this.persistFiltering;
    if (!persistFiltering) {
      this.set('filter', null);
    }
  },

  filterChanged: observer('filter.@each.value', function () {
    // reset page to 1 if filter changes
    this.set('page', 1);
  }),

  /**
  * Constructs the query object to be used in `request`.
  *
  * @property query
  * @type Object
  * @return {Object}
  */
  query: computed('page', 'limit', 'offset', 'sort', 'filter.@each.value',
  'staticParams', function () {
    let query = {};
    const filter = this.filter || [];
    query = {
      page: this.page,
      limit: this.limit,
      offset: this.offset,
      sort: this.sort,
      filter: filter.reduce((memo, filter) => merge(memo, {
        [filter.field]: filter.value,
      }), {}),
    };

    // Merge staticParams/query into query
    merge(query, this.staticParams);

    return query;
  }),

  /**
  * Make request to API for data.
  *
  * @method request
  * @param params {Object} Serialized query parameters.
  * @param modelName {String}
  */
  request(params, modelName) {
    params = this.serialize(params);

    return this.store.query(modelName, params).then(
      (data) => {
        if (!this.isDestroyed || !this.isDestroying) {
          data = this.normalize(data, params);
          if (!isEmpty(this.columns)) {
            this.set('isLoading', false);
          }
          this.set('record', data);
        }
      },
      (errors) => {
        if (!this.isDestroyed || !this.isDestroying) {
          this.failure(errors);
        }
      }
    );
  },

  /**
  * Sets the `record` after the `request` is resolved.
  *
  * @method setModel
  */
  setModel: on('init', observer('query', 'makeRequest', function () {
    once(this, function () {
      // If makeRequest is false do not make request and setModel
      if (this.makeRequest) {
        this.reset();
        this.set('isLoading', true);
        const modelName = this.modelName;
        const params = this.query;

        return this.request(params, modelName);
      }
    });
  })),

  actions: {
    sortBy(property) {
      this.setSort(property);
      this.updateSortUI(property);
    },
    toggleFilterRow() {
      this.toggleProperty('showFilterRow');
    },
    registryComplete(value) {
      if (!this.isDestroyed || !this.isDestroying) {
        // tells ember-tabular that the custom registry is complete
        this.set('registryDone', value);
      }
    },
    addToRegistry(column) {
      if (!this.isDestroyed || !this.isDestroying) {
        // adds column to registry coming from ember-tabular-column
        next(() => {
          this.registry.addObject(column);
        });
      }
    },
    triggerOnFilterFocus() {
      // trigger the event onFiltering
      this.trigger('onFiltering');
    },
    /**
    * action used to persist current state of ET
    */
    toPersist() {
      if (this.isPersisting) {
        this.toPersist();
      }
    },
  },

  /**
  * Sets the active sort property.
  *
  * @method setSort
  * @param sortProperty {String}
  */
  setSort: on('didInsertElement', function (sortProperty) {
    if (this.sort || sortProperty) {
      let property;

      if (sortProperty) {
        property = sortProperty;
      } else {
        property = this.sort.replace(/^-/, '');
        // Must be the opposite of property
        sortProperty = `-${property}`;
      }

      property = property;

      if (this.sort === sortProperty) {
        this.set('sort', `-${property}`);
      } else {
        this.set('sort', property);
      }
    }
  }),

  /**
  * Sets the proper classes on table headers when sorting.
  *
  * @method updateSortUI
  * @param sortProperty {String}
  */
  updateSortUI: on('didRender', function (sortProperty) {
    if (this.sort || sortProperty) {
      const _this = this;
      const $table = jQuery(this.element);
      const sort = this.sort;

      // convert property to camelCase
      let property = sort.replace(/^-/, '');
      // convert relationships
      let classProperty = property.replace(/\./g, '-');
      let $tableHeader = $table.find(`#${classProperty}`);

      // Remove all classes on th.sortable but sortable class
      $table.find('th').removeClass(function (i, group) {
        const list = group.split(' ');
        return list.filter(function (val) {
          return (val !== _this.get('sortableClass') && val !== 'filterable');
        }).join(' ');
      });

      if (sort.charAt(0) === '-') {
        $tableHeader.addClass('sort-desc');
      } else {
        $tableHeader.addClass('sort-asc');
      }
    }
  }),

  /**
  * Takes `record` loops and sets each `row.checked`.
  *
  * @method checkAllRecords
  */
  checkAllRecords: observer('allChecked', function () {
    const allChecked = this.allChecked;
    if (allChecked) {
      this.record.forEach((row) => {
        row.set('checked', true);
      });
    } else {
      this.record.forEach((row) => {
        row.set('checked', false);
      });
    }
  }),

  /**
  * @method failure
  * @param response {Object}
  */
  failure(response) {
    this.reset();
    this.setProperties({
      isFailure: true,
      pageLimit: null,
    });

    // Set per field errors if found
    if ('errors' in response) {
      this.set('errors', response.errors);
    } else {
      // attempt to catch/display errors that are outside of the expected format
      // preventing them from being swalled by ember-tabular
      throw new Error(response);
    }
  },

  /**
  * Resets all state specific properties.
  *
  * @method reset
  */
  reset() {
    if (!this.isDestroyed || !this.isDestroying) {
      this.setProperties({
        isLoading: false,
        errors: null,
        isSuccess: false,
        isFailure: false,
        successMessage: this.defaultSuccessMessage,
        failureMessage: this.defaultFailureMessage,
      });
    }
  },
});
