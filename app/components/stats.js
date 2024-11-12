import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { htmlSafe } from '@ember/template';

export default class StatsComponent extends Component {
  @service store;

  htmlSafe = htmlSafe;

  getProjectNameById = (id) => this.store.peekRecord('project', id).name;

  get totalHours() {
    if (!this.args.timeLogs) {
      return 0;
    }

    return this.args.timeLogs.reduce((acc, { hours }) => acc + hours, 0);
  }

  get projectData() {
    return this.args.timeLogs.reduce((acc, timeLog) => {
      // We assume only one level in the project hierarchy
      const timeLogProject = timeLog.belongsTo('project')?.value();
      const parent = timeLogProject.belongsTo('parent')?.value();

      const project = parent ?? timeLogProject;
      const subproject = parent ? timeLogProject : null;

      if (Object.hasOwn(acc, project.id)) {
        acc[project.id].totalHours += timeLog.hours;
      } else {
        acc[project.id] = {
          totalHours: timeLog.hours,
          color: project.color,
          subprojects: {},
        };
      }

      if (subproject) {
        if (Object.hasOwn(acc[project.id].subprojects, subproject.id)) {
          acc[project.id].subprojects[subproject.id].totalHours +=
            timeLog.hours;
        } else {
          acc[project.id].subprojects[subproject.id] = {
            totalHours: timeLog.hours,
          };
        }
      }

      return acc;
    }, {});
  }
}
