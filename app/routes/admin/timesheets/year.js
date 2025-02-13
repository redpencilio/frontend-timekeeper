import Route from '@ember/routing/route';
import { service } from '@ember/service';
import CONSTANTS from 'frontend-timekeeper/constants';

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
    const [people, tasks] = await Promise.all([
      this.store.queryAll('person', {
        'filter[user-groups][:uri:]': CONSTANTS.USER_GROUPS.EMPLOYEE,
        sort: 'name',
      }),
      this.store.queryAll('task', {
        include: 'parent',
      }),
    ]);

    return {
      people,
      tasks,
      year: this.year,
    };
  }
}
