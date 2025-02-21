import Component from '@glimmer/component';
import { action } from '@ember/object';
import { localCopy } from 'tracked-toolbox';

export default class WorkLogNotesPopoverComponent extends Component {
  @localCopy('args.workLog.note', '') noteContent;

  @action
  saveNote(event) {
    event.preventDefault();
    this.args.onSaveNote?.(this.args.workLog, this.noteContent);
  }
}
