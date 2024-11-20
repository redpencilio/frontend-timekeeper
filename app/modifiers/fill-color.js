import { modifier } from 'ember-modifier';
import { htmlSafe } from '@ember/template';

export default modifier(function bgColor(element, [color]) {
  element.style['fill'] = htmlSafe(color);
});
