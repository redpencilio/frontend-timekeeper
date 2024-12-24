import Controller from '@ember/controller';
import { normalizeDuration } from 'frontend-timekeeper/utils/normalize-duration';

export default class YearMonthContoller extends Controller {
  get groupedTasks() {
    const grouped = Object.entries(
      Object.groupBy(this.model.tasks.slice(), (task) => task.parent.id),
    );

    return grouped.filter(([_, taskContent]) => taskContent.length > 1);
  }

  get singletonTasks() {
    const grouped = Object.entries(
      Object.groupBy(this.model.tasks.slice(), (task) => task.parent.id),
    );

    return grouped
      .filter(([_, taskContent]) => taskContent.length === 1)
      .map(([_, taskContent]) => taskContent[0]);
  }

  hoursWorked = (task, person) => {
    return normalizeDuration(
      this.model.workLogs
        .filter(
          ({ task: logTask, person: logPerson }) =>
            task.id === logTask.id && person.id === logPerson.id,
        )
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
