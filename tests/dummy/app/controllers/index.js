import Ember from 'ember';

export default Ember.Controller.extend({
    users: null,
    columns: [
        {
            property: 'username',
            label: 'Username',
            type: 'text',
            defaultSort: 'username',
        },
        {
            property: 'email-address',
            label: 'Email',
            type: 'text',
        },
        {
            property: 'first-name',
            label: 'First Name',
            type: 'text',
        },
        {
            property: 'last-name',
            label: 'Last Name',
            type: 'text',
        },
        {
            property: 'updated-at',
            label: 'Last Updated',
            type: 'date',
        },
    ],
});
