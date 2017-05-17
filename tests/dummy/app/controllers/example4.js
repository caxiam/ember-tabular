import Ember from 'ember';

export default Ember.Controller.extend({
  columns: [
    {
      property: 'username',
      label: 'Username',
      filter: false,
    },
    {
      property: 'email-address',
      label: 'Email',
      filter: false,
    },
    {
      property: 'first-name',
      label: 'First Name',
      filter: false,
    },
    {
      property: 'last-name',
      label: 'Last Name',
      filter: false,
    },
    {
      property: 'updated-at',
      label: 'Last Updated',
      filter: false,
    },
  ],
  // used in Example 4
  queryParams: ['page', 'limit', 'offset', 'sort'],
  page: 1,
  limit: 10,
  pageLimit: 0,
  offset: 0,
  sort: 'username',
});
