import Component from '@glimmer/component';
import { monthsInYear } from 'date-fns/constants';
import { format } from 'date-fns';

export default class ProjectPillRadioGroupComponent extends Component {
  // TODO fetch timesheet status for each month
  get months() {
    const items = [];
    for (let i = 0; i < monthsInYear; i++) {
      const dateInMonth = new Date(this.args.year, i, 1);
      items.push({
        number: i,
        humanNumber: i + 1,
        label: format(dateInMonth, 'LLLL'),
        status: null,
      });
    }
    return items;
  }
}
