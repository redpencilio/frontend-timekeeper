import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AdminTimesheetsRoute extends Route {
  @service router;
  @service userProfile;
  @service store;

  beforeModel() {
    if (!this.userProfile.may('manage-timesheets')) {
      this.router.transitionTo('forbidden');
    }
  }

  async model() {
    return {
      users: await this.store.queryAll('person', { sort: 'name' }),
    };
  }
}
