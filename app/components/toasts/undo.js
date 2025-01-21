import Component from '@glimmer/component';
import { task } from 'ember-concurrency';

export default class ToastsUndoComponent extends Component {
  clickUndo = task(async () => {
    await this.args.onUndo?.();
  });
}
