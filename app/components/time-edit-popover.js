import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { trackedReset } from 'tracked-toolbox';

export default class TimeEditPopoverComponent extends Component {
  @service userProfile;

  @trackedReset({
    memo: 'args.selectedHourLog',
    update() {
      return this.args.selectedHourLog.duration;
    },
  })
  duration = { hours: 8, minutes: 0 };

  @trackedReset({
    memo: 'args.selectedHourLog',
    update() {
      return this.args.selectedHourLog.task;
    },
  })
  task = this.userProfile.favoriteTasks[0];

  @action
  updateDuration(duration) {
    this.duration = duration;
  }

  @action
  closePopover() {
    this.args.onCancel?.();
  }

  @action
  submitWorkLog(event) {
    event.preventDefault();
    this.args.onSave?.perform({
      duration: this.duration,
      task: this.task,
    });
  }
}
