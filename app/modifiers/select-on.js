import Modifier from 'ember-modifier';
import { registerDestructor } from '@ember/destroyable';

function cleanup(instance) {
  const { element, eventType, focusAndSelect, resetFirstClick } = instance;

  if (element && eventType) {
    element.removeEventListener(eventType, focusAndSelect);
    instance.element = null;
    instance.eventType = null;
  }
  element?.removeEventListener('blur', resetFirstClick);
}

export default class SelectOnModifier extends Modifier {
  element = null;
  eventType = null;
  isFirstClickAfterBlur = true;

  modify(element, [eventType]) {
    // Save element and eventType for cleanup
    this.element = element;
    this.eventType = eventType;

    this.isFirstClickAfterBlur = document.activeElement !== element;

    element.addEventListener(eventType, this.focusAndSelect.bind(this));
    element.addEventListener('blur', this.resetFirstClick.bind(this));

    // Register destructor
    registerDestructor(this, cleanup);
  }

  resetFirstClick(event) {
    this.isFirstClickAfterBlur = true;
  }

  focusAndSelect(event) {
    if (this.isFirstClickAfterBlur) {
      const element = event.target;
      element.focus();
      element.select();
      this.isFirstClickAfterBlur = false;
    }
  }
}
