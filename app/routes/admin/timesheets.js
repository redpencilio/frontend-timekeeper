import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AdminTimesheetsRoute extends Route {
  @service router;
  @service userProfile;

  beforeModel() {
    if (!this.userProfile.may('manage-timesheets')) {
      this.router.transitionTo('forbidden');
    }
  }

  model() {}
}
