import Component from '@glimmer/component';
import { service } from '@ember/service';
import Duration from '../utils/duration';
import { trackedFunction } from 'reactiveweb/function';

export default class StatsComponent extends Component {
  @service store;
  @service('tasks') tasksService;

  workLogsWithContext = trackedFunction(this, async () => {
    return await Promise.all(
      this.args.workLogs.map(async (workLog) => {
        const subTask = await workLog.task;
        const task = await subTask.parent;
        const customer = await task.customer;
        return {
          workLog,
          task,
          subTask,
          customer,
        };
      }),
    );
  });

  get totalDuration() {
    if (!this.args.workLogs) {
      return 0;
    }

    return this.args.workLogs.reduce(
      (acc, workLog) => acc.add(workLog.duration),
      new Duration(),
    );
  }

  shouldHide = (taskGroup) =>
    taskGroup.subTasks.filter((subTask) => subTask.task.name === 'General')
      .length === 1;

  workedHoursForCustomer = (customer) => {
    return this.workedHoursFor((workLog) => workLog.customer.id, customer.id);
  };

  workedHoursForTask = (task) => {
    return this.workedHoursFor((workLog) => workLog.task.id, task.id);
  };

  workedHoursForSubTask = (subTask) => {
    return this.workedHoursFor((workLog) => workLog.subTask.id, subTask.id);
  };

  workedHoursFor = (cb, id) => {
    return this.workLogsWithContext.value
      .filter((workLog) => cb(workLog) === id)
      .map(({ workLog }) => workLog)
      .reduce((acc, log) => acc.add(log.duration), new Duration());
  };
}
