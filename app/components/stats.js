import Component from '@glimmer/component';
import { service } from '@ember/service';
import { sumDurationAttributes } from '../utils/duration';
import { trackedFunction } from 'reactiveweb/function';

export default class StatsComponent extends Component {
  @service('tasks') tasksService;

  summary = trackedFunction(this, async () => {
    const workLogsWithContext = await Promise.all(
      this.args.workLogs.map(async (workLog) => {
        const subTask = await workLog.task;
        return { workLog, subTask };
      }),
    );

    const summary = this.tasksService.taskHierarchy
      .map(({ customer, tasks }) => {
        const tasksWithDuration = tasks
          .map(({ task, subTasks }) => {
            const subTasksWithDuration = subTasks
              .map((subTask) => {
                const workLogs = workLogsWithContext
                  .filter((workLog) => workLog.subTask.id == subTask.id)
                  .map(({ workLog }) => workLog);
                const duration = sumDurationAttributes(workLogs);
                if (duration.isEmpty) {
                  return null; // no working hours logged. Must not be part of summary.
                } else {
                  return { task: subTask, duration };
                }
              })
              .filter((i) => i);

            if (subTasksWithDuration.length) {
              const duration = sumDurationAttributes(subTasksWithDuration);
              const showSubTasks =
                subTasksWithDuration.length > 1 ||
                subTasksWithDuration[0].task.name !== 'General';
              return {
                task,
                duration,
                showSubTasks,
                subTasks: subTasksWithDuration,
              };
            } else {
              // No working hours logged on subtasks. Parent must be discarded.
              return null;
            }
          })
          .filter((i) => i);

        if (tasksWithDuration.length) {
          const duration = sumDurationAttributes(tasksWithDuration);
          return { customer, duration, tasks: tasksWithDuration };
        } else {
          // No working hours logged on any of the tasks. Customer must be discarded.
          return null;
        }
      })
      .filter((i) => i);

    return summary;
  });

  get totalDuration() {
    return sumDurationAttributes(this.summary.value || []);
  }
}
