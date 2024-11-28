import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class YearRoute extends Route {
  @service router;

  model(params) {
    return {
      year: Number(params.year),
    };
  }

  afterModel({ year }) {
    if (isNaN(year) || year < 0) {
      this.router.transitionTo('404');
    }
  }
}
