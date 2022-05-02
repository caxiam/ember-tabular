import { dasherize } from '@ember/string';
import Route from '@ember/routing/route';

export default Route.extend({
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
    controller.set('isLoading', true);

    // convert static params back to objects
    if (params['page[limit]']) {
      params.limit = params['page[limit]'];
    }
    if (params['page[offset]']) {
      params.offset = params['page[offset]'];
    }
    if (params.sort) {
      params.sort = dasherize(params.sort);
    }

    // Override to set dynamic offset based on page and limit
    params.offset = (params.page * params.limit) - params.limit;
    if (isNaN(params.offset)) {
      // undefined to not send in request
      params.offset = undefined;
    }

    // Support json api page[offset]/page[limit] spec
    params.page = {};
    params.page.limit = params.limit;
    params.page.offset = params.offset;
    // remove unncessary params from url query
    delete params.limit;
    delete params.offset;
    delete params['page[limit]'];
    delete params['page[offset]'];

    return this.store.query('user', params).then((data) => {
      // pagination - return number of pages
      let pageLimit = Math.ceil(data.meta.total / params.page.limit);
      // determine if pageLimit is a valid number value
      if (isFinite(pageLimit)) {
        controller.set('pageLimit', pageLimit);
      } else {
        controller.set('pageLimit', null);
      }
      controller.set('isLoading', false);

      return data;
    });
  },
});
