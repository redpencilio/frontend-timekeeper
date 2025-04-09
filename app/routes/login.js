import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class LoginRoute extends Route {
  @service session;
  @service router;

  async beforeModel() {
    if (this.session.isAuthenticated) {
      this.router.transitionTo('index');
    }
  }
}
