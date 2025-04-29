import Component from '@glimmer/component';

export default class CheckboxComponent extends Component {
  change = (event) => {
    const { checked } = event.target;
    this.args.onChange?.(checked, event);
  };
}
