import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';

export default class YearMonthContoller extends Controller {
  @tracked alternateEvents = false;

  get events() {
    return this.alternateEvents
      ? [
          {
            title: 'Test',
            start: new Date(),
            allDay: true,
          },
        ]
      : [
          {
            title: 'Test alternate',
            start: new Date(),
            allDay: true,
          },
        ];
  }

  @tracked focusDate = new Date();

  constructor() {
    super(...arguments);
    setTimeout(() => (this.alternateEvents = true), 1000);
  }
}
