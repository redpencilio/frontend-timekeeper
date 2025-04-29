import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { startOfYear } from 'date-fns';
import { formatDate } from 'frontend-timekeeper/utils/format-date';
import constants from 'frontend-timekeeper/constants';

const { HOLIDAY_TASK_LABEL } = constants;

export default class AdminUsersUserHolidaysYearRoute extends Route {
  @service router;
  @service store;

  beforeModel() {
    const { year } = this.paramsFor(this.routeName);
    this.year = Number(year);

    if (isNaN(this.year) || this.year < 0) {
      this.router.transitionTo('not-found');
    }
  }

  async model() {
    const user = this.modelFor('admin.users.user');
    const firstOfYear = startOfYear(new Date(this.year, 0));
    const firstOfNextYear = startOfYear(new Date(this.year + 1, 0));

    const counters = await this.store.queryAll('quantity', {
      'filter[:gte:valid-from]': formatDate(firstOfYear),
      'filter[:lte:valid-till]': formatDate(firstOfNextYear),
      'filter[person][:id:]': user.id,
      include: 'quantity-kind',
      sort: 'quantity-kind.label',
    });

    const workLogs = await this.store.queryAll('work-log', {
      'filter[:gte:date]': formatDate(firstOfYear),
      'filter[:lt:date]': formatDate(firstOfNextYear),
      'filter[person][:id:]': user.id,
      'filter[task][:exact:name]': HOLIDAY_TASK_LABEL,
    });

    return { year: this.year, user, counters, workLogs };
  }
}
