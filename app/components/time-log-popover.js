import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { TrackedArray } from 'tracked-built-ins';
import { compare } from '@ember/utils';
import WorkLogEntry from '../utils/work-log-entry';

export default class WorkLogPopoverComponent extends Component {
  @service store;
  @service taskSuggestion;

  @tracked workLogEntries = [];
  @tracked _focusTaskEntry = null;
  newTaskPowerSelectApi = null;

  constructor() {
    super(...arguments);
    this.initWorkLogEntries();
  }

  async initWorkLogEntries() {
    const pinnedWorkLogEntries = this.taskSuggestion.pinnedTasks
      .map((task) => new WorkLogEntry('pinned', task));
    const mostUsedWorkLogEntries = this.taskSuggestion.mostUsedTasks
      .filter((mostUsedTask) => !this.taskSuggestion.pinnedTasks.includes(mostUsedTask))
      .map((task) => new WorkLogEntry('recent', task));
    const workLogEntries = [...pinnedWorkLogEntries, ...mostUsedWorkLogEntries];

    for (const workLog of this.args.workLogs) {
      const task = await workLog.task;
      const workLogEntry = workLogEntries.find((entry) => entry.task.id == task.id);
      if (workLogEntry) {
        workLogEntry.workLog = workLog;
        workLogEntry.duration = workLog.duration;
      } else {
        workLogEntries.push(new WorkLogEntry('added', task, workLog));
      }
    }

    this.workLogEntries = new TrackedArray(workLogEntries);
  }

  // TODO update. Purpose?
  get focusTaskEntry() {
    return (
      this._focusTaskEntry ??
      this.args.selectedWorkLog?.task?.id ??
      this.workLogEntries[0]?.task?.id
    );
  }

  get sortedWorkLogEntries() {
    return this.workLogEntries.slice(0).sort((a, b) => compare(a.priority, b.priority));
  }

  get visibleTasks() {
    return this.workLogEntries.map((workLogEntry) => workLogEntry.task);
  }

  @action
  pinTask(workLogEntry) {
    if (workLogEntry.type != 'pinned') {
      workLogEntry.type = 'pinned';
      this.taskSuggestion.pinTask(workLogEntry.task);

      // TODO purpose?
      this._focusTaskEntry = workLogEntry.task.id;
    } else {
      // already pinned. Nothing must happen.
    }
  }

  @action
  unpinTask(workLogEntry) {
    if (workLogEntry.type == 'pinned') {
      const { task } = workLogEntry;
      workLogEntry.type = this.taskSuggestion.mostUsedTasks.includes(task) ? 'recent' : 'added';
      this.taskSuggestion.unpinTask(task);
    } else {
      // not pinned. Nothing must happen.
    }
  }

  @action
  addWorkLogEntry(task) {
    const workLogEntry = this.workLogEntries.find((workLogEntry) => workLogEntry.task == task);
    if (!workLogEntry) {
      this.workLogEntries.push(new WorkLogEntry('added', task));
    }
    // TODO purpose?
    this._focusTaskEntry = task.id;
  }

  @action
  updateDuration(workLogEntry, duration) {
    workLogEntry.duration = duration;
  }

  @action
  updateTask(workLogEntry, task) {
    workLogEntry.task = task;
    // TODO purpose?
    this._focusTaskEntry = task.id;
  }

  @action
  submitWorkLogs(event) {
    event.preventDefault();
    // Only pass workLogEntries that have either:
    // - an existing workLog record (existing workLog that needs to be updated)
    // - a duration that is > 0 (new workLog that need to be created)
    const changedWorkLogEntries = this.workLogEntries.filter(
      (workLogEntry) => workLogEntry.workLog || workLogEntry.hasDuration
    );
    this.args.onSave?.perform(changedWorkLogEntries);
  }

  @action
  handleKeydown(event) {
    if (event.key === '/') {
      event.preventDefault();
      this.newTaskPowerSelectApi?.actions.open();
    }
  }

  @action
  registerNewTaskPowerSelect(api) {
    this.newTaskPowerSelectApi = api;
  }
}
