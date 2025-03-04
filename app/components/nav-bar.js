import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class NavBarComponent extends Component {
  @service userProfile;

  get todayRouteModel() {
    const today = new Date();
    return [today.getFullYear(), today.getMonth() + 1];
  }
}
