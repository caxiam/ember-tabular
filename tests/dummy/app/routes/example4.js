import Ember from 'ember';

export default Ember.Route.extend({
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
    model(params) {
        let controller = this.controllerFor('example4');
        // Override to set dynamic offset based on page and limit
        params.offset = (params.page * params.limit) - params.limit;
        params.sort = 'username';

        controller.set('isLoading', true);

        return this.store.query('user', params).then(function(data) {
            // pagination - return number of pages
            controller.set('pageLimit', Math.ceil(data.meta.total/params.limit));
            controller.set('isLoading', false);
            return data;
        });
    },
});
