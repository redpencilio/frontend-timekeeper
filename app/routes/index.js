import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class IndexRoute extends Route {
  @service router;

  beforeModel() {
    const now = new Date();
    this.router.transitionTo(
      'year.month',
      now.getFullYear(),
      now.getMonth() + 1,
    );
  }
}
