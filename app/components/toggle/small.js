import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ToggleSmallComponent extends Component {
  @action
  onToggle(event) {
    this.args.onToggle?.(event.target.checked);
  }
}
