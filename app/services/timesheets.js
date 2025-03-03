import Service, { service } from '@ember/service';
import { startOfYear } from 'date-fns';
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
}
