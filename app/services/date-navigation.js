import Service from '@ember/service';
import { service } from '@ember/service';

export default class DateNavigationService extends Service {
  @service router;

  nextMonth() {
    alert('next month clicked');
  }

  previousMonth() {
    alert('previous month clicked');
  }

  today() {
    alert('today clicked');
  }
}
