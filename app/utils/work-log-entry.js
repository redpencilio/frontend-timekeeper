import { tracked } from '@glimmer/tracking';

/**
 * Wrapper around Task to support input of working hours.
 *
 * The workLog property is an (optional) reference to an existing workLog record.
 * Its task and duration properties are not kept in sync with the task/duration of this object.
 */
export default class WorkLogEntry {
  ALLOWED_TYPES = ['pinned', 'recent', 'added'];
  @tracked type; // one of 'pinned', 'recent', 'added'
  @tracked task;
  @tracked duration;
  @tracked note;

  constructor(type, task, duration = null, note = null) {
    this._checkType(type);
    this.type = type;
    this.task = task;
    this.duration = duration;
    this.note = note;
  }

  get hasDuration() {
    return this.duration.hours > 0 || this.duration.minutes > 0;
  }

  get priority() {
    return this.type == 'pinned' ? 1 : this.type == 'recent' ? 2 : 3;
  }

  _checkType(type) {
    if (!this.ALLOWED_TYPES.includes(type)) {
      throw new Error(
        `Type must be one of: ${JSON.stringify(this.ALLOWED_TYPES)}`,
      );
    }
  }
}
