import Route from '@ember/routing/route';

export default class YearRoute extends Route {
  model(params) {
    return {
      year: params.year,
    };
  }
}
