import { tracked } from '@glimmer/tracking';

/**
 * Wrapper around Task to support input of working hours.
 *
 * The workLog property is an (optional) reference to an existing workLog record.
 * Its task and duration properties are not kept in sync with the task/duration of this object.
 */
export default class WorkLogEntry {
  @tracked type; // one of 'pinned', 'recent', 'added'
  @tracked task;
  @tracked workLog;
  @tracked duration;

  constructor(type, task, workLog) {
    this.type = type;
    this.task = task;
    this.workLog = workLog;
    this.duration = workLog?.duration || { hours: 0, minutes: 0 }
  }

  get hasDuration() {
    return this.duration.hours > 0 || this.duration.minutes > 0;
  }

  get priority() {
    return this.type == 'pinned' ? 1 : this.type == 'recent' ? 2 : 3;
  }
}
