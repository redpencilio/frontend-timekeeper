import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class YearIndexRoute extends Route {
  @service router;

  beforeModel() {
    const year = this.modelFor('year').year;
    this.router.transitionTo('year.month', year, 1);
  }
}
