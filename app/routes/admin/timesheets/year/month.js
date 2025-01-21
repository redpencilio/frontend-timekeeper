import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { startOfMonth, endOfMonth, addDays } from 'date-fns';
import { formatDate } from 'frontend-timekeeper/utils/format-date';

export default class AdminTimesheetsYearMonthRoute extends Route {
  @service store;
  @service router;

  beforeModel(transition) {
    // Check if month is a valid number
    this.humanMonth = Number(transition.to.params.month);
    if (isNaN(this.humanMonth) || this.humanMonth < 1 || this.humanMonth > 12) {
      this.router.transitionTo('not-found');
    }
  }

  async model() {
    const { people, tasks, year } = this.modelFor('admin.timesheets.year');
    const firstOfMonth = startOfMonth(new Date(year, this.humanMonth - 1));
    const firstOfNextMonth = addDays(endOfMonth(firstOfMonth), 1);
    const workLogs = await this.store.queryAll('work-log', {
      'filter[:gte:date]': formatDate(firstOfMonth),
      'filter[:lt:date]': formatDate(firstOfNextMonth),
      include: 'person,task,task.parent',
    });
    return {
      people,
      tasks,
      workLogs,
      year,
      month: this.humanMonth,
    };
  }
}
