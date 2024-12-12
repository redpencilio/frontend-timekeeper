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
      this.user = await this.account.person;
      this.favoriteTasks = await this.loadFavoriteTasks();
    } else {
      this.user = null;
    }
  }

  async loadFavoriteTasks() {
    // TODO filter work-logs by user
    const logs = await this.store.query('work-log', {
      sort: '-date',
      page: {
        size: 100,
      },
      'filter[person][:id:]': this.user?.id,
      include: 'task',
    });

    const counts = logs.reduce((acc, log) => {
      const taskId = log.belongsTo('task')?.value()?.id;
      if (Object.hasOwn(acc, taskId)) {
        acc[taskId] += 1;
      } else {
        acc[taskId] = 0;
      }

      return acc;
    }, {});

    const top3TaskIds = Object.entries(counts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 3)
      .map(([taskId]) => taskId);

    const top3Tasks = await Promise.all(top3TaskIds.map(async (taskId) => {
      return await this.store.findRecord('task', taskId);
    }));

    return top3Tasks;
  }
}
