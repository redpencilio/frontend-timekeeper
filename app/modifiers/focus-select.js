import { modifier } from 'ember-modifier';

export default modifier(function focus(element, [shouldFocus]) {
  if (shouldFocus) {
    element.focus();
    element.select();
  }
});
