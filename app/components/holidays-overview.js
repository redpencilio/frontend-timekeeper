import Component from '@glimmer/component';
import Duration from '../utils/duration';
import { trackedRef } from 'ember-ref-bucket';
import { offset } from '@floating-ui/dom';
import { trackedFunction } from 'reactiveweb/function';
import { keepLatest } from 'reactiveweb/keep-latest';
import { service } from '@ember/service';
import { startOfYear } from 'date-fns';
import { formatDate } from 'frontend-timekeeper/utils/format-date';
import { use } from 'ember-resources';

export default class HolidaysOverviewComponent extends Component {
  @trackedRef('holiday-counter') holidayCounterNode = null;
  @service store;
  @service userProfile;

  floatingUIMiddleware = [offset(10)];

  holidaysUsed = trackedFunction(this, async () => {
    const firstOfYear = startOfYear(new Date(this.args.year, 0));
    const firstOfNextYear = startOfYear(new Date(this.args.year + 1, 0));

    const workLogs = await this.store.queryAll('work-log', {
      'filter[:gte:date]': formatDate(firstOfYear),
      'filter[:lt:date]': formatDate(firstOfNextYear),
      'filter[person][:id:]': this.userProfile.user.id,
      'filter[task][:id:]': '70d068d0-ea04-11ef-9b73-3390ae8e10f4',
    });

    return workLogs
      .slice()
      .reduce((acc, workLog) => acc.add(workLog.duration), new Duration());
  });

  @use holidaysUsedLatest = keepLatest({
    value: () => this.holidaysUsed.value,
    when: () => this.holidaysUsed.isLoading,
  })

  get sortedCounters() {
    return (this.args.holidayCounters ?? [])
      .slice()
      .sort((counterA, counterB) => counterB.value.cmp(counterA.value));
  }
  get holidaysTotal() {
    return (this.args.holidayCounters ?? [])
      .reduce((acc, { value }) => acc.add(value), new Duration())
      .normalized();
  }

  get remainingHolidays() {
    const holidaysUsed = this.holidaysUsedLatest;
    return this.holidaysTotal.subtract(holidaysUsed);
  }
}
