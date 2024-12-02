import Service, { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class UserProfileService extends Service {
  @service session;
  @service store;

  @tracked user;

  async load() {
    if (this.session.isAuthenticated) {
      const authenticatedData = this.session.data.authenticated;
      const sessionData = authenticatedData.data.relationships;
      const accountId = sessionData.account?.data.id;
      this.account = await this.store.findRecord('account', accountId, {
        include: 'person',
      });
      this.user = await this.account.user;
      this.favoriteTasks = await this.loadFavoriteTasks();
    } else {
      this.user = null;
    }
  }

  async loadFavoriteTasks() {
    return await this.store.query('task', {
      'filter[:has:parent]': 't',
      include: 'parent',
      page: {
        size: 3,
      },
    });
  }
}
