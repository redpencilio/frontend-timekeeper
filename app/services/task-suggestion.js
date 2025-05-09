import Service, { service } from '@ember/service';
import { storageFor } from 'ember-local-storage';
import { tracked } from '@glimmer/tracking';

export default class TaskSuggestionService extends Service {
  @service store;

  @storageFor('pinned-tasks') pinnedTaskIds;

  @tracked pinnedTasks = [];
  @tracked mostUsedTasks = [];

  async loadTasks(user) {
    this.pinnedTasks = await this.loadPinnedTasks();
    this.mostUsedTasks = await this.loadMostUsedTasks(user);
  }

  reset() {
    this.pinnedTasks = [];
    this.mostUsedTasks = [];
  }

  async loadPinnedTasks() {
    const pinnedTasks = await Promise.all(
      this.pinnedTaskIds.map(async (taskId) => {
        try {
          return await this.store.findRecord('task', taskId);
        } catch {
          // Ignore pinned task that fails to load
          return null;
        }
      }),
    );
    return pinnedTasks.filter((task) => task);
  }

  async loadMostUsedTasks(user) {
    const workLogs = await this.store.query('work-log', {
      sort: '-date',
      page: {
        size: 100,
      },
      'filter[person][:id:]': user?.id,
      include: 'task',
    });

    const counts = {};
    for (let workLog of workLogs) {
      const task = await workLog.task;
      if (task) {
        counts[task.id] = (counts[task.id] || 0) + 1;
      }
    }

    const mostUsedTasks = await Promise.all(
      Object.entries(counts)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, 3)
        .map(([taskId]) => this.store.findRecord('task', taskId)),
    );

    return mostUsedTasks;
  }

  pinTask(task) {
    this.pinnedTasks = [task, ...this.pinnedTasks];
    this.pinnedTaskIds.insertAt(0, task.id);
  }

  unpinTask(task) {
    this.pinnedTasks = this.pinnedTasks.filter(
      (pinnedTask) => pinnedTask.id != task.id,
    );
    this.pinnedTaskIds.removeObject(task.id);
  }
}
