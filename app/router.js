import EmberRouter from '@ember/routing/router';
import config from 'frontend-timekeeper/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('year', { path: '/:year' }, function () {
    this.route('month', { path: '/:month' });
  });
  this.route('admin', function () {
    this.route('users', function () {
      this.route('user', { path: '/:user_id' }, function () {
        this.route('holidays', function () {
          this.route('year', { path: '/:year' });
        });
      });
    });
  });
  this.route('forbidden');
  this.route('not-found');
  this.route('login');
  this.route('profile');
});
