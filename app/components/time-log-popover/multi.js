import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { trackedReset } from 'tracked-toolbox';
import { v4 as uuidv4 } from 'uuid';
import { task } from 'ember-concurrency';

export default class TimeLogPopoverComponent extends Component {
  @service store;

  @tracked hours = 8;
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
  favouriteTaskWrappers = [];

  @tracked addedInputs = [];

  newProjectPowerSelectApi = null;

  @action
  closePopover() {
    this.args.onCancel?.();
  }

  @action
  updateDescription(event) {
    this.project = event.target.value;
  }

  @action
  onHoursChange(index, isFavorite, event) {
    const editArray = isFavorite ? this.favouriteTaskWrappers : this.addedInputs;
    editArray[index].hours = event.target.valueAsNumber;
  }

  @action
  submitLog(event) {
    event.preventDefault();
    const hourProjectPairs = [
      ...this.favouriteTaskWrappers.map(({ hours, task }) => ({
        duration: { hours },
        subProject: task,
      })),
      ...this.addedInputs.map(({ hours, task }) => ({
        duration: { hours },
        subProject: task,
      })),
    ].filter(({ duration: { hours } }) => hours > 0);
    this.args.onSave?.perform(hourProjectPairs);
  }

  @action
  changeInput(index, hoursInputId, project, api, event) {
    const { hours } = this.addedInputs[index];
    this.addedInputs[index] = { project, hours };
    this.addedInputs = this.addedInputs;
    this.focusHoursInput = index;
  }

  @action
  addInput(project) {
    const newEntry = { project, hours: 0, elementId: uuidv4() };
    this.addedInputs = [...this.addedInputs, newEntry];
    this.focusHoursInput = this.addedInputs.length - 1;
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
