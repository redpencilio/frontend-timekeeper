import Component from '@glimmer/component';
import Duration from '../utils/duration';
import { trackedRef } from 'ember-ref-bucket';
import { offset } from '@floating-ui/dom';

export default class HolidaysOverviewComponent extends Component {
  @trackedRef('holiday-counter') holidayCounterNode = null;

  floatingUIMiddleware = [
    offset(10)
  ]

  get sortedCounters() {
    return (this.args.holidayCounters ?? [])
      .slice()
      .sort((counterA, counterB) => counterB.value.cmp(counterA.value));
  }
  get holidaysTotal() {
    return this.args.holidayCounters
      .reduce((acc, { value }) => acc.add(value), new Duration())
      .normalized();
  }
}
