import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import taskName from 'frontend-timekeeper/helpers/task-name';

export default class TaskPowerSelectComponent extends Component {
  @service store;
  @tracked _fetchedTasks = [];

  constructor() {
    super(...arguments);
    this.loadData.perform();
  }

  loadData = task(async () => {
    const leafTasks = await this.store.queryAll('task', {
      'filter[:has:parent]': 't',
      include: 'parent,parent.customer',
      sort: 'parent.customer.name,parent.name',
    });

    this._fetchedTasks = leafTasks;
  });

  get options() {
    const tasks = this._fetchedTasks.filter(
      (task) =>
        !this.args.excludeTasks?.map((task) => task.id)?.includes(task.id),
    );
    const grouped = Object.entries(
      Object.groupBy(tasks, (task) => task.parent.id),
    );

    const singletons = grouped.filter(
      ([_, taskContent]) => taskContent.length === 1,
    );
    const groups = grouped.filter(([_, taskContent]) => taskContent.length > 1);

    return [
      ...singletons.map(([_, taskContent]) => taskContent[0]),
      ...groups.map(([taskId, children]) => ({
        groupName: this.store.peekRecord('task', taskId)?.name,
        options: children,
      })),
    ];
  }

  matcher(option, searchTerm) {
    const searchStrings = [
      option.name,
      option.parent?.get('name'),
      option.parent?.get('customer')?.get('name'),
    ];
    return searchStrings.some((string) =>
      string.toLowerCase().includes(searchTerm.toLowerCase()),
    )
      ? 1
      : -1;
  }

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

    if (api.isOpen && event.key === 'Escape') {
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
