import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AdminTimesheetsRoute extends Route {
  @service router;
  @service userProfile;

  beforeModel() {
    if (!this.userProfile.may('manage-timesheets')) {
      this.router.transitionTo('forbidden');
    }

    const { year } = this.paramsFor(this.routeName);
    this.year = Number(year);

    if (isNaN(this.year) || this.year < 0) {
      this.router.transitionTo('not-found');
    }
  }

  async model() {
    return {
      year: this.year,
    };
  }
}
