import Ember from 'ember';

export default Ember.Mixin.create({
  _formatColumnLabel(text) {
    let results = text.split('.');
    // ensure first character is capitalized
    let result = results.map((str) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }).join(' ');
    result = result.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
  },
});
