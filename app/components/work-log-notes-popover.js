import Component from '@glimmer/component';
import { action } from '@ember/object';
import { localCopy } from 'tracked-toolbox';
import { tracked } from '@glimmer/tracking';

export default class WorkLogNotesPopoverComponent extends Component {
  @localCopy('args.workLog.note', null) noteContent;

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
