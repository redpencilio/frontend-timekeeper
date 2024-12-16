import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { trackedReset } from 'tracked-toolbox';
import { v4 as uuidv4 } from 'uuid';
import { task } from 'ember-concurrency';

export default class WorkLogPopoverComponent extends Component {
  @service store;
  @service userProfile;

  @tracked focusHoursInput = null;

  @trackedReset({
    memo: 'args.workLogs',
    update() {
      return this.userProfile.favoriteTasks.map((task) => {
        const workLog = this.args.workLogs.find(
          (workLog) => workLog.task.id === task.id,
        );
        return {
          task,
          duration: workLog?.duration ?? { hours: 0, minutes: 0 },
          workLog,
        };
      });
    },
  })
  favoriteTaskWorkLogs = [];

  @trackedReset({
    memo: 'args.workLogs',
    update() {
      return [
        ...this.args.workLogs
          .filter(
            (workLog) =>
              !this.userProfile.favoriteTasks
                .map((task) => task.id)
                .includes(workLog.task.id),
          )
          .map((workLog) => ({
            duration: workLog.duration,
            task: workLog.task,
            workLog,
          })),
      ];
    },
  })
  addedWorkLogs = [];

  newProjectPowerSelectApi = null;

  get excludeTasks() {
    return [
      ...this.userProfile.favoriteTasks,
      ...this.addedWorkLogs.map((log) => log.task),
    ];
  }

  @action
  closePopover() {
    this.args.onCancel?.();
  }

  @action
  updateDuration(workLog, duration) {
    workLog.duration = duration;
  }

  @action
  updateTask(workLog) {
    workLog.task = task;
    this.focusHoursInput = this.addedWorkLogs.indexOf(workLog);
  }

  @action
  addTaskToList(task) {
    const newEntry = {
      task,
      duration: { hours: 0, minutes: 0 },
      elementId: uuidv4(),
    };
    this.addedWorkLogs = [...this.addedWorkLogs, newEntry];
    this.focusHoursInput = this.addedWorkLogs.length - 1;
  }

  @action
  submitWorkLogs(event) {
    event.preventDefault();
    const workLogTaskPairs = [
      ...this.favoriteTaskWorkLogs,
      ...this.addedWorkLogs,
    ].filter(
      ({ duration: { hours, minutes }, workLog }) =>
        workLog || hours > 0 || minutes > 0,
    );
    this.args.onSave?.perform(workLogTaskPairs);
  }

  @action
  handleKeydown(event) {
    if (event.key === '/') {
      event.preventDefault();
      this.newProjectPowerSelectApi?.actions.open();
    }
  }

  @action
  registerNewProjectPowerSelect(api) {
    this.newProjectPowerSelectApi = api;
  }
}
