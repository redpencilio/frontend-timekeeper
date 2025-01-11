import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';

export default class CheckboxComponent extends Component {
  
  change = (event) => {
    const { checked } = event.target;
    this.args.onChange?.(checked, event);
  }

  <template>
    {{! template-lint-disable require-input-label }}
    <input
      type='checkbox'
      class='w-4 h-4 text-red-700 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2'
      checked={{@checked}}
      {{on "change" this.change}}
      ...attributes
    />
  </template>
}
