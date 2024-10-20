import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ProjectPillRadioGroupComponent extends Component {
  colorMap = {
    Loket: 'bg-blue-500',
    Kaleidos: 'bg-green-500',
    Nove: 'bg-yellow-500',
    GN: 'bg-red-500',
    'Out of Office': 'bg-slate-400',
  };

  get color() {
    return this.colorMap[this.args.project];
  }

  @action
  onChangeSelected(project) {
    this.args.onChangeSelected?.(project);
  }
}
