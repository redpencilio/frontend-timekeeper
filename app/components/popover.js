import Component from '@glimmer/component';
import { action } from '@ember/object';
import { computePosition, shift, offset } from '@floating-ui/dom';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class TimeLogPopoverComponent extends Component {
  @service localStorage;

  elementRef = null;

  @action
  onInsert(el) {
    this.elementRef = el;
  }

  @action
  onToggle(value) {
    this.localStorage.useAdvancedLogPopover = value;
  }

  @action
  moveToScreenPos() {
    computePosition(this.args.anchorElement, this.elementRef, {
      placement: 'right-start',
      middleware: [
        offset({
          mainAxis: 8,
          crossAxis: -8,
        }),
        shift({ padding: 5 }),
      ],
    }).then(({ x, y }) => {
      Object.assign(this.elementRef.style, {
        left: `${x}px`,
        top: `${y}px`,
      });
    });
  }
}
