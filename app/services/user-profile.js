import Service, { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task, waitForProperty } from 'ember-concurrency';
import { getPermissionsForGroups } from '../permissions';

export default class UserProfileService extends Service {
  @service session;
  @service store;
  @service taskSuggestion;
  @service('tasks') tasksService;

  @tracked user;
  @tracked userGroups;

  @tracked favoriteTasks = [];

  async load() {
    if (this.session.isAuthenticated) {
      const authenticatedData = this.session.data.authenticated;
      const sessionData = authenticatedData.data.relationships;
      const accountId = sessionData.account?.data.id;
      this.account = await this.store.findRecord('account', accountId, {
        include: 'person',
      });
      this.user = await this.account.person;
      this.userGroups = await this.user.userGroups;
      await Promise.all([
        this.taskSuggestion.loadTasks(this.user),
        this.tasksService.setup(),
      ]);
    } else {
      this.user = null;
      this.userGroups = [];
      this.taskSuggestion.reset();
      this.tasksService.reset();
    }
  }

  waitForUser = task(async () => {
    await waitForProperty(this, 'user');
  });

  get permissions() {
    return getPermissionsForGroups(this.userGroups);
  }

  may(permission) {
    return this.permissions.includes(permission);
  }
}
