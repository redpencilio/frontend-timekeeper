import Component from '@glimmer/component';
import { action } from '@ember/object';
import { localCopy } from 'tracked-toolbox';
import { offset } from '@floating-ui/dom';

export default class WorkLogNotesPopoverComponent extends Component {
  @localCopy('args.workLog.note', null) noteContent;

  floatingUIMiddleware = [
    offset({
      mainAxis: 8,
      crossAxis: -8,
    }),
  ];

  saveNote = (event) => {
    event.preventDefault();
    this.args.onSaveNote?.(this.args.workLog, this.noteContent);
  }

  deleteNote = (event) => {
    event.preventDefault();
    this.args.onSaveNote?.(this.args.workLog, null);
  }

  get saveDisabled() {
    const trimmedContent = this.noteContent?.trim();
    return !trimmedContent || this.args.workLog.note?.trim() === trimmedContent;
  }
}
