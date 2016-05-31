import Ember from 'ember';

export default Ember.Controller.extend({
  columns: [
    {
      label: 'Username',
    },
    {
      label: 'Email',
    },
    {
      label: 'First Name',
    },
    {
      label: 'Last Name',
    },
    {
      label: 'Last Updated',
    },
  ],
  // used in Example 4
  queryParams: ['page', 'limit', 'offset', 'sort'],
  page: 1,
  limit: 10,
  pageLimit: 0,
  offset: 0,
});
