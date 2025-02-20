import Component from '@glimmer/component';
import { service } from '@ember/service';
import Duration from '../utils/duration';

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

    return this.args.workLogs.reduce(
      (acc, workLog) => acc.add(workLog.duration),
      new Duration(),
    );
  }

  get projectData() {
    return this.args.workLogs.reduce((acc, workLog) => {
      const task = workLog.belongsTo('task')?.value();
      if (task) {
        const parent = task.belongsTo('parent')?.value() ?? task;
        const { duration } = workLog;

        if (Object.hasOwn(acc, parent.id)) {
          acc[parent.id].totalDuration =
            acc[parent.id].totalDuration.add(duration);
        } else {
          acc[parent.id] = {
            totalDuration: duration,
            color: parent?.color,
            subProjects: {},
          };
        }

        acc[parent.id].totalDuration =
          acc[parent.id].totalDuration.normalized();

        if (task) {
          if (Object.hasOwn(acc[parent.id].subProjects, task.id)) {
            acc[parent.id].subProjects[task.id].totalDuration =
              acc[parent.id].subProjects[task.id].totalDuration.add(duration);
          } else {
            acc[parent.id].subProjects[task.id] = {
              totalDuration: duration,
            };
          }

          acc[parent.id].subProjects[task.id].totalDuration =
            acc[parent.id].subProjects[task.id].totalDuration.normalized();
        }
      }

      return acc;
    }, {});
  }
}
