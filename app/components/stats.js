import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class StatsComponent extends Component {
  @service store;

  getProjectNameById = (id) => this.store.peekRecord('task', id).name;
  getSubProjectNameById = (id) => this.store.peekRecord('task', id).name;

  get totalHours() {
    if (!this.args.workLogs) {
      return 0;
    }

    return this.args.workLogs.reduce(
      (acc, workLog) => acc + workLog.duration.hours,
      0,
    );
  }

  get projectData() {
    return this.args.workLogs.reduce((acc, workLog) => {
      const task = workLog.belongsTo('task')?.value();
      const parent = task.belongsTo('parent')?.value() ?? task;
      const {
        duration: { hours, minutes },
      } = workLog;

      if (Object.hasOwn(acc, parent.id)) {
        acc[parent.id].totalHours += hours;
        acc[parent.id].totalMinutes += minutes;
      } else {
        acc[parent.id] = {
          totalHours: hours,
          totalMinutes: minutes,
          color: parent?.color,
          subProjects: {},
        };
      }

      if (task) {
        if (Object.hasOwn(acc[parent.id].subProjects, task.id)) {
          acc[parent.id].subProjects[task.id].totalHours += hours;
        } else {
          acc[parent.id].subProjects[task.id] = {
            totalHours: hours,
          };
        }
      }

      return acc;
    }, {});
  }
}
