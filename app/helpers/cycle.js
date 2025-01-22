import { helper } from '@ember/component/helper';

export default helper(function cycle([evenValue, oddValue, index] /*, named*/) {
  return index % 2 === 0 ? evenValue : oddValue;
});
