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

  @tracked timesheet;

  get firstDayOfMonth() {
    return new Date(this.model.year, this.model.month, 1);
  }

  @action
  async changeTimesheetStatus(status) {
    if (!Object.values(TIMESHEET_STATUSES).includes(status)) {
      throw new Error(`Invalid status: "${status}"`);
    }
    this.timesheet.status = status;
    await this.timesheet.save();
  }

  save = ecTask(async (workLogEntries, dates) => {
    // Selection only contains one date, we don't want to overwrite
    if (dates.length === 1) {
      await Promise.all(
        workLogEntries.map(async ({ duration, task, workLog }) => {
          if (workLog) {
            if (duration.hours === 0 && duration.minutes === 0) {
              // An existing worklog was set to 0, remove it
              await workLog.destroyRecord();
              this.model.workLogs.removeObject(workLog);
            } else {
              // Properties of an existing workLog have changed
              workLog.duration = duration;
              workLog.task = task;
              await workLog.save();
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
            workLogEntries
              .filter(
                ({ duration: { hours, minutes } }) => hours > 0 || minutes > 0,
              )
              .map(async ({ duration, task }) => {
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
    this.router.refresh(this.router.currentRouteName);
  });

  @action
  async deleteWorkLog(workLog) {
    await workLog.destroyRecord();
    this.model.workLogs.removeObject(workLog);
    this.router.refresh(this.router.currentRouteName);
  }

  @action
  async undoDeleteWorkLog(workLogCopy) {
    const newWorkLog = this.store.createRecord('work-log', workLogCopy);
    await newWorkLog.save();
    this.router.refresh(this.router.currentRouteName);
  }
}
