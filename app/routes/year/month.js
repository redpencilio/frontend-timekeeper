import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { formatDate } from 'frontend-timekeeper/utils/format-date';

export default class YearMonthRoute extends Route {
  @service store;
  @service router;

  beforeModel(transition) {
    // Check if month is a valid number
    let { month } = this.paramsFor(this.routeName);
    month = Number(month);
    if (isNaN(month) || month < 1 || month > 12) {
      this.router.transitionTo('404');
    }
  }

  async model(params) {
    const { year } = this.modelFor('year');
    const monthNumber = Number(params.month) - 1;
    const firstOfMonth = new Date(Date.UTC(year, monthNumber));
    const lastOfMonth = new Date(Date.UTC(year, monthNumber + 1, 0));
    const tasks = await this.store.queryAll('task', {
      // 'filter[:has:parent]': 't',
      include: 'parent',
    });
    const workLogs = await this.store.queryAll('work-log', {
      'filter[:gte:date]': formatDate(firstOfMonth),
      'filter[:lte:date]': formatDate(lastOfMonth),
      include: 'task',
    });

    return {
      tasks,
      workLogs,
      year,
      monthNumber,
    };
  }
}
