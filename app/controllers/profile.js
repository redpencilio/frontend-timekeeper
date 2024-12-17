import Controller from '@ember/controller';
import { service } from '@ember/service';

export default class ProfileController extends Controller {
  @service userProfile;
}
