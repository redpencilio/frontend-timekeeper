import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { startOfMonth, addMonths } from 'date-fns';
import { formatDate } from 'frontend-timekeeper/utils/format-date';

export default class YearMonthRoute extends Route {
  @service store;
  @service router;

  beforeModel(transition) {
    // Check if month is a valid number
    const month = Number(transition.to.params.month);
    if (isNaN(month) || month < 1 || month > 12) {
      this.router.transitionTo('404');
    }
  }

  async model(params) {
    const { year } = this.modelFor('year');
    const monthNumber = Number(params.month) - 1;
    const firstOfMonth = startOfMonth(Date.UTC(year, monthNumber));
    const firstOfNextMonth = addMonths(firstOfMonth, 1);
    const workLogs = await this.store.queryAll('work-log', {
      'filter[:gte:date]': formatDate(firstOfMonth),
      'filter[:lt:date]': formatDate(firstOfNextMonth),
      include: 'task',
    });

    const timesheet = this.modelFor('year').timesheets.find(
      (ts) => ts.monthNumber === monthNumber,
    );

    return {
      workLogs,
      year,
      month: params.month,
      monthNumber,
      timesheet,
    };
  }
}
