import Ember from 'ember';

export default Ember.Helper.helper((value) => {
  return value.toString().replace(/\./g, '-');
});
