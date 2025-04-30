import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class AdminUsersUserVisibleTasks extends Controller {
  @service router;

  @action
  async updateTasks(tasks, isVisible) {
    const currentVisibleTasks = this.model.visibleTasks.slice(0);
    let newVisibleTasks = [];

    if (isVisible) {
      newVisibleTasks = [...new Set([...currentVisibleTasks, ...tasks])];
    } else {
      newVisibleTasks = currentVisibleTasks.filter(
        (task) => !tasks.includes(task),
      );
    }

    this.model.user.tasks = newVisibleTasks;
    await this.model.user.save();
    this.router.refresh('admin.users.user.visible-tasks');
  }
}
