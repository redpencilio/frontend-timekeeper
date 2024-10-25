import { modifier } from 'ember-modifier';

export default modifier(function focusOnce(
  element,
  [clearContext, clearProp] /*, named*/,
) {
  clearContext[clearProp] = null;
});
