import Component from '@glimmer/component';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';

export default class AdminTaskVisibilityComponent extends Component {
  @service store;
  @service('tasks') tasksService;

  get visibilityHierarchy() {
    return this.tasksService.taskHierarchy.map(({ customer, tasks }) => {
      const tasksWithVisibility = tasks.map(({ task, subTasks }) => {
        const subTasksWithVisibilty = subTasks.map((subTask) => {
          const isVisible = this.args.visibleTasks.includes(subTask);
          return { task: subTask, isVisible };
        });

        const isVisible = subTasksWithVisibilty.some((task) => task.isVisible);
        const showSubTasks =
          subTasksWithVisibilty.length > 1 ||
          subTasksWithVisibilty[0].task.name !== 'General';

        return {
          task,
          isVisible,
          showSubTasks,
          subTasks: subTasksWithVisibilty,
        };
      });

      const isVisible = tasksWithVisibility.some((task) => task.isVisible);
      return { customer, isVisible, tasks: tasksWithVisibility };
    });
  }

  toggleVisibility = task(async (hierarchyItem) => {
    const targetValue = !hierarchyItem.isVisible;
    let leafEntries;

    if (hierarchyItem.tasks) {
      leafEntries = hierarchyItem.tasks.map((task) => task.subTasks).flat();
    } else if (hierarchyItem.subTasks) {
      leafEntries = hierarchyItem.subTasks;
    } else {
      leafEntries = [hierarchyItem];
    }

    const leafTasks = leafEntries.map((entry) => entry.task);
    this.args.onChange(leafTasks, targetValue);
  });

  showAllTasks = async () => {
    await this.args.onChange(this.tasksService.leafTasks.slice(0), true);
  };

  hideAllTasks = async () => {
    await this.args.onChange(this.tasksService.leafTasks.slice(0), false);
  };
}
