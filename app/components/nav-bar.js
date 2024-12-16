import Component from '@glimmer/component';
import { monthsInYear } from 'date-fns/constants';
import { format } from 'date-fns';
import { service } from '@ember/service';

export default class NavBarComponent extends Component {
  @service userProfile; 

  get months() {
    const items = [];
    for (let i = 0; i < monthsInYear; i++) {
      const dateInMonth = new Date(this.args.year, i, 1);
      items.push({
        number: i,
        humanNumber: i + 1,
        label: format(dateInMonth, 'LLLL'),
        timesheet: this.args.timesheets.find((timesheet) => timesheet.start.getMonth() === i),
      });
    }
    return items;
  }
}
