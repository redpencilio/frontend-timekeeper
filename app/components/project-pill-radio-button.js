import Component from '@glimmer/component';

export default class ProjectPillRadioButtonComponent extends Component {
  colorMap = {
    Loket: 'bg-indigo-500',
    Kaleidos: 'bg-green-500',
    Nove: 'bg-yellow-500',
    GN: 'bg-red-500',
    'Out of Office': 'bg-slate-400',
  };

  get color() {
    return this.colorMap[this.args.project];
  }
}
