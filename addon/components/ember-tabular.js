import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service('store'),
  action: null,
  classNames: ['ember-tabular'],
  makeRequest: true,
  showFilterRow: false,
  // requires sharing the `filter`/`sort` property with the controller/service/etc to persist
  persistFiltering: false,
  sortableClass: 'sortable',
  tableLoadedMessage: 'No Data.',
  columnLength: Ember.computed('columns', function () {
    return this.get('columns').length;
  }),

  // Allows multiple yields
  header: {
    isHeader: true,
  },
  body: {
    isBody: true,
  },
  footer: {
    isFooter: true,
  },

  // Model to be requested
  modelName: null,
  // Bind variable for table data
  record: null,
  columns: null,

  isDropdownLimit: true,

  // pagination defaults
  page: 1,
  limit: 10,
  pageLimit: 0,
  offset: 0,
  sort: null,
  filter: null,
  // If additional static params are required in requests
  // expects Object {}
  staticParams: null,

  // State flags
  isSuccess: false,
  isFailure: false,
  isLoading: false,

  defaultSuccessMessage: 'Success!',
  defaultFailureMessage: 'There was an issue. Please check below for errors.',

  // Messages
  successMessage: Ember.get(Ember.Component, 'defaultSuccessMessage'),
  failureMessage: Ember.get(Ember.Component, 'defaultFailureMessage'),

  // For pushing any per field errors
  errors: null,

  serialize(params) {
    // Serialize Pagination
    params = this.serializePagination(params);
    // Serialize Filter
    params = this.serializeFilter(params);
    // Serialize Sort
    params = this.serializeSort(params);

    return params;
  },

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

  serializeSort(params) {
    params.sort = this.serializeProperty(params.sort);

    return params;
  },


  serializeProperty(property) {
    if (property) {
      return Ember.String.dasherize(property);
    }

    return null;
  },

  normalize(data, params) {
    // Normalize Pagination
    data = this.normalizePagination(data, params);
    // Normalize Filter
    data.query = this.normalizeFilter(data.query);
    // Normalize Sort
    data.query = this.normalizeSort(data.query);

    return data;
  },

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
        propertySegments.forEach(function(el, i, normalizedSegments) {
          normalizedSegments[i] = this.normalizeProperty(propertySegments[i]);
        }.bind(this));

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

  normalizeSort(query) {
    return query;
  },

  normalizeProperty(property) {
    if (property) {
      return Ember.String.camelize(property);
    }

    return null;
  },

  segmentProperty(property) {
    let segments = property.split('.');

    return segments;
  },

  isRecordLoaded: Ember.computed('errors', 'record', 'record.isFulfilled', 'record.isLoaded',
  'modelName', function () {
    // If record array isLoaded but empty
    if (this.get('record.isLoaded')) {
      return true;
    }
    // If record.content array loaded is empty
    if (this.get('record.isFulfilled')) {
      return true;
    }
    // If errors
    if (this.get('errors')) {
      return true;
    }
    // If record array is empty
    if (this.get('record') && this.get('record').length === 0) {
      return true;
    }
    // Show custom tableLoadedMessage
    if (this.get('record') === null && this.get('modelName') === null) {
      return true;
    }

    return false;
  }),

  isColumnFilters: Ember.computed('columns', function () {
    const columns = this.get('columns');

    for (let i = columns.length - 1; i >= 0; i--) {
      if (columns[i].hasOwnProperty('property')) {
        return true;
      }
    }

    return false;
  }),

  setColumnDefaults: Ember.on('init', function () {
    this.get('columns').map(function (column) {
      // if column does not have a sort property defined set to true
      if (!column.hasOwnProperty('sort')) {
        Ember.set(column, 'sort', true);
      }
      // if column does not have a type property defined set to text
      if (!column.hasOwnProperty('type')) {
        Ember.set(column, 'type', 'text');
      }
    });
  }),

  defaultSort: Ember.on('init', function () {
    const sort = this.get('sort');
    if (!sort) {
      this.get('columns').map((el) => {
        if (el.hasOwnProperty('defaultSort')) {
          this.set('sort', el.defaultSort);
        }
      });
    }
  }),

  setFilterSortPersist: Ember.on('willDestroyElement', function () {
    const persistFiltering = this.get('persistFiltering');
    if (!persistFiltering) {
      // clear any filters
      this.setProperties({
        filter: null,
        sort: null,
      });
    }
  }),

  query: Ember.computed('page', 'limit', 'offset', 'sort', 'filter.@each.value',
  'staticParams', function () {
    let query = {};
    const filter = this.get('filter') || [];
    query = {
      page: this.get('page'),
      limit: this.get('limit'),
      offset: this.get('offset'),
      sort: this.get('sort'),
      filter: filter.reduce((memo, filter) => Ember.merge(memo, {
        [filter.field]: filter.value,
      }), {}),
    };

    // Merge staticParams/query into query
    Ember.merge(query, this.get('staticParams'));

    return query;
  }),

  request(params, modelName) {
    params = this.serialize(params);

    return this.get('store').query(modelName, params).then(
      function (data) {
        if (!this.isDestroyed || !this.isDestroying) {
          data = this.normalize(data, params);
          this.set('isLoading', false);
          this.set('record', data);
        }
      }.bind(this),
      function (errors) {
        if (!this.isDestroyed || !this.isDestroying) {
          this.failure(errors);
        }
      }.bind(this)
    );
  },

  setModel: Ember.on('init', Ember.observer('query', 'makeRequest', function () {
    Ember.run.once(this, function () {
      // If makeRequest is false do not make request and setModel
      if (this.get('makeRequest')) {
        this.reset();
        this.set('isLoading', true);
        const modelName = this.get('modelName');
        const params = this.get('query');

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
  },

  setSort: Ember.on('didInsertElement', function (sortProperty) {
    if (this.get('sort') || sortProperty) {
      let property;

      if (sortProperty) {
        property = sortProperty;
      } else {
        property = this.get('sort').replace(/^-/, '');
        // Must be the opposite of property
        sortProperty = `-${property}`;
      }

      property = property;

      if (this.get('sort') === sortProperty) {
        this.set('sort', `-${property}`);
      } else {
        this.set('sort', property);
      }
    }
  }),

  updateSortUI: Ember.on('didInsertElement', function (sortProperty) {
    if (this.get('sort') || sortProperty) {
      const _this = this;
      const $table = this.$();
      const sort = this.get('sort');
      let property,
        classProperty,
        $tableHeader;

      // convert property to camelCase
      property = sort.replace(/^-/, '');
      // convert relationships
      classProperty = property.replace(/\./g, '-');
      $tableHeader = Ember.$(`#${classProperty}`);

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

  failure(response) {
    this.reset();
    this.setProperties({
      isFailure: true,
      pageLimit: null,
    });

    // Set per field errors if found
    if ('errors' in response) {
      this.set('errors', response.errors);
    }
  },

  reset() {
    this.setProperties({
      isLoading: false,
      errors: null,
      isSuccess: false,
      isFailure: false,
      successMessage: this.get('defaultSuccessMessage'),
      failureMessage: this.get('defaultFailureMessage'),
    });
  },
});
