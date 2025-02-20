import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AdminUsersUserRoute extends Route {
  @service store;

  async model(params) {
    const user = await this.store.findRecord('person', params.user);
    return {
      user,
    };
  }

}

