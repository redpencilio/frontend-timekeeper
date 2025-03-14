import Route from '@ember/routing/route';

export default class AdminUsersUserHolidaysRoute extends Route {
  model() {
    return { user: this.modelFor('admin.users.user') };
  }
}
