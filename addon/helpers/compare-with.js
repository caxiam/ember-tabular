import Ember from 'ember';

export default Ember.Helper.helper(function([collection, attrName, attrValue, hasProperty]) {
  if (collection) {
    return collection.find(el => el[attrName] === attrValue && el[hasProperty]);
  }
});
