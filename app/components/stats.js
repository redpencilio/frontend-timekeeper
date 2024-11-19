import Component from '@glimmer/component';
import { service } from '@ember/service';
import { htmlSafe } from '@ember/template';

export default class StatsComponent extends Component {
  @service store;

  htmlSafe = htmlSafe;

  getProjectNameById = (id) => this.store.peekRecord('project', id).name;
  getSubProjectNameById = (id) => this.store.peekRecord('sub-project', id).name;

  get totalHours() {
    if (!this.args.workLogs) {
      return 0;
    }

    return this.args.workLogs.reduce((acc, workLog) => acc + workLog.duration.hours, 0);
  }

  get projectData() {
    return this.args.workLogs.reduce((acc, workLog) => {
      const subProject = workLog.belongsTo('subProject')?.value();
      const parent = subProject.belongsTo('parent')?.value();

      const hours = workLog.duration.hours ?? 0;
      const minutes = workLog.duration.minutes ?? 0;

      if (Object.hasOwn(acc, parent.id)) {
        acc[parent.id].totalHours += hours;
        acc[parent.id].totalMinutes += minutes;
      } else {
        acc[parent.id] = {
          totalHours: hours,
          totalMinutes: minutes,
          color: parent.color,
          subProjects: {},
        };
      }

      if (subProject) {
        if (Object.hasOwn(acc[parent.id].subProjects, subProject.id)) {
          acc[parent.id].subProjects[subProject.id].totalHours +=
            hours;
        } else {
          acc[parent.id].subProjects[subProject.id] = {
            totalHours: hours,
          };
        }
      }

      return acc;
    }, {});
  }
}
