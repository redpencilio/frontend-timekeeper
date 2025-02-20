import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { startOfMonth, endOfMonth } from 'date-fns';
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
    const { year } = this.modelFor('admin.timesheets.year');

    const timesheets = await this.store.queryAll('timesheet', {
      'filter[start]': formatDate(
        startOfMonth(Date.UTC(year, this.humanMonth - 1)),
      ),
      'filter[end]': formatDate(
        endOfMonth(Date.UTC(year, this.humanMonth - 1)),
      ),
      include: 'person',
    });

    return {
      year,
      month: this.humanMonth,
      timesheets,
    };
  }
}
