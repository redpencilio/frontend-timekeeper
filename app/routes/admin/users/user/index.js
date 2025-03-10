import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AdminUsersUserHolidaysRoute extends Route {
  @service router;
  beforeModel() {
    this.router.transitionTo('admin.users.user.holidays');
  }
}
