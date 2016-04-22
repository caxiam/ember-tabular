import Ember from 'ember';

export default Ember.Controller.extend({
    users: null,
    users2: null,
    users3: null,
    columns: [
        {
            property: 'username',
            label: 'Username',
            type: 'text',
            sort: true,
            defaultSort: 'username',
        },
        {
            property: 'email-address',
            label: 'Email',
            type: 'text',
            sort: true,
        },
        {
            property: 'first-name',
            label: 'First Name',
            type: 'text',
            sort: true,
        },
        {
            property: 'last-name',
            label: 'Last Name',
            type: 'text',
            sort: true,
        },
        {
            property: 'updated-at',
            label: 'Last Updated',
            type: 'date',
            sort: false,
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
});
