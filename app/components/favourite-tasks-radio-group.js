import Component from '@glimmer/component';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';

export default class FavouriteTasksRadioGroupComponent extends Component {
  @service store;
  @tracked options;

  constructor() {
    super(...arguments);
    this.loadData.perform();
  }

  loadData = task(async () => {
    // TODO update query to make a smarter selection of favourite tasks
    // and share logic with MultiTimeLogPopover component
    const leafTasks = await this.store.query('task', {
      'filter[:has:parent]': 't',
      include: 'parent',
      page: {
        size: 3,
      },
    });

    this.options = leafTasks;
  });
}
