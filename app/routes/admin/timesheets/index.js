import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AdminTimesheetsIndexRoute extends Route {
  @service router;

  beforeModel() {
    this.router.transitionTo('admin.timesheets.year', new Date().getFullYear());
  }
}
