import { modifier } from 'ember-modifier';

export default modifier(function dynamicTextareaHeight(element) {
  const setHeight = () => {
    element.style.height = '';
    element.style.height = element.scrollHeight + 'px';
  };
  element.addEventListener('input', setHeight);
  if (element.value.length > 0) {
    setHeight();
  }
  return () => element.removeEventListener('input', setHeight);
});
