import Controller from '@ember/controller';
import { monthsInYear } from 'date-fns/constants';
import { format } from 'date-fns';
import { service } from '@ember/service';

export default class AdminTimesheetsYearController extends Controller {
  @service router;

  get activeMonth() {
    if (this.router.currentRoute.name === 'admin.timesheets.year.month') {
      return this.router.currentRoute.params.month;
    } else {
      return 1;
    }
  }

  get months() {
    const items = [];
    for (let i = 0; i < monthsInYear; i++) {
      const dateInMonth = new Date(this.model.year, i, 1);
      items.push({
        number: i,
        humanNumber: i + 1,
        label: format(dateInMonth, 'LLLL'),
      });
    }
    return items;
  }
}
