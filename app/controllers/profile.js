import Controller from '@ember/controller';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ProfileController extends Controller {
  @service userProfile;
  @tracked oldPassword = null;
  @tracked newPassword = null;
  @tracked errorMessage = null;

  @action
  changePassword() {}
}
