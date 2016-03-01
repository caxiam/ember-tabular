import Mirage, {faker}  from 'ember-cli-mirage';
import moment from 'moment';

export default Mirage.Factory.extend({
  'username'() { return faker.internet.userName(); },
  'email-address'() { return faker.internet.email(); },
  'first-name'() { return faker.name.firstName(); },
  'last-name'() { return faker.name.lastName(); },
  'is-admin'() { return faker.random.arrayElement([true, false]); },
  'created-at'() { return moment(faker.date.past()).format('YYYY-MM-DD'); },
  'updated-at'() { return moment(faker.date.past()).format('YYYY-MM-DD'); },
});
