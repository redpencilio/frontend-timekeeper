import Controller from '@ember/controller';
import taskName from 'frontend-timekeeper/helpers/task-name';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { TIMESHEET_STATUSES } from 'frontend-timekeeper/constants';
import { startOfMonth, endOfMonth } from 'date-fns';
import { task } from 'ember-concurrency';
import { formatDate } from 'frontend-timekeeper/utils/format-date';

export default class YearMonthContoller extends Controller {
  @service router;
  @service store;

  async createTimesheet() {
    const { year, monthNumber } = this.model;
    if (!this.model.timesheet) {
      this.model.timesheet = this.store.createRecord('timesheet', {
        status: TIMESHEET_STATUSES.DRAFT,
        start: formatDate(startOfMonth(Date.UTC(year, monthNumber))),
        end: formatDate(endOfMonth(Date.UTC(year, monthNumber))),
      });
      await this.model.timesheet.save();
    }
  }

  markTimesheetComplete = task(async () => {
    await this.createTimesheet();
    this.model.timesheet.status = TIMESHEET_STATUSES.SUBMITTED;
    await this.model.timesheet.save();
  });

  markHolidaysComplete = task(async () => {
    await this.createTimesheet();
    this.model.timesheet.status = TIMESHEET_STATUSES.ABSENCE_SUBMITTED;
    await this.model.timesheet.save();
  });

  onSaveSimple = task(async ({ duration, task }, date) => {
    await this.createTimesheet();
    const workLog = this.store.createRecord('work-log', {
      duration,
      task,
      date,
    });
    await workLog.save();
    this.router.refresh();
  });

  onSaveMulti = task(async (hourTaskPairs, date) => {
    await this.createTimesheet();
    await Promise.all(
      hourTaskPairs.map(async ({ duration, task, workLog }) => {
        if (workLog) {
          workLog.duration = duration;
          await workLog.save();
        } else {
          const newWorkLog = this.store.createRecord('work-log', {
            duration,
            task,
            date,
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
    return new Date(this.model.year, this.model.monthNumber);
  }
}
