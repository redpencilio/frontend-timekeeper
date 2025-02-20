import Controller from '@ember/controller';
import { service } from '@ember/service';
import Duration from 'frontend-timekeeper/utils/duration';

export default class AdminUsersUserHolidaysController extends Controller {
  @service router;


  editHolidayCounters = async (holidayCounterEntries) => {
    await Promise.all(
      holidayCounterEntries.map(async (entry) => {
        if (!entry.value.eq(entry.counter.value)) {
          entry.counter.value = entry.value;
          await entry.counter.save();
        }
      }),
    );

    this.router.transitionTo('admin.users');
  };

  cancel = () => {
    this.router.transitionTo('admin.users');
  };
}
