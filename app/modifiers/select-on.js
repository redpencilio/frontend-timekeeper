import { modifier } from 'ember-modifier';

function focusAndSelect(event) {
  const element = event.target;
  element.focus();
  element.select();
}

export default modifier(function selectOn(element, [eventType] /* named*/) {
  element.addEventListener(eventType, focusAndSelect);
  return () => {
    element.removeEventListener(eventType, focusAndSelect);
  };
});
