import Service, { service } from '@ember/service';
import { startOfYear } from 'date-fns';
import { startOfMonth, addMonths } from 'date-fns';
import { formatDate } from 'frontend-timekeeper/utils/format-date';

export default class TimesheetsService extends Service {
  @service userProfile;
  @service store;

  async getForYear(year) {
    const firstOfYear = startOfYear(new Date(year, 0));
    const firstOfNextYear = startOfYear(new Date(year + 1, 0));
    return await this.store.queryAll('timesheet', {
      sort: 'start',
      'filter[:gte:start]': formatDate(firstOfYear),
      'filter[:lt:start]': formatDate(firstOfNextYear),
      'filter[person][:id:]': this.userProfile.user.id,
    });
  }

  async getForMonth(year, month) {
    const firstOfMonth = startOfMonth(Date.UTC(year, month));
    const firstOfNextMonth = addMonths(firstOfMonth, 1);
    return await this.store.queryOne('timesheet', {
      'filter[:gte:start]': formatDate(firstOfMonth),
      'filter[:lt:start]': formatDate(firstOfNextMonth),
      'filter[person][:id:]': this.userProfile.user.id,
    });
  }
}