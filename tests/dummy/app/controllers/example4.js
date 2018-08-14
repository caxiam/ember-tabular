import Ember from 'ember';

export default Ember.Controller.extend({
  columns: [
    {
      property: 'username',
      label: 'Username',
      isActive: true,
      filter: false,
    },
    {
      property: 'emailAddress',
      label: 'Email',
      isActive: true,
      filter: false,
    },
    {
      property: 'firstName',
      label: 'First Name',
      isActive: true,
      filter: false,
    },
    {
      property: 'lastName',
      label: 'Last Name',
      isActive: true,
      filter: false,
    },
    {
      property: 'updatedAt',
      label: 'Last Updated',
      isActive: true,
      isCustom: true,
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
