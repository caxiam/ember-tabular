import { get } from '@ember/object';
import { helper as buildHelper } from '@ember/component/helper';

export default buildHelper(function([collection, attrName, attrValue]) {
  if (collection) {
    return collection.find(el => get(el, attrName) === attrValue);
  }
});
