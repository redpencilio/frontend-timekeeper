import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class LocalStorageService extends Service {
  constructor() {
    super(...arguments);
  }

  @tracked _useAdvancedPopover =
    JSON.parse(window.localStorage.getItem('useAdvancedLogPopover')) ?? false;

  get useAdvancedLogPopover() {
    return this._useAdvancedPopover;
  }

  set useAdvancedLogPopover(value) {
    window.localStorage.setItem('useAdvancedLogPopover', value);
    this._useAdvancedPopover = value;
  }
}
