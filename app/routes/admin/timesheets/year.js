import Route from '@ember/routing/route';
import { service } from '@ember/service';
import CONSTANTS from 'frontend-timekeeper/constants';
import { startOfYear, startOfMonth, endOfMonth } from 'date-fns';
import { formatDate } from 'frontend-timekeeper/utils/format-date';

export default class AdminTimesheetsYearRoute extends Route {
  @service store;
  @service router;

  beforeModel() {
    const { year } = this.paramsFor(this.routeName);
    this.year = Number(year);

    if (isNaN(this.year) || this.year < 0) {
      this.router.transitionTo('not-found');
    }
  }

  async model() {
    const firstOfYear = startOfYear(new Date(this.year, 0));
    const firstOfNextYear = startOfYear(new Date(this.year + 1, 0));
    const [workLogs, people, tasks] = await Promise.all([
      this.store.queryAll('work-log', {
        'filter[:gte:date]': formatDate(firstOfYear),
        'filter[:lt:date]': formatDate(firstOfNextYear),
        include: 'person,task,task.parent',
      }),
      this.store.queryAll('person', {
        'filter[user-groups][:uri:]': CONSTANTS.USER_GROUPS.EMPLOYEE,
        sort: 'name',
      }),
      this.store.queryAll('task', {
        include: 'parent',
      }),
    ]);

    return {
      workLogs,
      people,
      tasks,
      year: this.year,
    };
  }
}
