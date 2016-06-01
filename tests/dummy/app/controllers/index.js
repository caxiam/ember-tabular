import Ember from 'ember';

export default Ember.Controller.extend({
    users: null,
    users2: null,
    users3: null,
    columns: [
        {
            property: 'username',
            label: 'Username',
            defaultSort: 'username',
        },
        {
            property: 'emailAddress',
            label: 'Email',
        },
        {
            property: 'firstName',
            label: 'First Name',
        },
        {
            property: 'lastName',
            label: 'Last Name',
        },
        {
            property: 'isAdmin',
            label: 'Is Admin',
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
            type: 'date',
            sort: false,
        },
        {
            label: 'Actions',
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
