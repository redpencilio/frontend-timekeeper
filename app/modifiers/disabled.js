import { modifier } from 'ember-modifier';

export default modifier(function disabled(element, [condition]) {
  if (condition) {
    element.disabled = true;
  } else {
    element.disabled = false;
  }
});
