import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class YearMonthRoute extends Route {
  @service mockData;

  model(params) {
    const year = this.modelFor('year').year;
    const model = {
      year,
      month: params.month - 1,
      events: this.mockData.events.filter(({ start }) => {
        return new Date(start).getMonth() == params.month - 1;
      }),
      hourLogs: this.mockData.hourLogs.filter(({ date }) => {
        return new Date(date).getMonth() == params.month - 1;
      }),
    };

    return model;
  }
}
