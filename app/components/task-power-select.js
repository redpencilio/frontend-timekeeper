import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';

export default class TaskPowerSelectComponent extends Component {
  @service store;
  @tracked options;

  constructor() {
    super(...arguments);
    this.loadData.perform();
  }

  loadData = task(async () => {
    const leafTasks = await this.store.queryAll('task', {
      'filter[:has:parent]': 't',
      include: 'parent',
      sort: 'parent.customer.name,parent.name',
    });

    this.options = leafTasks;
  });

  @action
  onKeydown(api, event) {
    if (!api.isOpen && isLetter(event.key)) {
      api.actions.open();
      api.actions.search(event.key);
      return false;
    }

    if (event.key === 'Enter') {
      event.preventDefault(); // We don't want to trigger a submit
    }

    if (event.key === 'Escape' || event.key === 'Esc') {
      event.preventDefault();
      event.stopPropagation();
    }

    return true;
  }

  @action
  onFocus(api, event) {
    api.actions.open();
  }

  @action
  onBlur(api, event) {
    api.actions.close();
  }
}

function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}
