import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';

export default class TaskPowerSelectComponent extends Component {
  @service store;
  @service('tasks') tasksService;
  @service userProfile;

  @tracked options = [];

  constructor() {
    super(...arguments);
    this.loadData.perform();
  }

  loadData = task(async () => {
    const visibleTasks = await this.store.queryAll('task', {
      'filter[visible-to][:id:]': this.userProfile.user.id,
    });

    const taskIsVisible = (task) => visibleTasks.includes(task);

    const options = [];
    this.tasksService.taskHierarchy.map(({ customer, tasks }) => {
      const isVisible = tasks.some((task) => task.subTasks.some(taskIsVisible));
      if (isVisible) {
        const customerOption = { groupName: customer.name, options: [] };

        tasks.forEach(({ task, subTasks }) => {
          const isVisible = subTasks.some(taskIsVisible);
          if (isVisible) {
            const showSubTasks =
              subTasks.length > 1 || subTasks[0].name !== 'General';

            if (showSubTasks) {
              customerOption.options.push({
                groupName: task.name,
                options: subTasks.filter(taskIsVisible),
              });
            } else {
              customerOption.options.push(task);
            }
          }
          // else: project is not visible to user
        });

        options.push(customerOption);
      }
      // else: customer is not visible to user
    });

    this.options = options;
  });

  matcher(option, searchTerm) {
    const searchStrings = [
      option.name,
      option.parent?.get('name'),
      option.get('customer')?.get('name'),
      option.parent?.get('customer')?.get('name'),
    ].filter((s) => s);
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
  onFocus(api, _event) {
    api.actions.open();
  }

  @action
  onBlur(api, _event) {
    api.actions.close();
  }
}

function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}
