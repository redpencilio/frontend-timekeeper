import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { startOfYear } from 'date-fns';
import { formatDate } from 'frontend-timekeeper/utils/format-date';

export default class YearRoute extends Route {
  @service router;
  @service session;
  @service store;
  @service userProfile;
  @service('timesheets') timesheetsService;

  async beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');

    const { year } = this.paramsFor(this.routeName);
    this.year = Number(year);

    if (isNaN(this.year) || this.year < 0) {
      this.router.transitionTo('not-found');
    }

    await this.userProfile.waitForUser.perform();
  }

  async model() {
    const timesheets = await this.timesheetsService.getForYear(this.year);

    const firstOfYear = startOfYear(new Date(this.year, 0));
    const firstOfNextYear = startOfYear(new Date(this.year + 1, 0));
    const holidayCounters = await this.store.queryAll('quantity', {
      'filter[:gte:valid-from]': formatDate(firstOfYear),
      'filter[:lte:valid-till]': formatDate(firstOfNextYear),
      'filter[person][:id:]': this.userProfile.user.id,
      include: 'quantity-kind',
    });

    return {
      year: this.year,
      timesheets,
      holidayCounters,
    };
  }
}
