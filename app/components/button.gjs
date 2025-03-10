import Component from '@glimmer/component';
import disabled from 'frontend-timekeeper/modifiers/disabled';

export default class ButtonComponent extends Component {
  get class() {
    const baseClass = 'px-4 py-2 inline-flex justify-center font-medium';
    const primaryClass =
      this.args.skin === 'primary' || !this.args.skin
        ? 'border border-transparent rounded-md shadow-sm text-sm text-white bg-red-700 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
        : '';
    const disabledClass = this.args.isDisabled
      ? 'cursor-not-allowed bg-red-700 hover:bg-red-700'
      : '';

    const errorClass =
      this.args.skin === 'error'
        ? 'border border-transparent rounded-md shadow-sm text-sm text-white bg-red-700 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        : '';
    const muteClass = this.args.skin === 'mute' ? 'text-red-700 hover:bg-gray-100 rounded' : '';

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
