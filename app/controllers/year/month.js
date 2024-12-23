import Controller from '@ember/controller';
import taskName from 'frontend-timekeeper/helpers/task-name';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import constants from 'frontend-timekeeper/constants';
import { isSameDay } from 'date-fns';
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

  save = task(async (workLogTaskPairs, dates) => {
    // Selection only contains one date, we don't want to overwrite
    if (dates.length === 1) {
      await Promise.all(
        workLogTaskPairs.map(async ({ duration, task, workLog }) => {
          if (workLog) {
            if (duration.hours === 0 && duration.minutes === 0) {
              // An existing worklog was set to 0, remove it
              await workLog.destroyRecord();
              this.model.workLogs.removeObject(workLog);
            } else {
              // The duration of an existing workLog has changed
              workLog.duration = duration;
              if (workLog.hasDirtyAttributes) {
                await workLog.save();
              }
            }
          } else {
            // A new workLog has to be created
            const [date] = dates;
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
    } else {
      // This list is needed because otherwise UI will update
      // After every delete
      const workLogsToRemove = [];
      await Promise.all([
        // Clear existing workLogs
        ...this.model.workLogs.map(async (workLog) => {
          if (dates.some((date) => isSameDay(date, workLog.date))) {
            await workLog.destroyRecord();
            workLogsToRemove.push(workLog);
          }
        }),
        // Insert new workLogs
        ...dates.map(async (date) => {
          await Promise.all(
            workLogTaskPairs.map(async ({ duration, task }) => {
              // A new workLog has to be created
              const newWorkLog = this.store.createRecord('work-log', {
                duration,
                task,
                date,
                person: this.userProfile.user,
              });
              await newWorkLog.save();
            }),
          );
        }),
      ]);
      workLogsToRemove.forEach((workLog) =>
        this.model.workLogs.removeObject(workLog),
      );
    }
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
