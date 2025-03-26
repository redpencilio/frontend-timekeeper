import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AdminUsersUserRoute extends Route {
  @service store;

  model(params) {
    return this.store.findRecord('person', params.user_id);
  }
}
