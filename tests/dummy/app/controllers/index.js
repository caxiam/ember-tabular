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
  orderConfig: [
    'username',
    'emailAddress',
    'password',
    'firstName',
    'lastName',
    'isAdmin',
    'createdAt',
    'updatedAt',
    'actions',
  ],
  hideOmittedConfig: [
    'username',
    'emailAddress',
    'firstName',
    'lastName',
    'isAdmin',
  ],
  columnsConfig: [
    {
      property: 'emailAddress',
      isCustom: true,
    },
    {
      property: 'updatedAt',
      isCustom: true,
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
      isCustom: true,
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
      isCustom: true,
      isActive: true,
    },
    {
      property: 'emailAddress',
      label: 'Email',
      isCustom: true,
      isActive: true,
    },
    {
      property: 'firstName',
      label: 'First Name',
      isCustom: true,
      isActive: true,
    },
    {
      property: 'lastName',
      label: 'Last Name',
      isCustom: true,
      isActive: true,
    },
    {
      property: 'isAdmin',
      label: 'Is Admin',
      isCustom: true,
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
      isCustom: true,
      isActive: true,
      type: 'date',
      sort: false,
    },
    {
      property: 'actions',
      label: 'Actions',
      isCustom: true,
      filter: false,
      sort: false,
      isActive: true,
    },
  ],
  columnsForDropdownFilter: [
    {
      label: 'Username',
      property: 'username',
      isActive: true,
      filter: false,
      sort: false,
    },
    {
      label: 'Email',
      property: 'emailAddress',
      isActive: true,
      filter: false,
      sort: false,
    },
    {
      label: 'First Name',
      property: 'firstName',
      isActive: true,
      filter: false,
      sort: false,
    },
    {
      label: 'Last Name',
      property: 'lastName',
      isActive: true,
      filter: false,
      sort: false,
    },
    {
      label: 'Last Updated',
      property: 'updatedAt',
      isActive: true,
      filter: false,
      sort: false,
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
