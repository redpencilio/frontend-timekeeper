import Component from '@glimmer/component';
import { normalizeDuration } from 'frontend-timekeeper/utils/normalize-duration';
import constants from 'frontend-timekeeper/constants';
import { service } from '@ember/service';
const {
  ABSENCE: { GENERAL: ABSENCE_ID },
} = constants.TASK_IDS;

export default class AdminOverviewTableComponent extends Component {
  @service store;
  @service taskStore;

  hoursWorked = (task, person) =>
    normalizeDuration(
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
}
