import Ember from 'ember';

export default Ember.Helper.helper(function([collection, attrName, attrValue]) {
  if (collection) {
    return collection.find(el => Ember.get(el, attrName) === attrValue);
  }
});
