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
        },
        {
            property: 'emailAddress',
            label: 'Email',
            type: 'text',
        },
        {
            property: 'firstName',
            label: 'First Name',
            type: 'text',
        },
        {
            property: 'lastName',
            label: 'Last Name',
            type: 'text',
        },
        {
            property: 'updatedAt',
            label: 'Last Updated',
            type: 'date',
            defaultSort: 'updatedAt',
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
