import Service from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import { TrackedArray } from 'tracked-built-ins';

export default class ToasterService extends Service {
  toasts = new TrackedArray();

  displayToast = task(async (toast) => {
    this.toasts.push(toast);

    if (toast.options.timeOut) {
      await timeout(toast.options.timeOut);

      this.close(toast);
    }
  });

  closeBy(cb) {
    for (let i = this.toasts.length - 1; i >= 0; i -= 1) {
      if (cb(this.toasts[i])) {
        this.toasts.splice(i, 1);
      }
    }
  }

  close(toast) {
    const index = this.toasts.indexOf(toast);
    if (index !== -1) {
      this.toasts.splice(index, 1);
    }
  }

  notify(message, title, options = {}) {
    const toast = {
      title,
      message,
      options,
    };

    this.displayToast.perform(toast);
    return toast;
  }

  async actionWithUndo({
    actionText,
    actionDoneText,
    actionUndoneText,
    action,
    undoAction,
    undoTime,
    contextKey,
  }) {
    this.closeBy((toast) => toast.contextKey === contextKey);
    const actionToast = { message: actionText, contextKey, options: {} };
    this.displayToast.perform(actionToast);
    await action();
    // If the toast was already closed by someone else
    // we don't show any follow up toasts (sorry, hacky)
    if (!this.toasts.includes(actionToast)) return;
    this.close(actionToast);
    const actionDoneToast = {
      type: 'undo',
      contextKey,
      message: actionDoneText,
      undoAction: async () => {
        this.close(actionDoneToast);
        const undoingToast = {
          message: 'Undoing…',
          contextKey,
          options: {},
        };
        this.displayToast.perform(undoingToast);
        await undoAction();
        // If the toast was already closed by someone else
        // we don't show any follow up toasts (sorry, hacky)
        if (!this.toasts.includes(undoingToast)) return;
        this.close(undoingToast);
        this.displayToast.perform({
          message: actionUndoneText,
          contextKey,
          options: {
            timeOut: 2000,
          },
        });
      },
      options: { timeOut: undoTime },
    };
    this.displayToast.perform(actionDoneToast);
  }
}
