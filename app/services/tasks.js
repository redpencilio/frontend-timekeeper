import Service, { service } from '@ember/service';

export default class TasksService extends Service {
  @service store;

  tasks = null;

  async setup() {
    const [tasks, customers] = await Promise.all([
      this.store.queryAll('task', {
        'filter[:has:parent]': true,
        sort: 'parent.customer.name,parent.name',
        include: 'parent,parent.customer',
      }),
      await this.store.queryAll('customer'),
    ]);
    this.tasks = tasks;
    this.customerIdMap = Object.fromEntries(
      customers.slice().map((customer) => [customer.id, customer]),
    );
    this.parentTaskIdMap = Object.fromEntries(
      this.tasks.slice().map((task) => {
        const parent = task.belongsTo('parent')?.value();
        return [parent?.id, parent];
      }),
    );
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

    const groupedCustomer = Object.entries(
      Object.groupBy(this.tasks.slice(), (task) =>
        task.belongsTo('parent')?.value()?.belongsTo('customer')?.id(),
      ),
    ).map(([customerId, tasks]) => ({
      customer: this.customerIdMap[customerId],
      tasks,
    }));

    return groupedCustomer.map(({ customer, tasks }) => {
      const groupedParent = Object.entries(
        Object.groupBy(tasks, (task) => task.belongsTo('parent')?.id()),
      ).map(([parentId, tasks]) => ({
        task: this.parentTaskIdMap[parentId],
        subTasks: tasks,
      }));

      return {
        customer,
        tasks: groupedParent,
      };
    });
  }
}
