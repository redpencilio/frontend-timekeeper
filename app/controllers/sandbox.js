import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';

export default class YearMonthContoller extends Controller {
  @tracked alternateEvents = false;
  @tracked selectedProject = 'test';

  projects = ['test', 'foo', 'foo2', 'bar'];

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

  @action
  registerAPI(api) {}

  @action
  nullAction() {
    return;
  }

  @action
  onChange(project) {
    this.selectedProject = project;
  }

  @action
  onFocus(api) {
    api.actions.open();
  }
}
