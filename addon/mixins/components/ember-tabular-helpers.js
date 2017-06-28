import Ember from 'ember';

export default Ember.Mixin.create({
  _formatColumnLabel(text) {
    let result = text.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
  },
});
