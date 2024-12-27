import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import constants from 'frontend-timekeeper/constants';
const { TIMESHEET_STATUSES } = constants;

export default class TimesheetActionsComponent extends Component {
  @tracked absenceComplete = false;
  @tracked timesheetComplete = false;

  @action
  onAbsenceClick(checked) {
    if (!checked) {
      this.timesheetComplete = false;
      this.args.onStatusChanged(TIMESHEET_STATUSES.DRAFT);
    } else {
      this.args.onStatusChanged(TIMESHEET_STATUSES.ABSENCE_SUBMITTED);
    }
    this.absenceComplete = checked;
  }

  @action
  onTimesheetClick(checked) {
    if (checked) {
      this.absenceComplete = true;
      this.args.onStatusChanged(TIMESHEET_STATUSES.SUBMITTED);
    } else {
      this.args.onStatusChanged(TIMESHEET_STATUSES.ABSENCE_SUBMITTED);
    }
    this.timesheetComplete = checked;
  }
}
