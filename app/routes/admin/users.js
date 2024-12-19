import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AdminUsersRoute extends Route {
  @service store;

  queryParams = {
    page: { refreshModel: true },
    size: { refreshModel: true },
  };

  model(params) {
    return this.store.query('person', {
      page: {
        size: params.size,
        number: params.page,
      }
    });
  }
}
