import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { startOfYear } from 'date-fns';
import { formatDate } from 'frontend-timekeeper/utils/format-date';

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

    return { user, counters, year: this.year };
  }
}
