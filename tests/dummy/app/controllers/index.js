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
            property: 'email_address',
            label: 'Email',
            type: 'text',
        },
        {
            property: 'first_name',
            label: 'First Name',
            type: 'text',
        },
        {
            property: 'last_name',
            label: 'Last Name',
            type: 'text',
        },
        {
            property: 'is_admin',
            label: 'Is Admin',
            type: 'text',
        },
        {
            property: 'updated_at',
            label: 'Last Updated',
            type: 'date',
            defaultSort: '-updated_at',
        },
    ],
});
