import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class NavBarAdminComponent extends Component {
  @service userProfile;
}
