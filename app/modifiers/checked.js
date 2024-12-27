import { modifier } from 'ember-modifier';

export default modifier(function checked(element , [checked], /*named*/) {
  element.checked = checked;
});
