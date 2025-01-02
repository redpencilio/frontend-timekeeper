import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AdminTimesheetsRoute extends Route {
  @service router;
  @service userProfile;

  beforeModel(transition) {
    if (!this.userProfile.may('view-employee-timesheets')) {
      this.router.transitionTo('forbidden');
    } else if (transition.targetName === 'admin.timesheets.index') {
      this.router.transitionTo(
        'admin.timesheets.year',
        new Date().getFullYear(),
      );
    }
  }

  model() {}
}
