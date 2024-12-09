import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { startOfYear } from 'date-fns';
import { formatDate } from 'frontend-timekeeper/utils/format-date';

export default class YearRoute extends Route {
  @service router;
  @service session;
  @service store;

  beforeModel(transition) {
    let { year } = this.paramsFor(this.routeName);
    year = Number(year);

    if (isNaN(year) || year < 0) {
      this.router.transitionTo('404');
    }

    this.session.requireAuthentication(transition, 'login');
  }

  async model(params) {
    const year = Number(params.year);
    const firstOfYear = startOfYear(new Date(year, 0));
    const firstOfNextYear = startOfYear(new Date(year + 1, 0));
    const timesheets = await this.store.query('timesheet', {
      'filter[:gte:start]': formatDate(firstOfYear),
      'filter[:lt:start]': formatDate(firstOfNextYear),
    });
    return {
      year: Number(params.year),
      timesheets,
    };
  }
}
