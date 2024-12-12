import Component from '@glimmer/component';
import { task } from 'ember-concurrency';

export default class TimesheetActionsComponent extends Component {
  submitHolidays = task(async () => {
    await this.args.onSubmitHolidays();
  });

  submitTimesheet = task(async () => {
    await this.args.onSubmitTimesheet();
  });
}
