import Component from '@glimmer/component';
import { service } from '@ember/service';
import { trackedFunction } from 'reactiveweb/function';
import { use } from 'ember-resources';
import { keepLatest } from 'reactiveweb/keep-latest';

export default class AdminTaskVisibilityComponent extends Component {
  @service store;
  @service('tasks') tasksService;

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
    const subTasks = customerWithTasks.tasks
      .map(({ subTasks }) => subTasks)
      .flat();
    await this.submitEditVisibleSubTasks(subTasks);
  };

  hideTask = async (taskWithSubTasks) => {
    await this.submitEditVisibleSubTasks(taskWithSubTasks.subTasks);
  };

  hideSubTask = async (subTask) => {
    await this.submitEditVisibleSubTasks([subTask]);
  };

  submitEditVisibleSubTasks = async (subTasks, operation = 'hide') => {
    const visibleTasks = await this.store.queryAll('task', {
      'filter[visible-to][:id:]': this.args.person.id,
    });
    this.args.person.tasks =
      operation === 'hide'
        ? visibleTasks
            .slice()
            .filter(
              (visibleTask) =>
                !subTasks.find((task) => task.id === visibleTask.id),
            )
        : visibleTasks.slice().concat(subTasks);
    await this.args.person.save();
  };

  showCustomer = async (customerWithTasks) => {
    const subTasks = customerWithTasks.tasks
      .map(({ subTasks }) => subTasks)
      .flat();
    await this.submitEditVisibleSubTasks(subTasks, 'show');
  };

  showTask = async (taskWithSubTasks) => {
    await this.submitEditVisibleSubTasks(taskWithSubTasks.subTasks, 'show');
  };

  showSubTask = async (subTask) => {
    await this.submitEditVisibleSubTasks([subTask], 'show');
  };

  showAllTasks = async () => {
    await this.submitEditVisibleSubTasks(
      this.tasksService.tasks.slice(),
      'show',
    );
  };

  hideAllTasks = async () => {
    await this.submitEditVisibleSubTasks(
      this.tasksService.tasks.slice(),
      'hide',
    );
  };

  // TODO: Maybe we need to put this in the model file?
  isSingleGeneral = ({ subTasks }) =>
    subTasks.length === 1 && subTasks[0].name === 'General';
}
