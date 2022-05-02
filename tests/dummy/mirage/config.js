import { camelize } from '@ember/string';

function filterObj(where, collection, query) {
  // Filter ?filter[property]=value => {property: value, property: value}
  for (var key in where) {
    if (key.indexOf('filter') > -1 || key.indexOf('relationship') > -1) {
      let value = where[key];
      // Strip filter[] from key
      let filterKey = key.replace('filter[', '').replace(']', '');

      query[camelize(filterKey)] = value;
    }
  }

  return query;
}

export default function() {
  this.namespace = '';

  /*
  Routes
  */
  this.get('/users', (schema, request) => {
    if (request.queryParams) {
      return schema.users.where(filterObj(request.queryParams, schema.db['users'], {}));
    }

    return schema.users.all();
  });
  this.get('/users/:id');
}
