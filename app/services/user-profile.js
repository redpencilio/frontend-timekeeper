import Service, { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task, waitForProperty } from 'ember-concurrency';
import { getPermissionsForGroups } from '../permissions';

export default class UserProfileService extends Service {
  @service session;
  @service store;

  @tracked user;
  @tracked userGroups;

  favoriteTasks = [];

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
      this.favoriteTasks = await this.loadFavoriteTasks();
    } else {
      this.user = null;
      this.userGroups = [];
      this.favoriteTasks = [];
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

  async loadFavoriteTasks() {
    const logs = await this.store.query('work-log', {
      sort: '-date',
      page: {
        size: 12,
      },
      'filter[person][:id:]': this.user?.id,
      include: 'task',
    });

    const counts = {};
    for( let log of logs ) {
      const taskId = (await log.task)?.id;
      if( taskId ) {
        counts[taskId] = (counts[taskId] || 0) + 1;
      }
    }

    const top3TaskIds = Object.entries(counts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 3)
      .map(([taskId]) => taskId);

    const top3Tasks = await Promise.all(
      top3TaskIds.map(async (taskId) => {
        return await this.store.findRecord('task', taskId);
      }),
    );

    return top3Tasks;
  }
}
