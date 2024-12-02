import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class FavouriteTasksRadioGroupComponent extends Component {
  @service store;
  @service userProfile;
}
