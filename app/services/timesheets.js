import Service, { service } from '@ember/service';
import { startOfMonth, startOfYear, endOfMonth } from 'date-fns';
import { monthsInYear } from 'date-fns/constants';
import { formatDate } from 'frontend-timekeeper/utils/format-date';
import constants from 'frontend-timekeeper/constants';
const { TIMESHEET_STATUSES } = constants;

export default class TimesheetsService extends Service {
  @service userProfile;
  @service store;

  async getForYear(year) {
    const firstOfYear = startOfYear(new Date(year, 0));
    const firstOfNextYear = startOfYear(new Date(year + 1, 0));
    const timesheets = await this.store.queryAll('timesheet', {
      sort: 'start',
      'filter[:gte:start]': formatDate(firstOfYear),
      'filter[:lt:start]': formatDate(firstOfNextYear),
      'filter[person][:id:]': this.userProfile.user.id,
    });

    // Create draft records for missing timesheets
    const draftTimesheets = [];
    for (let i = 0; i < monthsInYear; i++) {
      const timesheet = this.store
        .peekAll('timesheet')
        .find(
          (timesheet) =>
            timesheet.start.getMonth() === i &&
            timesheet.start.getFullYear() === year,
        );
      if (!timesheet) {
        const draftTimesheet = this.store.createRecord('timesheet', {
          status: TIMESHEET_STATUSES.DRAFT,
          start: startOfMonth(Date.UTC(year, i)),
          end: endOfMonth(Date.UTC(year, i)),
          person: this.userProfile.user,
        });
        draftTimesheets.push(draftTimesheet);
      }
    }

    return [...timesheets.toArray(), ...draftTimesheets];
  }
}
