import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { trackedReset } from 'tracked-toolbox';
import { v4 as uuidv4 } from 'uuid';

export default class TimeLogPopoverComponent extends Component {
  @tracked hours = 8;
  @tracked focusHoursInput = null;

  @trackedReset({
    memo: 'args.favoriteProjects',
    update() {
      return this.args.favoriteProjects.map((project) => ({
        project,
        hours: 0,
      }));
    },
  })
  favoriteProjects = [];

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
    const editArray = isFavorite ? this.favoriteProjects : this.addedInputs;
    editArray[index].hours = event.target.valueAsNumber;
  }

  @action
  submitLog(event) {
    event.preventDefault();
    const hourProjectPairs = [
      ...this.favoriteProjects.map(({ hours, project }) => ({
        duration: { hours },
        subProject: project,
      })),
      ...this.addedInputs.map(({ hours, project }) => ({
        duration: { hours },
        subProject: project,
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
