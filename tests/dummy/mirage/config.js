import Ember from 'ember';

function filterObj(where, collection, query) {
  // Filter ?filter[property]=value => {property: value, property: value}
  for (var key in where) {
    if (key.indexOf('filter') > -1) {
      let value = where[key];
      // Strip filter[] from key
      let filterKey = key.replace('filter[', '').replace(']', '');

      query[Ember.String.camelize(filterKey)] = value;
    }
  }

  return query;
}

export default function() {
  this.namespace = '';
  this.urlPrefix = '/';

  /*
  Routes
  */
  this.get('/users', (schema, request) => {
    if (request.queryParams) {
      return schema.user.where(filterObj(request.queryParams, schema.db['users'], {}));
    }

    return schema.user.all();
  });
  this.get('/users/:id');
}
