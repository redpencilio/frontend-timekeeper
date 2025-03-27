import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AdminUsersUserHolidaysIndexRoute extends Route {
  @service router;

  beforeModel() {
    const currentYear = new Date().getFullYear();
    this.router.transitionTo('admin.users.user.holidays.year', currentYear);
  }
}
