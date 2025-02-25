import Component from '@glimmer/component';
import { service } from '@ember/service';
import { normalizeDuration } from '../utils/normalize-duration';

export default class StatsComponent extends Component {
  @service store;

  getProjectNameById = (id) => this.store.peekRecord('task', id).name;
  getSubProjectNameById = (id) => this.store.peekRecord('task', id).name;

  shouldHide = (taskMap) => {
    const keys = Object.keys(taskMap);
    return (
      keys.length === 1 && this.getSubProjectNameById(keys[0]) === 'General'
    );
  };

  get totalDuration() {
    if (!this.args.workLogs) {
      return 0;
    }

    return normalizeDuration(
      this.args.workLogs.reduce(
        (acc, workLog) => ({
          hours: acc.hours + workLog.duration.hours,
          minutes: acc.minutes + workLog.duration.minutes,
        }),
        { hours: 0, minutes: 0 },
      ),
    );
  }

  get projectData() {
    return this.args.workLogs.reduce((acc, workLog) => {
      const task = workLog.belongsTo('task')?.value();
      if( task ) {
        const parent = task.belongsTo('parent')?.value() ?? task;
        const {
          duration: { hours, minutes },
        } = workLog;

        if (Object.hasOwn(acc, parent.id)) {
          acc[parent.id].totalDuration.hours += hours;
          acc[parent.id].totalDuration.minutes += minutes;
        } else {
          acc[parent.id] = {
            totalDuration: { hours, minutes },
            color: parent?.color,
            subProjects: {},
          };
        }

        acc[parent.id].totalDuration = normalizeDuration(
          acc[parent.id].totalDuration,
        );

        if (task) {
          if (Object.hasOwn(acc[parent.id].subProjects, task.id)) {
            acc[parent.id].subProjects[task.id].totalDuration.hours += hours;
            acc[parent.id].subProjects[task.id].totalDuration.minutes += minutes;
          } else {
            acc[parent.id].subProjects[task.id] = {
              totalDuration: { hours, minutes },
            };
          }

          acc[parent.id].subProjects[task.id].totalDuration = normalizeDuration(
            acc[parent.id].subProjects[task.id].totalDuration,
          );
	      }
      }

      return acc;
    }, {});
  }
}
