import { modifier } from 'ember-modifier';
import { autoUpdate } from '@floating-ui/dom';

export default modifier(function floatingUiAutoUpdate(
  element,
  [referenceEl, updateFunction],
) {
  return autoUpdate(referenceEl, element, updateFunction);
});
