import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ProjectPillRadioGroupComponent extends Component {
  get monthData() {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    return months.map((month, index) => {
      return {
        name: month,
        completed: index < 10, // TODO use actual data
      };
    });
  }
}
