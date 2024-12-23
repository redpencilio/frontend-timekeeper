import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';

export default class UserMay extends Helper {
  @service userProfile;

  compute([permission]) {
    return this.userProfile.may(permission);
  }
}
