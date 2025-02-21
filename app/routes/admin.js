import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AdminRoute extends Route {
  @service store;

  async model() {
    return {
      users: await this.store.queryAll('person', { sort: 'name' }),
    };
  }
}
