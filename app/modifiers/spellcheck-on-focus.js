import { modifier } from 'ember-modifier';

export default modifier(function (element) {
  const addSpellCheck = () => {
    element.spellcheck = true;
  };

  const removeSpellcheck = () => {
    element.spellcheck = false;
  };

  element.addEventListener('focus', addSpellCheck);
  element.addEventListener('blur', removeSpellcheck);
  return () => {
    element.removeEventListener('focus', addSpellCheck);
    element.removeEventListener('blur', removeSpellcheck);
  };
});
