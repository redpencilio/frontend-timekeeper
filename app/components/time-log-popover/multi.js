import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { trackedReset } from 'tracked-toolbox';

export default class TimeLogPopoverComponent extends Component {
  @service mockData;

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

  colorFor = (project) => this.mockData.colorMapTailwind[project];
  rawColorFor = (project) => this.mockData.colorMapTailwindRaw[project];

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
        hours,
        project,
      })),
      ...this.addedInputs.map(({ hours, project }) => ({ hours, project })),
    ].filter(({ hours }) => hours > 0);
    this.args.onSave?.(hourProjectPairs);
  }

  @action
  onHoursClick(project, event) {
    const target = event.target;
    target.select();
  }

  @action
  changeInput(index, hoursInputId, project, api, event) {
    const { hours } = this.addedInputs[index];
    this.addedInputs[index] = { project, hours };
    this.addedInputs = this.addedInputs;
    this.focusHoursInput = index;
  }

  @action
  maybeFocus(index, element) {
    if (index === this.focusHoursInput) {
      element.focus();
      element.select();
    }
  }

  @action
  addInput(project) {
    this.addedInputs = [...this.addedInputs, { project, hours: 0 }];
    this.focusHoursInput = this.addedInputs.length - 1;
  }
}
