import Component from '@glimmer/component';
import { service } from '@ember/service';
import { trackedFunction } from 'reactiveweb/function';
import { use } from 'ember-resources';
import { keepLatest } from 'reactiveweb/keep-latest';

export default class AdminTaskVisibilityComponent extends Component {
  @service store;
  @service tasks;

  @use tasksForUserLatest = keepLatest({
    value: () => this.tasksForUser.value,
    when: () => this.tasksForUser.isLoading,
  });

  tasksForUser = trackedFunction(this, async () => {
    return await this.store.queryAll('task', {
      'filter[visible-to][:id:]': this.args.person.id,
    });
  });

  customerIsVisible = (customerWithTasks) => {
    return customerWithTasks.tasks.some(this.taskIsVisible);
  };

  taskIsVisible = (taskWithSubTasks) => {
    return taskWithSubTasks.subTasks.some(this.subTaskIsVisible);
  };

  subTaskIsVisible = (subTask) => {
    return !!this.tasksForUserLatest.find(
      (userVisibleSubTask) => userVisibleSubTask.id === subTask.id,
    );
  };

  doAndRefresh = async (cb) => {
    await cb();
    await this.tasksForUser.retry();
  };

  hideCustomer = async (customerWithTasks) => {
    await Promise.all(customerWithTasks.tasks.map(this.hideTask));
  };

  hideTask = async (taskWithSubTasks) => {
    await Promise.all(taskWithSubTasks.subTasks.map(this.hideSubTask));
  };

  hideSubTask = async (subTask) => {
    const visibleTasks = await this.args.person.tasks;
    visibleTasks.removeObject(subTask);
    await Promise.all([subTask.save(), this.args.person.save()]);
  };

  showCustomer = async (customerWithTasks) => {
    await Promise.all(customerWithTasks.tasks.map(this.showTask));
  };

  showTask = async (taskWithSubTasks) => {
    await Promise.all(taskWithSubTasks.subTasks.map(this.showSubTask));
  };

  showSubTask = async (subTask) => {
    const visibleTasks = await this.args.person.tasks;
    visibleTasks.addObject(subTask);
    await Promise.all([subTask.save(), this.args.person.save()]);
  };

  // TODO: Maybe we need to put this in the model file?
  isSingleGeneral = ({ subTasks }) =>
    subTasks.length === 1 && subTasks[0].name === 'General';
}
