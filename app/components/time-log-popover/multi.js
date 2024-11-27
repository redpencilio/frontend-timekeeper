import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { trackedReset } from 'tracked-toolbox';
import { v4 as uuidv4 } from 'uuid';
import { task } from 'ember-concurrency';

export default class TimeLogPopoverComponent extends Component {
  @service store;

  @tracked focusHoursInput = null;
  @tracked favouriteTasks = [];

  constructor() {
    super(...arguments);
    this.loadData.perform();
  }

  loadData = task(async () => {
    // TODO update query to make a smarter selection of favourite tasks
    // and share logic with FavouriteTasksRadioGroup component
    const leafTasks = await this.store.query('task', {
      'filter[:has:parent]': 't',
      include: 'parent',
      page: {
        size: 3,
      },
    });

    this.favouriteTasks = leafTasks;
  });

  @trackedReset({
    memo: 'favouriteTasks',
    update() {
      return this.favouriteTasks.map((task) => ({
        task,
        hours: 0,
      }));
    },
  })
  favouriteTaskWorkLogs = [];

  @tracked addedWorkLogs = [];

  newProjectPowerSelectApi = null;

  @action
  closePopover() {
    this.args.onCancel?.();
  }

  @action
  updateHours(workLog, event) {
    workLog.hours = event.target.valueAsNumber;
  }

  @action
  updateTask(workLog) {
    workLog.task = task;
    this.focusHoursInput = this.addedWorkLogs.indexOf(workLog);
  }

  @action
  addTaskToList(task) {
    const newEntry = { task, hours: 0, elementId: uuidv4() };
    this.addedWorkLogs = [...this.addedWorkLogs, newEntry];
    this.focusHoursInput = this.addedWorkLogs.length - 1;
  }

  @action
  submitWorkLogs(event) {
    event.preventDefault();
    const hourProjectPairs = [
      ...this.favouriteTaskWorkLogs.map(({ hours, task }) => ({
        duration: { hours },
        task,
      })),
      ...this.addedWorkLogs.map(({ hours, task }) => ({
        duration: { hours },
        task,
      })),
    ].filter(({ duration: { hours } }) => hours > 0);
    this.args.onSave?.perform(hourProjectPairs);
  }

  @action
  handleKeydown(event) {
    if (event.key === '/') {
      event.preventDefault();
      this.newProjectPowerSelectApi?.actions.open();
    }
  }

  @action
  registerNewProjectPowerSelect(api) {
    this.newProjectPowerSelectApi = api;
  }
}
