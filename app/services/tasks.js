import Service, { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class TasksService extends Service {
  @service store;

  @tracked leafTasks;

  /**
   * Hierarchy of customer > project > tasks
   *
   * {
   *  customer: Customer,
   *  tasks: [
   *    { task: Task, subTasks: [Task]}
   *  ]
   * }
   */
  @tracked taskHierarchy;

  async setup() {
    this.leafTasks = await this.store.queryAll('task', {
      'filter[:has:parent]': true,
      sort: 'parent.customer.name,parent.name',
      include: 'parent,parent.customer',
    });

    const flattenedLeafTasks = await Promise.all(
      this.leafTasks.map(async (task) => {
        const parent = await task.parent;
        const customer = await parent.customer;
        return { task, parent, customer };
      }),
    );

    this.taskHierarchy = this.groupTasksByCustomerAndParent(flattenedLeafTasks);
  }

  reset() {
    this.taskHierarchy = [];
  }

  groupTasksByCustomerAndParent(tasksWithContext) {
    const customers = new Set(tasksWithContext.map((task) => task.customer));
    const groups = [...customers].map((customer) => {
      const tasks = tasksWithContext.filter(
        (task) => task.customer == customer,
      );
      const parents = new Set(tasks.map((task) => task.parent));
      const taskHierarchies = [...parents].map((parent) => {
        const subTasks = tasks
          .filter((taskWithContext) => taskWithContext.parent == parent)
          .map((taskWithContext) => taskWithContext.task);
        return { task: parent, subTasks };
      });

      return { customer, tasks: taskHierarchies };
    });

    return groups;
  }
}
