import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class YearMonthContoller extends Controller {
  get favoriteProjects() {
    return this.model.projects.slice(0, 3);
  }

  get activeDate() {
    return new Date(this.model.year, this.model.month);
  }

  @action
  addEvent(hourLog) {
    // this.mockData.addHourLog(hourLog);
  }
}
