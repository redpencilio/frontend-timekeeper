import Component from '@glimmer/component';
import { trackedFunction } from 'reactiveweb/function';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { startOfYear } from 'date-fns';
import { formatDate } from 'frontend-timekeeper/utils/format-date';
import { trackedReset } from 'tracked-toolbox';
import { task } from 'ember-concurrency';

export default class HolidaysCounterEditComponent extends Component {
  @service store;

  @tracked year = new Date().getFullYear();

  @trackedReset({
    memo: 'holidayCounters.value',
    update() {
      if (!this.holidayCounters.value) {
        return;
      }

      return this.holidayCounters.value.slice().map((counter) => ({
        counter,
        value: counter.value,
      }));
    },
  })
  holidayCounterEntries;

  holidayCounters = trackedFunction(this, async () => {
    const firstOfYear = startOfYear(new Date(this.year, 0));
    const firstOfNextYear = startOfYear(new Date(this.year + 1, 0));

    return await this.store.queryAll('quantity', {
      'filter[:gte:valid-from]': formatDate(firstOfYear),
      'filter[:lte:valid-till]': formatDate(firstOfNextYear),
      'filter[person][:id:]': this.args.user.id,
      include: 'quantity-kind',
    });
  });

  updateEntry = (holidayCounterEntry, value) => {
    holidayCounterEntry.value = value;
  };

  submit = task(async (event) => {
    event.preventDefault();
    await this.args.onSubmit?.(this.holidayCounterEntries);
  });
}
