import Mixin from '@ember/object/mixin';

export default Mixin.create({
  _formatColumnLabel(text) {
    // split any camelCase => camel Case
    let result = text.replace(/([A-Z])/g, ' $1');
    let results = result.split('.');
    // ensure first character is capitalized
    result = results.map((str) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }).join(' ');
    // replace all double-whitespaces with single
    return result.replace(/ +(?= )/g, '');
  },
});
