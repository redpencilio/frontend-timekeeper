import Service from '@ember/service';
import ENV from 'frontend-timekeeper/config/environment';

export default class HeadDataService extends Service {
  favicon =
    ENV.environment === 'development'
      ? '/assets/favicon-dev.ico'
      : '/assets/favicon.ico';
}
