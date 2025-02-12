import Controller from '@ember/controller';
import ENV from 'frontend-timekeeper/config/environment';

export default class ApplicationController extends Controller {
  get isDevelopment() {
    return ENV.environment === 'development';
  }
}
