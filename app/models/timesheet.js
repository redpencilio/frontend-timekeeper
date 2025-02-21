import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import constants from '../constants';
const { TIMESHEET_STATUSES } = constants;

export default class TimesheetModel extends Model {
  @attr status;
  @attr('date') start;
  @attr('date') end;

  @belongsTo('person', { async: true, inverse: 'timesheets' }) person;
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

  get statusRank() {
    if (this.isDraft) {
      return 0;
    } else if (this.isAbsenceSubmitted) {
      return 1;
    } else if (this.isSubmitted) {
      return 2;
    } else if (this.isExported) {
      return 3;
    }
  }
}
