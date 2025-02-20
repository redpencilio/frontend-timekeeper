import Component from '@glimmer/component';
import { action } from '@ember/object';
import { localCopy } from 'tracked-toolbox';
import { offset } from '@floating-ui/dom';

export default class WorkLogNotesPopoverComponent extends Component {
  @localCopy('args.workLog.note') noteContent;

  floatingUIMiddleware = [
    offset({
      mainAxis: 8,
      crossAxis: -8,
    }),
  ];

  @action
  saveNote(event) {
    event.preventDefault();
    this.args.onSaveNote?.(this.args.workLog, this.noteContent);
  }
}
