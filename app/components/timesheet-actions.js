import Component from '@glimmer/component';
import { action } from '@ember/object';
import constants from 'frontend-timekeeper/constants';
const { TIMESHEET_STATUSES } = constants;

export default class TimesheetActionsComponent extends Component {
  get absenceComplete() {
    return [
      TIMESHEET_STATUSES.ABSENCE_SUBMITTED,
      TIMESHEET_STATUSES.SUBMITTED,
      TIMESHEET_STATUSES.EXPORTED,
    ].includes(this.args.timesheet.status);
  }

  get timesheetComplete() {
    return [TIMESHEET_STATUSES.SUBMITTED, TIMESHEET_STATUSES.EXPORTED].includes(
      this.args.timesheet.status,
    );
  }

  @action
  clickAbsence(checked) {
    if (!checked) {
      this.args.onStatusChanged(TIMESHEET_STATUSES.DRAFT);
    } else {
      this.args.onStatusChanged(TIMESHEET_STATUSES.ABSENCE_SUBMITTED);
    }
  }

  @action
  clickTimesheet(checked) {
    if (checked) {
      this.args.onStatusChanged(TIMESHEET_STATUSES.SUBMITTED);
    } else {
      this.args.onStatusChanged(TIMESHEET_STATUSES.ABSENCE_SUBMITTED);
    }
  }
}
