import Model, { attr, hasMany, belongsTo } from '@ember-data/model';
import { TIMESHEET_STATUSES } from '../constants';

export default class TimesheetModel extends Model {
  @attr status;
  @attr('date') start;
  @attr('date') end;

  @hasMany('work-log', { async: true, inverse: 'timesheet' }) workLogs;

  get monthNumber() {
    return this.start.getMonth();
  }

  get isDraft() {
    return this.status === TIMESHEET_STATUSES.DRAFT;
  }
  get isAbsenceSubmitted() {
    return this.status === TIMESHEET_STATUSES.ABSENCE_SUBMITTED;
  }
  get isSubmitted() {
    return this.status === TIMESHEET_STATUSES.SUBMITTED;
  }
  get isExported() {
    return this.status === TIMESHEET_STATUSES.EXPORTED;
  }
}
