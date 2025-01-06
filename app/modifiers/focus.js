import { modifier } from 'ember-modifier';

export default modifier(function focus(element, [shouldFocus=true]) {
  if (shouldFocus) {
    element.focus();
  }
});
