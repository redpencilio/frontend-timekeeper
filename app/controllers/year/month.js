import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class YearMonthContoller extends Controller {
  get activeDate() {
    return new Date(this.model.year, this.model.month - 1);
  }
}
