import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class YearMonthContoller extends Controller {
  @service mockData;

  projects = this.mockData.projects;

  get activeDate() {
    return new Date(this.model.year, this.model.month);
  }

  // TODO this is not very consistent
  @action
  addEvent(hourLog) {
    this.mockData.addHourLog(hourLog);
  }
}
