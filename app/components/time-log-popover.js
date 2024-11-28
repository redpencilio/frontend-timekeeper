import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class TimeLogPopoverComponent extends Component {
  @service localStorage;

  @action
  onToggle(value) {
    this.localStorage.useAdvancedLogPopover = value;
  }
}
