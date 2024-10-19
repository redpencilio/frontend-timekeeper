import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { ref } from 'ember-ref-bucket';

export default class TimeLogPopoverComponent extends Component {
  @tracked isPopoverOpen = false;
  @tracked hours = 8;
  @tracked project = '';

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

    // Reset fields
    this.hours = 8;
    this.project = '';
    this.closePopover();
  }

  @action
  focusHoursInput() {
    if (this.hoursInput) {
      this.hoursInput.focus();
      this.hoursInput.select(); // Highlight the input text
    }
  }
}
