import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { startOfYear, startOfMonth, endOfMonth } from 'date-fns';
import { monthsInYear } from 'date-fns/constants';
import { formatDate } from 'frontend-timekeeper/utils/format-date';
import constants from 'frontend-timekeeper/constants';
const { TIMESHEET_STATUSES } = constants;

export default class YearRoute extends Route {
  @service router;
  @service session;
  @service store;
  @service userProfile;

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
    const firstOfYear = startOfYear(new Date(this.year, 0));
    const firstOfNextYear = startOfYear(new Date(this.year + 1, 0));

    const [timesheets, holidayCounters] = await Promise.all([
      this.store.queryAll('timesheet', {
        sort: 'start',
        'filter[:gte:start]': formatDate(firstOfYear),
        'filter[:lt:start]': formatDate(firstOfNextYear),
        'filter[person][:id:]': this.userProfile.user.id,
      }),
      this.store.queryAll('holiday-counter', {
        'filter[:gte:valid-from]': formatDate(firstOfYear),
        'filter[:lte:valid-till]': formatDate(firstOfNextYear),
        'filter[person][:id:]': this.userProfile.user.id,
        include: 'holiday-type',
      }),
    ]);

    // Create draft records for missing timesheets
    const draftTimesheets = [];
    for (let i = 0; i < monthsInYear; i++) {
      const timesheetForMonth = timesheets.find(
        (timesheet) => timesheet.start.getMonth() === i,
      );
      if (!timesheetForMonth) {
        const timesheet = this.store.createRecord('timesheet', {
          status: TIMESHEET_STATUSES.DRAFT,
          start: startOfMonth(Date.UTC(this.year, i)),
          end: endOfMonth(Date.UTC(this.year, i)),
          person: this.userProfile.user,
        });
        draftTimesheets.push(timesheet);
      }
    }

    return {
      year: this.year,
      timesheets: [...timesheets.toArray(), ...draftTimesheets],
      holidayCounters,
    };
  }
}
