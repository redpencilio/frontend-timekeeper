import Controller from '@ember/controller';
import taskName from '../../helpers/task-name';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';
import { action } from '@ember/object';

export default class YearMonthContoller extends Controller {
  @service router;
  @service store;

  onSaveSimple = task(async ({ duration, task }, date) => {
    const workLog = this.store.createRecord('work-log', {
      duration,
      task,
      date,
    });
    await workLog.save();
    this.router.refresh();
  });

  onSaveMulti = task(async (hourTaskPairs, date) => {
    await Promise.all(
      hourTaskPairs.map(async ({ duration, task }) => {
        const workLog = this.store.createRecord('work-log', {
          duration,
          task,
          date,
        });
        await workLog.save();
      }),
    );
    this.router.refresh();
  });

  @action
  async deleteWorkLog(workLog) {
    await workLog.destroyRecord();
    this.router.refresh();
  }

  get events() {
    return this.model.workLogs.map((workLog) => {
      const {
        duration: { hours, minutes },
        date,
        id,
      } = workLog;
      // TODO: use trackedFunction of https://github.com/NullVoxPopuli/ember-resources
      // instead of fetching async data in a getter
      const task = workLog.belongsTo('task')?.value();
      const name = taskName(task);
      return {
        id,
        title: `${hours > 0 ? `${hours}h` : ''}${minutes > 0 ? `${minutes}m` : ''}: ${name}`,
        start: date,
        allDay: true,
        backgroundColor: task?.color,
        borderColor: task?.color,
        extendedProps: {
          workLog,
        },
      };
    });
  }

  get activeDate() {
    return new Date(this.model.year, this.model.monthNumber);
  }
}
