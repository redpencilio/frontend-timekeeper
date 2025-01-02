import Route from '@ember/routing/route';
import { service } from '@ember/service';
import CONSTANTS from 'frontend-timekeeper/constants';

export default class AdminTimesheetsYearMonthRoute extends Route {
  @service store;
  @service router;
  @service userProfile;

  beforeModel(transition) {
    if (!this.userProfile.may('manage-users')) {
      this.router.transitionTo('forbidden');
    }
    // Check if month is a valid number
    this.humanMonth = Number(transition.to.params.month);
    if (isNaN(this.humanMonth) || this.humanMonth < 1 || this.humanMonth > 12) {
      this.router.transitionTo('not-found');
    }
  }

  model() {
    const { people, tasks, workLogs } = this.modelFor('admin.timesheets.year');
    return {
      people,
      tasks,
      workLogs: workLogs.filter(
        (workLog) => workLog.date.getMonth() === this.humanMonth - 1,
      ),
    };
  }
}
