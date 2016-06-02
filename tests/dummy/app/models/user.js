import DS from 'ember-data';

export default DS.Model.extend({
  username: DS.attr(),
  emailAddress: DS.attr(),
  password: DS.attr(),
  firstName: DS.attr(),
  lastName: DS.attr(),
  isAdmin: DS.attr(),
  createdAt: DS.attr('dateFormat'),
  updatedAt: DS.attr('dateFormat'),
});
