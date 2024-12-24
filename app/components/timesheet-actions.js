import Component from '@glimmer/component';
import { task } from 'ember-concurrency';

export default class TimesheetActionsComponent extends Component {
  get canSubmitHolidays() {
    return !this.args.timesheet
      || this.args.timesheet.isDraft;
  }

  get canSubmitTimesheet() {
    return !this.canSubmitHolidays
      && this.args.timesheet.isAbsenceSubmitted;
  }

  submitHolidays = task(async () => {
    await this.args.onSubmitHolidays();
  });

  submitTimesheet = task(async () => {
    await this.args.onSubmitTimesheet();
  });
}
