import { service } from '@ember/service';
import BaseSessionService from 'ember-simple-auth/services/session';

export default class SessionService extends BaseSessionService {
  @service userProfile;

  async handleAuthentication() {
    super.handleAuthentication(...arguments);

    try {
      await this.userProfile.load();
    } catch (err) {
      await this.invalidate();
    }
  }
}
