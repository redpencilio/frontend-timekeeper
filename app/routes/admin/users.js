import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AdminUsersRoute extends Route {
  @service store;
  @service router;
  @service userProfile;

  beforeModel() {
    if (!this.userProfile.may('manage-users')) {
      this.router.transitionTo('forbidden');
    }
  }

  model() {
    return this.store.queryAll('person', {
      sort: 'name',
    });
  }
}
