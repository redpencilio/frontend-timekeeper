import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { startOfMonth, addMonths } from 'date-fns';
import { formatDate } from 'frontend-timekeeper/utils/format-date';

export default class YearMonthRoute extends Route {
  @service store;
  @service router;

  beforeModel(transition) {
    // Check if month is a valid number
    this.humanMonth = Number(transition.to.params.month);
    if (isNaN(this.humanMonth) || this.humanMonth < 1 || this.humanMonth > 12) {
      this.router.transitionTo('404');
    }
  }

  async model() {
    const { year } = this.modelFor('year');
    const firstOfMonth = startOfMonth(Date.UTC(year, this.humanMonth - 1));
    const firstOfNextMonth = addMonths(firstOfMonth, 1);
    const workLogs = await this.store.queryAll('work-log', {
      'filter[:gte:date]': formatDate(firstOfMonth),
      'filter[:lt:date]': formatDate(firstOfNextMonth),
      include: 'task',
    });

    return {
      workLogs,
      year,
      month: this.humanMonth - 1,
    };
  }

  setupController(controller, model) {
    super.setupController(...arguments);
    const { timesheets } = this.modelFor('year');
    const timesheet = timesheets.find((timesheet) => timesheet.start.getMonth() === model.month);
    controller.timesheet = timesheet;
  }
}
