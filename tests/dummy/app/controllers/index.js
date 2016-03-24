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
    // used in Example 4
    queryParams: ['page', 'limit', 'offset', 'sort'],
    page: 1,
    limit: 10,
    pageLimit: 0,
    offset: 0,
});
