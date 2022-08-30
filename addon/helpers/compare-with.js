import { helper as buildHelper } from '@ember/component/helper';

export default buildHelper(function([collection, attrName, attrValue, hasProperty]) {
  if (collection) {
    return collection.find(el => el[attrName] === attrValue && el[hasProperty]);
  }
});
