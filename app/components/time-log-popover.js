import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { trackedReset } from 'tracked-toolbox';
import { uniqueBy } from '../utils/unique-by-key';
import { storageFor } from 'ember-local-storage';

export default class WorkLogPopoverComponent extends Component {
  @service store;
  @service userProfile;

  @storageFor('pinned-tasks') pinnedTasks;

  @tracked _focusTaskEntry = null;

  get focusTaskEntry() {
    return (
      this._focusTaskEntry ??
      this.args.selectedWorkLog?.task.id ??
      this.pinnedTaskEntries[0]?.task.id ??
      this.favoriteTaskWorkLogs[0]?.task.id
    );
  }

  initWorkLogEntry = (task) => {
    const workLog = this.args.workLogs.find(
      (workLog) => workLog.task.id === task.id,
    );
    return {
      task,
      duration: workLog?.duration ?? { hours: 0, minutes: 0 },
      workLog,
    };
  };

  @trackedReset({
    memo: 'pinnedTasks.length',
    update() {
      return this.pinnedTasks
        .map((taskId) => this.store.peekRecord('task', taskId))
        .filter((x) => x)
        .map(this.initWorkLogEntry);
    },
  })
  pinnedTaskEntries = [];

  @trackedReset({
    memo: 'args.workLogs',
    update() {
      return this.userProfile.favoriteTasks
        .filter((task) => !this.pinnedTasks.includes(task.id))
        .map(this.initWorkLogEntry);
    },
  })
  favoriteTaskWorkLogs = [];

  @trackedReset({
    memo: 'args.workLogs',
    update() {
      return [
        // Allow a single workLog per task
        ...uniqueBy(this.args.workLogs, (workLog) => workLog.task.id)
          // Exclude tasks that are in favorites
          .filter(
            (workLog) =>
              ![
                ...this.userProfile.favoriteTasks.map((task) => task.id),
                ...this.pinnedTasks.slice(),
              ].includes(workLog.task.id),
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

  get hasWorkLogEntries() {
    return (
      this.pinnedTaskEntries.length > 0 ||
      this.favoriteTaskWorkLogs.length > 0 ||
      this.addedWorkLogs.length > 0
    );
  }

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
  updateDuration(workLogEntry, duration) {
    workLogEntry.duration = duration;
  }

  @action
  updateTask(workLogEntry, task) {
    this._focusTaskEntry = task.id;
    // We need to do it like this so the component rerenders
    this.addedWorkLogs = this.addedWorkLogs.map((workLogIt) =>
      workLogIt === workLogEntry ? { ...workLogEntry, task } : workLogIt,
    );
  }

  @action
  addTaskToList(task) {
    // Only create a new entry if it isn't added yet
    if (
      [
        ...this.pinnedTaskEntries,
        ...this.addedWorkLogs,
        ...this.favoriteTaskWorkLogs,
      ].every((workLogEntry) => workLogEntry.task.id !== task.id)
    ) {
      const newEntry = {
        task,
        duration: { hours: 0, minutes: 0 },
      };
      this.addedWorkLogs = [...this.addedWorkLogs, newEntry];
    }
    this._focusTaskEntry = task.id;
  }

  @action
  submitWorkLogs(event) {
    event.preventDefault();
    const workLogTaskPairs = [
      ...this.pinnedTaskEntries,
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

  @action
  pinTask(workLogEntry) {
    const { task } = workLogEntry;
    // TODO: bug: the pinned task's duration gets set to 0
    this.pinnedTasks.insertAt(0, task.id);
    // Remove from addedWorkLogs
    this.addedWorkLogs = this.addedWorkLogs.filter(
      (workLogEntry) => workLogEntry.task.id !== task.id,
    );
    // Remove from favoriteTaskWorkLogs
    this.favoriteTaskWorkLogs = this.favoriteTaskWorkLogs.filter(
      (workLogEntry) => workLogEntry.task.id !== task.id,
    );
    this._focusTaskEntry = task.id;
  }

  @action
  unpinTask(workLogEntry) {
    const { task } = workLogEntry;
    this.pinnedTasks.removeObject(task.id);

    if (
      this.userProfile.favoriteTasks.some((favTask) => favTask.id === task.id)
    ) {
      this.favoriteTaskWorkLogs = [...this.favoriteTaskWorkLogs, workLogEntry];
    } else {
      this.addedWorkLogs = [...this.addedWorkLogs, workLogEntry];
    }
  }
}
