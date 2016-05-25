import Ember from 'ember';

export default Ember.Component.extend({
    tagName: null,
    action: null,
    headerFilter: '',

    query: null,
    filter: null,

    actions: {
        clearFilter() {
            this.set('headerFilter', '');
        }
    },
    filterBy: Ember.observer('headerFilter', function() {
        Ember.run.debounce(this, 'filterName', 750);
    }),
    isClearable: Ember.computed('headerFilter', function() {
        if (this.get('headerFilter')) {
            return true;
        }
        return false;
    }),
    inputPlaceholder: Ember.computed('header.type', function() {
        var type = this.get('header.type');

        if (type === 'date') {
            return 'YYYY-MM-DD';
        }
    }),
    filterName() {
        var query = this.get('query'),
            property = this.get('property'),
            value = this.get('headerFilter'),
            filter;

        // Set the query on the filter object
        if (query.hasOwnProperty('filter') && query.filter !== null) {
            filter = this.get('query.filter');
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
        var filters = Object.keys(filter).map(function(key){
            return {
                field: key,
                value: filter[key]
            };
        });

        // Trigger 'setModel'
        this.set('filter', filters);
    },
});