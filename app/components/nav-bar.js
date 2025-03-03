import Component from '@glimmer/component';
import { sub, add, format } from 'date-fns';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { ref } from 'ember-ref-bucket';

export default class NavBarComponent extends Component {
  @service userProfile;
  @tracked datePickerVisible = false;

  showDatePicker = () => {
    this.datePickerVisible = true;
  };

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
}
