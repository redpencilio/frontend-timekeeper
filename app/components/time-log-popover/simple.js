import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { trackedReset } from 'tracked-toolbox';

export default class TimeLogPopoverComponent extends Component {
  @trackedReset({
    memo: 'args.selectedHourLog',
    update() {
      return this.args.selectedHourLog.duration.hours;
    },
  })
  hours = 8;

  @trackedReset({
    memo: 'args.selectedHourLog',
    update() {
      return this.args.selectedHourLog.task;
    },
  })
  project = this.args.projects.get('firstObject');

  @action
  updateHours(event) {
    this.hours = event.target.valueAsNumber;
  }

  @action
  updateDescription(event) {
    this.project = event.target.value;
  }

  @action
  closePopover() {
    this.args.onCancel?.();
  }

  @action
  submitLog(event) {
    event.preventDefault();
    this.args.onSave?.perform({
      duration: {
        hours: this.hours,
      },
      project: this.project,
    });
  }
}
