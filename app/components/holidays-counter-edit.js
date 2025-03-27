import Component from '@glimmer/component';
import { service } from '@ember/service';
import { trackedReset } from 'tracked-toolbox';
import { task } from 'ember-concurrency';

export default class HolidaysCounterEditComponent extends Component {
  @service store;
  @service router;

  transitionToYear = (year) => {
    this.router.replaceWith('admin.users.user.holidays.year', year);
  };

  @trackedReset({
    memo: 'args.holidayCounters',
    update() {
      return this.args.holidayCounters.slice().map((counter) => ({
        counter,
        value: counter.value,
      }));
    },
  })
  holidayCounterEntries;

  updateEntry = (holidayCounterEntry, value) => {
    holidayCounterEntry.value = value;
  };

  submit = task(async (event) => {
    event.preventDefault();
    await this.args.onSubmit?.(this.holidayCounterEntries);
  });
}
