import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import { localCopy } from 'tracked-toolbox';
import selectOn from 'frontend-timekeeper/modifiers/select-on';

export default class HourInput extends Component {
  @localCopy('args.value') value = 0;

  get isRequired() {
    return this.args.isRequired ?? true;
  }

  <template>
    <input
      type='number'
      min={{0}}
      class='h-10 w-20 mt-1 block border-gray-200 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
      value={{this.value}}
      {{on 'change' @onChange}}
      {{selectOn 'click'}}
      required={{this.isRequired}}
      ...attributes
    />
  </template>
}
