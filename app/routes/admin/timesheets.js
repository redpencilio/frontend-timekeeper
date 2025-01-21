import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AdminTimesheetsRoute extends Route {
  @service router;
  @service userProfile;

  beforeModel() {
    if (!this.userProfile.may('view-employee-timesheets')) {
      this.router.transitionTo('forbidden');
    }
  }

  model() {}
}
