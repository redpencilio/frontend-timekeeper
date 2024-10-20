import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { ref } from 'ember-ref-bucket';

export default class TimeLogPopoverComponent extends Component {
  @tracked isPopoverOpen = false;
  @tracked hours = 8;
  @tracked project = this.args.projects[0];
  elementRef = null;

  @ref('hoursInput') hoursInput;

  @action
  togglePopover() {
    this.isPopoverOpen = !this.isPopoverOpen;
    if (this.isPopoverOpen) {
      // Focus on the hours input when the popover opens
      this.focusHoursInput();
    }
  }

  @action
  closePopover() {
    this.isPopoverOpen = false;
    this.args.onCancel?.();
  }

  @action
  updateHours(event) {
    this.hours = event.target.value;
  }

  @action
  updateDescription(event) {
    this.project = event.target.value;
  }

  @action
  submitLog(event) {
    event.preventDefault();

    // Log the time
    console.log(`Logged ${this.hours} hours: ${this.project}`);
    this.args.onSave?.({
      hours: this.hours,
      project: this.project,
    });

    this.resetFields();
    this.closePopover();
  }

  resetFields() {
    // Reset fields
    this.hours = 8;
    this.project = this.args.projects[1];
  }

  @action
  focusHoursInput() {
    if (this.hoursInput) {
      this.hoursInput.focus();
      this.hoursInput.select();
    }
  }

  @action
  onInsert(el) {
    this.elementRef = el;
    this.focusHoursInput();
    this.moveToScreenPos(el);
  }

  @action
  onUpdate(el) {
    this.focus;
    this.moveToScreenPos(el);
    this.resetFields();
    this.focusHoursInput();
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
