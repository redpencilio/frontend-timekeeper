import Controller from '@ember/controller';
import taskName from 'frontend-timekeeper/helpers/task-name';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import constants from 'frontend-timekeeper/constants';
const { TIMESHEET_STATUSES } = constants;

export default class YearMonthContoller extends Controller {
  @service router;
  @service store;
  @service userProfile;

  @tracked timesheet;

  @action
  async submitHolidays() {
    this.timesheet.status = TIMESHEET_STATUSES.ABSENCE_SUBMITTED;
    await this.timesheet.save();
  }

  @action
  async submitTimesheet() {
    this.timesheet.status = TIMESHEET_STATUSES.SUBMITTED;
    await this.timesheet.save();
  }

  save = task(async (workLogTaskPairs, date) => {
    await Promise.all(
      workLogTaskPairs.map(async ({ duration, task, workLog }) => {
        if (workLog) {
          if (duration.hours === 0 && duration.minutes === 0) {
            await workLog.destroyRecord();
          } else {
            workLog.duration = duration;
            if (workLog.hasDirtyAttributes) {
              await workLog.save();
            }
          }
        } else {
          const newWorkLog = this.store.createRecord('work-log', {
            duration,
            task,
            date,
            person: this.userProfile.user,
          });
          await newWorkLog.save();
        }
      }),
    );
    this.router.refresh();
  });

  @action
  async deleteWorkLog(workLog) {
    await workLog.destroyRecord();
    this.router.refresh();
  }

  get events() {
    return this.model.workLogs.map((workLog) => {
      const {
        duration: { hours, minutes },
        date,
        id,
      } = workLog;
      // TODO: use trackedFunction of https://github.com/NullVoxPopuli/ember-resources
      // instead of fetching async data in a getter
      const task = workLog.belongsTo('task')?.value();
      const name = taskName(task);
      return {
        id,
        title: `${hours > 0 ? `${hours}h` : ''}${minutes > 0 ? `${minutes}m` : ''}: ${name}`,
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

  get activeDate() {
    return new Date(this.model.year, this.model.month);
  }
}
