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
            property: 'email-address',
            label: 'Email',
        },
        {
            property: 'first-name',
            label: 'First Name',
        },
        {
            property: 'last-name',
            label: 'Last Name',
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
