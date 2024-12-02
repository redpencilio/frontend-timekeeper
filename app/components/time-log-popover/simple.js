import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { trackedReset } from 'tracked-toolbox';

export default class TimeLogPopoverComponent extends Component {
  @service userProfile;

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
  task = this.userProfile.favoriteTasks[0];

  @action
  updateHours(event) {
    this.hours = event.target.valueAsNumber;
  }

  @action
  closePopover() {
    this.args.onCancel?.();
  }

  @action
  submitWorkLog(event) {
    event.preventDefault();
    this.args.onSave?.perform({
      duration: {
        hours: this.hours,
      },
      task: this.task,
    });
  }
}
