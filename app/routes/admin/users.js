import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AdminUsersRoute extends Route {
  @service store;
  @service router;
  @service userProfile;

  queryParams = {
    page: { refreshModel: true },
    size: { refreshModel: true },
  };

  beforeModel() {
    if (!this.userProfile.may('manage-users')) {
      this.router.transitionTo('forbidden');
    }
  }

  model(params) {
    return this.store.query('person', {
      page: {
        size: params.size,
        number: params.page,
      },
    });
  }
}
