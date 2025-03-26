import Component from '@glimmer/component';

export default class ButtonComponent extends Component {
  get isPrimary() {
    return this.args.skin === 'primary' || !this.args.skin;
  }

  get isMute() {
    return this.args.skin === 'mute';
  }

  get class() {
    const baseClass = 'px-4 py-2 inline-flex justify-center font-medium';
    const primaryClass =
      this.isPrimary
        ? 'border border-transparent rounded-md shadow-sm text-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
        : '';

    const bgColorClass = this.args.isDisabled
      ? 'bg-red-300 hover:bg-red-300 '
      : this.isPrimary
        ? 'bg-red-700 hover:bg-red-600'
        : '';
    const disabledClass = this.args.isDisabled ? 'cursor-not-allowed' : '';

    const muteClass = this.args.skin === 'mute' ? 'text-red-700' : '';

    return `${baseClass} ${primaryClass} ${bgColorClass} ${muteClass} ${disabledClass}`.trim();
  }
}
