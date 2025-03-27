import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service session;
  @service router;
  @service userProfile;
  @service('tasks') tasksService;

  async beforeModel() {
    await Promise.all([this.session.setup(), this.tasksService.setup()]);

    if (this.session.isAuthenticated) {
      try {
        await this.userProfile.load();
      } catch (err) {
        await this.session.invalidate();
      }
    } else {
      this.router.transitionTo('login');
    }
  }
}
