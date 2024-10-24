import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';

export default class YearMonthContoller extends Controller {
  untrackedValue = false;

  constructor() {
    super(...arguments);
    // setTimeout(() => (this.test = true), 1000);
  }
}
