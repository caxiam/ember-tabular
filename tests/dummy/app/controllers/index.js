import Ember from 'ember';

export default Ember.Controller.extend({
  users: null,
  users2: null,
  users3: null,
  users4: null,
  filter: null,
  filter2: null,
  filter3: null,
  sort1: 'username',
  sort2: 'username',
  sort3: 'username',
  sort4: 'username',
  isAdminFilter: null,
  columnsConfig: [
    {
      property: 'emailAddress',
      isCustomTemplate: true,
    },
    {
      property: 'updatedAt',
      isCustomTemplate: true,
    },
    {
      property: 'password',
      isActive: false,
    },
    {
      property: 'createdAt',
      isActive: false,
    },
    {
      property: 'isAdmin',
      isActive: false,
    },
    {
      label: 'Actions',
      property: 'actions',
      isCustomTemplate: true,
      isActive: true,
      filter: false,
      sort: false,
    },
  ],
  columns: [
    {
      property: 'username',
      label: 'Username',
      defaultSort: 'username',
      isCustomTemplate: true,
      isActive: true,
    },
    {
      property: 'emailAddress',
      label: 'Email',
      isCustomTemplate: true,
      isActive: true,
    },
    {
      property: 'firstName',
      label: 'First Name',
      isCustomTemplate: true,
      isActive: true,
    },
    {
      property: 'lastName',
      label: 'Last Name',
      isCustomTemplate: true,
      isActive: true,
    },
    {
      property: 'isAdmin',
      label: 'Is Admin',
      isCustomTemplate: true,
      isActive: true,
      list: [
        {
          label: 'Yes',
          value: true,
        },
        {
          label: 'No',
          value: false,
        }
      ],
    },
    {
      property: 'updatedAt',
      label: 'Last Updated',
      isCustomTemplate: true,
      isActive: true,
      type: 'date',
      sort: false,
    },
    {
      property: 'actions',
      label: 'Actions',
      isCustomTemplate: true,
      filter: false,
      sort: false,
      isActive: true,
    },
  ],
  columns2: [
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
  actions: {
    setIsAdminFilter(object) {
      if (object) {
        this.set('isAdminFilter', object.value);
      } else {
        this.set('isAdminFilter', null);
      }
    },
  },
  adminContent: Ember.computed(function() {
    return [
      {
        label: 'Yes',
        value: true,
      },
      {
        label: 'No',
        value: false,
      }
    ];
  }),
});
