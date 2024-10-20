import { module, test } from 'qunit';
import { setupTest } from 'frontend-timekeeper/tests/helpers';

module('Unit | Service | mock-data', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let service = this.owner.lookup('service:mock-data');
    assert.ok(service);
  });
});
