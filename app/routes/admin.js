import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AdminRoute extends Route {
  @service userProfile;
  @service router;

  beforeModel() {
    if (!this.userProfile.isAdmin) {
      // Change this to route to a route for "unauthorized".
      this.router.transitionTo('index');
    }
  }
}
