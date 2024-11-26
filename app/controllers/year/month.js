import Controller from '@ember/controller';
import { action } from '@ember/object';

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
      const project = task?.belongsTo('parent')?.value() ?? task;
      // TODO create helper/util to construct name
      const name = task.name == 'General' ? project?.name : `${task.name} (${project.name})`;
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

  get favoriteProjects() {
    return this.model.tasks.slice(0, 3);
  }

  get activeDate() {
    return new Date(this.model.year, this.model.monthNumber);
  }
}
