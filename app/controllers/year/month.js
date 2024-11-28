import Controller from '@ember/controller';
import taskName from '../../helpers/task-name';

export default class YearMonthContoller extends Controller {
  get events() {
    return this.model.workLogs.map((workLog) => {
      const {
        duration: { hours },
        date,
        id,
      } = workLog;
      // TODO: use trackedFunction of https://github.com/NullVoxPopuli/ember-resources
      // instead of fetching async data in a getter
      const task = workLog.belongsTo('task')?.value();
      const name = taskName(task);
      return {
        id,
        title: `${hours}h: ${name}`,
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
