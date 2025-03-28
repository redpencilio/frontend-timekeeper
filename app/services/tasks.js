import Service, { service } from '@ember/service';

export default class TasksService extends Service {
  @service store;

  tasks = null;

  async setup() {
    const tasks = await this.store.queryAll('task', {
      'filter[:has:parent]': true,
      sort: 'parent.customer.name,parent.name',
      include: 'parent,parent.customer',
    });

    this.tasks = await Promise.all(
      tasks.map(async (task) => {
        const parent = await task.parent;
        const customer = await parent.customer;
        return {
          task,
          parent,
          customer,
        };
      }),
    );
  }

  groupTasks(tasks) {
    const groupedCustomer = Object.entries(
      Object.groupBy(tasks.slice(), ({ customer }) => customer.id),
    ).map(([_, tasks]) => ({
      customer: tasks[0].customer,
      tasks,
    }));

    return groupedCustomer.map(({ customer, tasks }) => {
      const groupedParent = Object.entries(
        Object.groupBy(tasks, ({ parent }) => parent.id),
      ).map(([_, tasks]) => ({
        task: tasks[0].parent,
        subTasks: tasks,
      }));

      return {
        customer,
        tasks: groupedParent,
      };
    });
  }

  /**
   * Group all task to the following format
   * {
   *  customer: Customer,
   *  tasks: [
   *    { task: Task, subTasks: [Task]}
   *  ]
   * }
   */
  get groupedTasks() {
    if (!this.tasks) {
      return null;
    }

    return this.groupTasks(this.tasks);
  }
}
