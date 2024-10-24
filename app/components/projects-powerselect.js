import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class ProjectsPowerselectComponent extends Component {
  @service mockData;

  projects = Object.entries(this.mockData.colorMapTailwind).map(
    ([key, value]) => ({ name: key, color: value }),
  );

  get selectedProject() {
    if (!this.args.selectedProject) {
      return null;
    }

    return this.projects.find(
      (project) => this.args.selectedProject === project.name,
    );
  }

  @action
  onChange(value, api, event) {
    this.args.onChange?.(value.name, api, event);
  }

  @action
  onKeydown(api, event) {
    // Bit hacky, we want to open the searchbox
    // as soon as the user starts typing
    // if (!api.isOpen && isLetter(event.key)) {
    //     api.actions.open();
    //     api.actions.search(event.key);
    // }
    if (event.key === 'Enter') {
      event.preventDefault();
    }

    return false;
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