import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class YearMonthRoute extends Route {
  @service store;

  async model(params) {
    const projects = await this.store.findAll('project', { include: 'parent' });
    const timeLogs = await this.store.findAll('time-log', {
      include: 'project',
    });
    return {
      projects,
      timeLogs,
    };
  }
}
