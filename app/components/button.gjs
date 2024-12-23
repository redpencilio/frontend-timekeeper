import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import { localCopy } from 'tracked-toolbox';
import selectOn from 'frontend-timekeeper/modifiers/select-on';
import disabled from 'frontend-timekeeper/modifiers/disabled';

export default class ButtonComponent extends Component {
  get class() {
    const baseClass = 'px-4 py-2 inline-flex justify-center font-medium';
    const primaryClass =
      this.args.skin === 'primary' || !this.args.skin
        ? 'border border-transparent rounded-md shadow-sm text-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        : '';
    const disabledClass = this.args.isDisabled
      ? 'cursor-not-allowed bg-blue-400 hover:bg-blue-400'
      : '';

    const errorClass =
      this.args.skin === 'error'
        ? 'border border-transparent rounded-md shadow-sm text-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        : '';
    const muteClass = this.args.skin === 'mute' ? 'text-gray-500' : '';

    return `${baseClass} ${primaryClass} ${errorClass} ${muteClass} ${disabledClass}`.trim();
  }

  <template>
    <button
      type='button'
      class={{this.class}}
      {{disabled @isDisabled}}
      ...attributes
    >
      {{#if @isLoading}}
        Loading...
      {{else}}
        {{yield}}
      {{/if}}
    </button>
  </template>
}
