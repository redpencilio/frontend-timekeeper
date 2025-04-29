import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AdminUsersUserVisibleTasksRoute extends Route {
  @service store;

  async model() {
    const user = this.modelFor('admin.users.user');

    const visibleTasks = await this.store.queryAll('task', {
      'filter[visible-to][:id:]': user.id,
    });

    return { user, visibleTasks };
  }
}
