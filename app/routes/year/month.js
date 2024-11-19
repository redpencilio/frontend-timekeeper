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
    month--;

    if (isNaN(month) || month < 1 || month > 12) {
      this.router.transitionTo('404');
    }
  }

  async model(params) {
    const { year } = this.modelFor('year');
    const monthNumber = Number(params.month) - 1;
    const firstOfMonth = new Date(year, monthNumber);
    const lastOfMonth = new Date(year, monthNumber + 1, 0);
    // const projects = await this.store.findAll('project', {
    //   include: 'sub-projects',
    // });
    const projects = await this.store.findAll('project');
    // const workLogs = await this.store.queryAll('work-log', {
    //   'filter[:gte:]': formatDate(firstOfMonth),
    //   'filter[:lte:]': formatDate(lastOfMonth),
    //   include: 'sub-project',
    // });
    return {
      // projects,
      // workLogs,
    };
  }
}
