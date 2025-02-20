import Component from '@glimmer/component';
import { action } from '@ember/object';
import { computePosition, shift, offset, size } from '@floating-ui/dom';

export default class TimeLogPopoverComponent extends Component {
  elementRef = null;

  @action
  onInsert(el) {
    this.elementRef = el;
  }

  @action
  moveToScreenPos() {
    computePosition(this.args.anchorElement, this.elementRef, {
      placement: this.args.placement ?? 'right-start',
      middleware: [
        ...(this.args.middleware ?? []),
        shift(),
        size({
          apply({ availableWidth, availableHeight, elements }) {
            // Change styles, e.g.
            Object.assign(elements.floating.style, {
              maxWidth: `${Math.max(0, availableWidth)}px`,
              maxHeight: `${Math.max(0, availableHeight)}px`,
            });
          },
        }),
      ],
    }).then(({ x, y }) => {
      Object.assign(this.elementRef.style, {
        left: `${x}px`,
        top: `${y}px`,
      });
    });
  }
}
