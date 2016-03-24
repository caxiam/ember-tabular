import Ember from 'ember';

export default Ember.Component.extend({
    store: Ember.inject.service('store'),
    action: null,
    classNames: ['ember-table-jsonapi'],
    hasActions: false,
    makeRequest: true,
    sortableClass: 'sortable',
    tableLoadedMessage: 'No Data.',
    columnLength: Ember.computed('columns', function() {
        var columnLength = this.get('columns').length;
        return this.get('hasActions') ? columnLength + 1 : columnLength;
    }),

    // Allows multiple yields
    header: {
        isHeader: true
    },
    body: {
        isBody: true
    },
    footer: {
        isFooter: true
    },

    // Model to be requested
    modelType: null,
    // Bind variable for table data
    bindModel: null,
    columns: null,

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

    defaultSuccessMessage: 'Success!',
    defaultFailureMessage: 'There was an issue. Please check below for errors.',

    // Messages
    successMessage: Ember.get(Ember.Component, 'defaultSuccessMessage'),
    failureMessage: Ember.get(Ember.Component, 'defaultFailureMessage'),

    // For pushing any per field errors
    errors: null,

    isBindModelLoaded: Ember.computed('errors', 'bindModel', 'bindModel.isFulfilled', 'bindModel.isLoaded', 'makeRequest', function() {
        // If bindModel array isLoaded but empty
        if (this.get('bindModel.isLoaded')) {
            return true;
        }
        // If bindModel.content array loaded is empty
        if (this.get('bindModel.isFulfilled')) {
            return true;
        }
        // If errors
        if (this.get('errors')) {
            return true;
        }
        // If bindModel array is empty
        if (this.get('bindModel') && this.get('bindModel').length === 0) {
            return true;
        }
        // Show custom tableLoadedMessage
        if (this.get('bindModel') === null && !this.get('makeRequest')) {
            return true;
        }

        return false;
    }),

    isColumnFilters: Ember.computed('columns', function() {
        let columns = this.get('columns');

        for (var i = columns.length - 1; i >= 0; i--) {
            if (columns[i].hasOwnProperty('property')) {
                return true;
            }
        }

        return false;
    }),

    defaultSort: Ember.on('init', function() {
        this.get('columns').map(function(el) {
            if (el.hasOwnProperty('defaultSort')) {
                this.set('sort', el.defaultSort);
            }
        }.bind(this));
    }),

    query: Ember.computed('page', 'limit', 'offset', 'sort', 'filter.@each.value', 'staticParams', function() {
        var query = {},
            filter = this.get('filter') || [];
        query = {
            'page': this.get('page'),
            'limit': this.get('limit'),
            'offset': this.get('offset'),
            'sort': this.get('sort'),
            'filter': filter.reduce( (memo, filter) => Ember.merge(memo, {[filter.field]: filter.value}), {} ),
        };

        // Merge staticParams/query into query
        Ember.merge(query, this.get('staticParams'));

        return query;
    }),

    setModel: Ember.on('init', Ember.observer('query', function() {
        Ember.run.once(this, function() {
            this.reset();
            // If makeRequest is false do not make request and setModel
            if (this.get('makeRequest')) {
                var modelType = this.get('modelType'),
                    params = this.get('query');
                // Override to set dynamic offset based on page and limit
                params.offset = (params.page * params.limit) - params.limit;
                if (isNaN(params.offset)) {
                    params.offset = null;
                }

                return this.get('store').query(modelType, params).then(
                    function(data) {
                        // pagination - return number of pages
                        let pageLimit = Math.ceil(data.meta.total/params.limit);
                        // determine if pageLimit is a valid number value
                        if (isFinite(pageLimit)) {
                            this.set('pageLimit', pageLimit);
                        } else {
                            this.set('pageLimit', null);
                        }

                        this.set('bindModel', data);
                    }.bind(this),
                    function(errors) {
                        this.failure(errors);
                    }.bind(this)
                );
            }
        });
    })),

    actions: {
        sortBy(property) {
            this.setSort(property);
        }
    },

    setSort: Ember.on('didInsertElement', function(sortProperty) {
        if (this.get('sort') || sortProperty) {
            var _this = this,
                $table = this.$(),
                property,
                classProperty,
                $tableHeader;

            if (sortProperty) {
                property = sortProperty;
                classProperty = property.replace(/\./g, '-');
                $tableHeader = Ember.$('#' + classProperty);
            } else {
                property = this.get('sort').replace(/\-/g, '');
                // Must be the opposite of property
                sortProperty = '-' + property;
                classProperty = property.replace(/\./g, '-');
                $tableHeader = Ember.$('#' + classProperty);
            }

            // Remove all classes on th.sortable but sortable class
            $table.find('th').removeClass(function(i, group) {
                var list = group.split(' ');
                return list.filter(function(val) {
                    return (val !== _this.get('sortableClass'));
                }).join(' ');
            });

            if (this.get('sort') === sortProperty) {
                this.set('sort', '-' + property);
                $tableHeader.addClass('sort-desc');
            } else {
                this.set('sort', property);
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
            'bindModel': null,
            'errors': null,
            'isSuccess': false,
            'isFailure': false,
            'successMessage': this.get('defaultSuccessMessage'),
            'failureMessage': this.get('defaultFailureMessage'),
        });
    },
});
