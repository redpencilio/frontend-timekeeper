import Component from '@glimmer/component';
import { sub, add, format } from 'date-fns';
import { monthsInYear } from 'date-fns/constants';
import { service } from '@ember/service';
import { localCopy } from 'tracked-toolbox';
import { trackedFunction } from 'reactiveweb/function';

export default class MonthSelectComponent extends Component {
  @service('timesheets') timesheetsService;
  @localCopy('args.year') year;

  timesheets = trackedFunction(this, async () => {
    return await this.timesheetsService.getForYear(this.year);
  });

  decrementYear = () => {
    this.year -= 1;
  };

  incrementYear = () => {
    this.year += 1;
  };

  get months() {
    const items = [];
    for (let i = 0; i < monthsInYear; i++) {
      const dateInMonth = new Date(this.args.year, i, 1);
      items.push({
        number: i,
        humanNumber: i + 1,
        label: format(dateInMonth, 'LLLL'),
        timesheet: this.timesheets.value?.find(
          (timesheet) => timesheet.start.getMonth() === i,
        ),
      });
    }
    return items;
  }

  addSubMonth = (isAdd = false) => {
    const year = this.args.year ?? new Date().getFullYear();
    const month = this.args.month ?? new Date().getMonth();
    const current = new Date(year, month);
    const f = isAdd ? add : sub;
    const newMonth = f(current, { months: 1 });

    return [newMonth.getFullYear(), newMonth.getMonth() + 1];
  };

  get nextMonthRouteModel() {
    return this.addSubMonth(true);
  }

  get previousMonthRouteModel() {
    return this.addSubMonth(false);
  }

  get monthYearLabel() {
    const date = new Date(this.args.year, this.args.month);
    return `${format(date, 'LLLL')} ${this.args.year}`;
  }

  closeDropdown = (dropdown) => {
    dropdown.actions.close();
  };
}
