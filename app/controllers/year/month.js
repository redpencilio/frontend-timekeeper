import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

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
      const parent = task?.belongsTo('parent')?.value() ?? task;
      return {
        id,
        title: `${hours}h: ${task.name}`,
        start: date,
        allDay: true,
        backgroundColor: parent?.color,
        borderColor: parent?.color,
        extendedProps: {
          workLog,
        },
      };
    });
  }

  get favoriteProjects() {
    return this.model.tasks.slice(0, 3);
  }

  get activeDate() {
    return new Date(this.model.year, this.model.monthNumber);
  }
}
