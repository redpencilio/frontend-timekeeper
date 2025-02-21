import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AdminTimesheetsYearIndexRoute extends Route {
  @service router;

  beforeModel() {
    const year = this.modelFor('admin.timesheets.year').year;
    this.router.transitionTo(
      'admin.timesheets.year.month',
      year,
      new Date().getMonth() + 1,
    );
  }
}
