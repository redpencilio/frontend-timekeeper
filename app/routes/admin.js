import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AdminRoute extends Route {
  @service session;
  @service userProfile;

  async beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
    await this.userProfile.waitForUser.perform();
  }
}
