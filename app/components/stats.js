import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class StatsComponent extends Component {
  colorMap = {
    Loket: 'bg-indigo-500',
    Kaleidos: 'bg-green-500',
    Nove: 'bg-yellow-500',
    GN: 'bg-red-500',
    'Out of Office': 'bg-slate-400',
  };

  get totalHours() {
    return this.args.hourLogs.reduce((acc, { hours }) => acc + hours, 0);
  }

  get projectData() {
    return this.args.hourLogs.reduce((acc, { hours, project, subproject }) => {
      if (Object.hasOwn(acc, project)) {
        acc[project].totalHours += hours;
      } else {
        acc[project] = {
          totalHours: hours,
          color: this.colorMap[project].toLowerCase(),
          subprojects: {},
        };
      }

      if (subproject) {
        if (Object.hasOwn(acc[project].subprojects, subproject)) {
          acc[project].subprojects[subproject].totalHours += hours;
        } else {
          acc[project].subprojects[subproject] = {
            totalHours: hours,
          };
        }
      }

      return acc;
    }, {});
  }
}
