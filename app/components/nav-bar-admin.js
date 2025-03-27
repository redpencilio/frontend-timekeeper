import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class NavBarAdminComponent extends Component {
  @service userProfile;

  get currentYear() {
    return new Date().getFullYear();
  }

  get currentMonth() {
    return new Date().getMonth() + 1;
  }
}
