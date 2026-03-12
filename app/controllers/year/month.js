import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { task as ecTask } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import constants from 'frontend-timekeeper/constants';
import { isSameDay } from 'date-fns';
const { TIMESHEET_STATUSES } = constants;

export default class YearMonthContoller extends Controller {
  @service router;
  @service store;
  @service userProfile;
  @service('timesheets') timesheetsService;

  @tracked timesheet;
  @tracked showSummary = false;

  get firstDayOfMonth() {
    return new Date(this.model.year, this.model.month, 1);
  }

  @action
  async changeTimesheetStatus(status) {
    if (!Object.values(TIMESHEET_STATUSES).includes(status)) {
      throw new Error(`Invalid status: "${status}"`);
    }
    // Check if there is a timesheet on the server already
    // This could have been created in another tab
    const serverTimesheet = await this.timesheetsService.getForMonth(
      this.model.year,
      this.model.month,
    );
    this.timesheet = serverTimesheet ?? this.timesheet;
    this.timesheet.status = status;
    await this.timesheet.save();
  }

  save = ecTask(async (workLogEntries, dates) => {
    // This list is needed because otherwise UI will update
    // After every delete
    const workLogsToRemove = [];
    await Promise.all([
      ...dates.map(async (date) => {
        await Promise.all(
          workLogEntries.map(async ({ duration, task, note }) => {
            if (!duration) {
              return;
            }
            const workLog = await this.findWorkLog(task.id, date);
            if (workLog) {
              if (duration.isEmpty) {
                await workLog.destroyRecord();
                workLogsToRemove.push(workLog);
              } else {
                workLog.note = note;
                workLog.duration = duration;
                await workLog.save();
              }
            } else if (!duration.isEmpty) {
              const newWorkLog = this.store.createRecord('work-log', {
                duration,
                task,
                note,
                date,
                person: this.userProfile.user,
              });
              await newWorkLog.save();
            }
          }),
        );
      }),
    ]);
    workLogsToRemove.forEach((workLog) =>
      this.model.workLogs.removeObject(workLog),
    );
    this.router.refresh(this.router.currentRouteName);
  });

  /**
   * Finds a WorkLog by taskId and date by which it is uniquely defined
   * @param {string} taskId
   * @param {Date} date
   * @returns WorkLog
   */
  async findWorkLog(taskId, date) {
    const workLogsWithTasks = await Promise.all(
      this.model.workLogs.map(async (workLog) => ({
        workLog,
        task: await workLog.task,
      })),
    );
    return workLogsWithTasks.find(
      ({ workLog, task }) =>
        isSameDay(workLog.date, date) && taskId === task.id,
    )?.workLog;
  }

  @action
  async deleteWorkLog(workLog) {
    this.model.workLogs.removeObject(workLog);
    await workLog.destroyRecord();
    this.router.refresh(this.router.currentRouteName);
  }

  @action
  async undoDeleteWorkLog(workLogCopy) {
    const newWorkLog = this.store.createRecord('work-log', workLogCopy);
    await newWorkLog.save();
    this.router.refresh(this.router.currentRouteName);
  }
}
