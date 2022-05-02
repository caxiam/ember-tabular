import { helper as buildHelper } from '@ember/component/helper';

export default buildHelper(function (value) {
  return value.toString().replace(/\./g, '-');
});
