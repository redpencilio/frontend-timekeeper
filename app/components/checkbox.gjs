import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import checked from 'frontend-timekeeper/modifiers/checked';
import { on } from '@ember/modifier';

export default class CheckboxComponent extends Component {
  
  handleClick = (event) => {
    this.args.onChange?.(event.target.checked, event);
  }

  <template>
    {{! template-lint-disable require-input-label }}
    <input
      type='checkbox'
      class='w-4 h-4 text-red-700 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2'
      {{checked @isChecked}}
      {{on "click" this.handleClick}}
      ...attributes
    />
  </template>
}
