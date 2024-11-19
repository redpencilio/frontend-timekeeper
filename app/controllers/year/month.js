import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class YearMonthContoller extends Controller {
  get events() {
    return this.model.workLogs.map((workLog) => {
      const {
        duration: { hours },
        date,
        id,
      } = workLog;
      const subProject = workLog.belongsTo('subProject')?.value();
      const parent = subProject?.belongsTo('parent')?.value();
      return {
        id,
        title: `${hours}h: ${subProject.name}`,
        start: date,
        allDay: true,
        backgroundColor: parent.color,
        borderColor: parent.color,
        extendedProps: {
          workLog,
        },
      };
    });
  }

  get favoriteProjects() {
    return this.model.projects.slice(0, 3);
  }

  get activeDate() {
    return new Date(this.model.year, this.model.monthNumber);
  }

  @action
  addEvent(hourLog) {
    // this.mockData.addHourLog(hourLog);
  }
}
