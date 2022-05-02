import Mirage from 'ember-cli-mirage';
import faker from '@faker-js/faker';
import moment from 'moment';

export default Mirage.Factory.extend({
  username() { return faker.internet.userName(); },
  emailAddress() { return faker.internet.email(); },
  password() { return faker.internet.password(); },
  firstName() { return faker.name.firstName(); },
  lastName() { return faker.name.lastName(); },
  isAdmin() { return faker.random.arrayElement([true, false]); },
  createdAt() { return moment(faker.date.past()).format('YYYY-MM-DD'); },
  updatedAt() { return moment(faker.date.past()).format('YYYY-MM-DD'); },
});
