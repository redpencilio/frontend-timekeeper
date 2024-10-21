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
  onChange(value) {
    this.args.onChange?.(value.name);
  }
}
