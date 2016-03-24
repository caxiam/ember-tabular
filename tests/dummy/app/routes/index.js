import Ember from 'ember';

export default Ember.Route.extend({
    // used in Example 4
    queryParams: {
        page: {
            refreshModel: true
        },
        limit: {
            refreshModel: true
        },
        offset: {
            refreshModel: true
        },
        sort: {
            refreshModel: true
        }
    },
    // used in Example 4
    model(params) {
        let controller = this.controllerFor('index');
        // Override to set dynamic offset based on page and limit
        params.offset = (params.page * params.limit) - params.limit;
        params.sort = 'username';

        return this.store.query('user', params).then(function(data) {
            // pagination - return number of pages
            controller.set('pageLimit', Math.ceil(data.meta.total/params.limit));
            return data;
        });
    },
});
