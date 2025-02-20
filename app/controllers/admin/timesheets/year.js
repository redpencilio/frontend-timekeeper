import Controller from '@ember/controller';
import { monthsInYear } from 'date-fns/constants';
import { format } from 'date-fns';

export default class AdminTimesheetsYearController extends Controller {
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
