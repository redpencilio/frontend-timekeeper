import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class YearRoute extends Route {
  @service router;

  beforeModel(transition) {
    let { year } = this.paramsFor(this.routeName);
    year = Number(year);

    if (isNaN(year) || year < 0) {
      this.router.transitionTo('404');
    }
  }

  model(params) {
    return {
      year: Number(params.year),
    };
  }
}
