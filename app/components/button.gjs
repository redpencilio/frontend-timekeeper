import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import { localCopy } from 'tracked-toolbox';
import selectOn from 'frontend-timekeeper/modifiers/select-on';

export default class ButtonComponent extends Component {
  get class() {
    const base = 'px-4 py-2 inline-flex justify-center font-medium';
    const cancel = 'text-gray-500';
    const primary =
      'border border-transparent rounded-md shadow-sm text-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500';
    if (this.args.skin === 'mute') {
      return [base, cancel].join(' ');
    } else {
      return [base, primary].join(' ');
    }
  }

  <template>
    <button type='button' class={{this.class}} ...attributes>
      {{#if @isLoading}}
        Loading
      {{else}}
        {{yield}}
      {{/if}}
    </button>
  </template>
}
