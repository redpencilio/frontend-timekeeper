import Route from '@ember/routing/route';

export default class AdminUsersUserVisibleTasksRoute extends Route {
  async model() {
    const { user } = this.modelFor('admin.users.user');
    return { user };
  }
}
