import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class TimeLogPopoverComponent extends Component {
  @service mockData;

  @tracked hours = 8;
  @tracked project = this.args.projects[0];
  @tracked focusHoursInput = null;
  @tracked addedInputs = [];

  elementRef = null;

  colorFor = (project) => this.mockData.colorMapTailwind[project];
  rawColorFor = (project) => this.mockData.colorMapTailwindRaw[project];

  @action
  closePopover() {
    this.args.onCancel?.();
  }

  @action
  updateHours(event) {
    this.hours = event.target.valueAsNumber;
  }

  @action
  updateDescription(event) {
    this.project = event.target.value;
  }

  @action
  onAddedProjectsChange(index, event) {
    this.addedInputs[index].hours = event.target.valueAsNumber;
  }

  @action
  submitLog(event) {
    event.preventDefault();
    // this.args.onSave?.([
    //   {
    //     hours: this.hours,
    //     project: this.project,
    //   },
    // ]);

    // this.resetFields();
    // this.closePopover();
  }

  resetFields() {
    // Reset fields
    this.hours = 8;
    this.project = this.args.projects[1];
  }

  @action
  onInsert(el) {
    this.moveToScreenPos(el);
  }

  @action
  onUpdate(el) {
    this.moveToScreenPos(el);
    this.resetFields();
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

  moveToScreenPos(el) {
    const { right, top } = this.args.screenPos;
    const popoverBox = el.getBoundingClientRect();
    el.style.left = `${right + 5}px`;
    const maybeNewTop = top - 10;
    const maybeNewBottom = maybeNewTop + popoverBox.height;
    const bottomOverlap =
      maybeNewBottom > window.screen.availHeight
        ? maybeNewBottom - window.screen.availHeight
        : 0;
    el.style.top = `${maybeNewTop - bottomOverlap}px`;
  }
}
