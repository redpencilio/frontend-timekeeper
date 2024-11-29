import { module, test } from 'qunit';
import { setupTest } from 'frontend-timekeeper/tests/helpers';

module('Unit | Service | user-profile', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let service = this.owner.lookup('service:user-profile');
    assert.ok(service);
  });
});
