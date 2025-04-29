import Component from '@glimmer/component';
import { service } from '@ember/service';
import { trackedReset } from 'tracked-toolbox';
import { TrackedObject } from 'tracked-built-ins';
import { task } from 'ember-concurrency';
import { sumDurations, sumDurationAttributes } from '../utils/duration';

export default class HolidaysCounterEditComponent extends Component {
  @service store;
  @service router;

  transitionToYear = (year) => {
    this.router.replaceWith('admin.users.user.holidays.year', year);
  };

  @trackedReset({
    memo: 'args.holidayCounters',
    update() {
      return this.args.holidayCounters.slice().map((counter) => {
        return new TrackedObject({
          counter,
          value: counter.value,
        });
      });
    },
  })
  holidayCounterEntries;

  get consumedHolidays() {
    return sumDurationAttributes(this.args.workLogs);
  }

  get remainingHolidays() {
    const counters = this.holidayCounterEntries.map((entry) => entry.value);
    return sumDurations(counters).subtract(this.consumedHolidays);
  }

  updateEntry = (holidayCounterEntry, value) => {
    holidayCounterEntry.value = value;
  };

  submit = task(async (event) => {
    event.preventDefault();
    await this.args.onSubmit?.(this.holidayCounterEntries);
  });
}
