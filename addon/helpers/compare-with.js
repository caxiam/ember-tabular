import Ember from 'ember';

export default Ember.Helper.helper(function([collection, attrName, attrValue, hasProperty]) {
  if (collection) {
    return collection.find(el => {
      return Ember.get(el, attrName) === attrValue && Ember.get(el, hasProperty);
    });
  }
});
