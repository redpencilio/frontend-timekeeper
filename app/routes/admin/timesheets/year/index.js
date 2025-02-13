import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { startOfYear } from 'date-fns';
import { formatDate } from 'frontend-timekeeper/utils/format-date';

export default class AdminTimesheetsYearIndexRoute extends Route {
  @service store;
  @service router;

  async model() {
    const { people, tasks, year } = this.modelFor('admin.timesheets.year');
    const firstOfYear = startOfYear(new Date(year, 0));
    const firstOfNextYear = startOfYear(new Date(year + 1, 0));

    const workLogs = await this.store.queryAll('work-log', {
      'filter[:gte:date]': formatDate(firstOfYear),
      'filter[:lt:date]': formatDate(firstOfNextYear),
      include: 'person,task,task.parent',
    });

    return {
      workLogs,
      people,
      tasks,
      year,
    };
  }
}
