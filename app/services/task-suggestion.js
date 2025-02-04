import Service, { service } from '@ember/service';
import { storageFor } from 'ember-local-storage';
import { tracked } from '@glimmer/tracking';

export default class TaskSuggestionService extends Service {
  @service store;

  @storageFor('pinned-tasks') pinnedTaskIds;

  @tracked pinnedTasks = [];
  @tracked mostUsedTasks = [];

  async loadTasks(user) {
    console.log('load tasks called');
    this.pinnedTasks = await this.loadPinnedTasks();
    this.mostUsedTasks = await this.loadMostUsedTasks(user);
  }

  reset() {
    this.pinnedTasks = [];
    this.mostUsedTasks = [];
  }

  loadPinnedTasks() {
    return Promise.all(
      this.pinnedTaskIds.map(taskId => this.store.findRecord('task', taskId))
    );
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
        .map(([taskId]) => this.store.findRecord('task', taskId))
    );

    return mostUsedTasks;
  }

  pinTask(task) {
    this.pinnedTasks = [task, ...this.pinnedTasks];
    this.pinnedTaskIds.insertAt(0, task.id);
  }

  unpinTask(task) {
    this.pinnedTasks = this.pinnedTasks.filter((pinnedTask) => pinnedTask.id != task.id);
    this.pinnedTaskIds.removeObject(task.id);
  }
}
