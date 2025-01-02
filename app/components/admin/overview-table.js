import Component from '@glimmer/component';
import { normalizeDuration } from 'frontend-timekeeper/utils/normalize-duration';
import constants from 'frontend-timekeeper/constants';
import { service } from '@ember/service';
const {
  ABSENCE: { GENERAL: ABSENCE_ID },
} = constants.TASK_IDS;

export default class AdminOverviewTableComponent extends Component {
  @service store;

  getTaskNameById = (id) => this.store.peekRecord('task', id)?.name;

  get groupedTasks() {
    const grouped = Object.entries(
      Object.groupBy(this.args.tasks.slice(), (task) =>
        task.belongsTo('parent')?.id(),
      ),
    );

    const groupedTasks = grouped.filter(
      ([taskKey, taskContent]) => taskContent.length > 1 && taskKey !== 'null',
    );

    // Move absence to the top
    const index = groupedTasks.findIndex(([taskId]) => taskId === ABSENCE_ID);

    if (index > -1) {
      const [item] = groupedTasks.splice(index, 1);
      groupedTasks.unshift(item);
    }

    return groupedTasks;
  }

  get singletonTasks() {
    const grouped = Object.entries(
      Object.groupBy(this.args.tasks.slice(), (task) =>
        task.belongsTo('parent')?.id(),
      ),
    );

    return grouped
      .filter(([_, taskContent]) => taskContent.length === 1)
      .map(([_, taskContent]) => taskContent[0]);
  }

  hoursWorked = (task, person) => {
    return normalizeDuration(
      this.args.workLogs
        .filter((workLog) => {
          const logTaskId = workLog.belongsTo('task').id();
          const logPersonId = workLog.belongsTo('person').id();
          return task.id === logTaskId && person.id === logPersonId;
        })
        .reduce(
          (
            { hours: totalHours, minutes: totalMinutes },
            { duration: { hours, minutes } },
          ) => ({ hours: totalHours + hours, minutes: totalMinutes + minutes }),
          { hours: 0, minutes: 0 },
        ),
    );
  };
}
